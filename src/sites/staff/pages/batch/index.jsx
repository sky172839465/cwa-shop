import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import safeAwait from 'safe-await'
import * as Yup from 'yup'
import { GrMultiple } from 'react-icons/gr'
import { GiTransform } from 'react-icons/gi'
import {
  MdAdd, MdWarning, MdChecklist, MdOutlineRefresh
} from 'react-icons/md'
import toast from 'react-hot-toast'
import {
  filter, flow, get, groupBy, isEmpty, isUndefined, keyBy, map, omit, size
} from 'lodash-es'
import getEnvVar from '../../../../utils/getEnvVar'
import wait from '../../../../utils/wait'
import getApiPrefix from '../../../../utils/getApiPrefix'
import useCreate from '../../../../hooks/useCreate'
import FormLayout from '../../../../components/Form/Layout'
import FormRow from '../../../../components/Form/FormRow'
import FocusError from '../../../../components/Form/FocusError'
import Dropzone from '../../../../components/Dropzone'
import ACCEPT from '../../../../components/Dropzone/accept'
import Table from './Table'
import EditModal from './EditModal'
import { FORM, FORM_ITEM } from './constants'
import useQueue from '../../../../hooks/useQueue'

const putImageHost = getEnvVar('VITE_AWS_PUT_IMAGE_SHOP_HOST')
const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const putImageEndPoint = `${awsHostPrefix}/putimage`
const zipVideoEndPoint = `${awsHostPrefix}/zipvideo`

const ACTION = {
  NEW: 'new',
  UPDATE: 'update'
}

const getGroupAssetsByPrefix = (urls) => {
  return groupBy(urls, (url) => {
    if (url.startsWith('data')) {
      return 'base64'
    }
    return 's3Url'
  })
}

const getParamsListFromRecognitionData = (row = {}) => {
  const { name } = get(row, FORM_ITEM.UPLOAD_FILE, {})
  const {
    fishType,
    itemSerial,
    itemImages = [],
    itemVideo = ''
  } = get(row, FORM_ITEM.RECOGNITION_DATA, {})
  const itemVideos = [itemVideo]
  const [
    { base64: base64Images = [], s3Url: s3Images = [] },
    { base64: base64Videos = [], s3Url: s3Videos = [] }
  ] = [itemImages, itemVideos].map(getGroupAssetsByPrefix)
  const base64Files = [...base64Videos, ...base64Images]
  const paramsList = map(isEmpty(base64Files) ? [''] : base64Files, (fileName, index) => {
    const isNew = index === 0
    return {
      fishType,
      itemSerial,
      action: isNew ? ACTION.NEW : ACTION.UPDATE,
      ...(isEmpty(fileName) ? {} : { file_name: fileName }),
      ...(
        isNew && {
          itemImages: s3Images,
          itemVideos: s3Videos
        }
      )
    }
  })
  return { name, paramsList }
}

const validationSchema = Yup.object().shape({
  [FORM.ROWS]: Yup.array()
    .min(1).required('Miss select video.')
    .of(
      Yup.object().shape({
        [FORM_ITEM.IS_UPLOADED]: Yup.boolean()
          .isTrue().required('Some field has error.')
      })
    )
})

const Batch = () => {
  const [isCalculating, setIsCalculating] = useState(false)
  const [editItem, setEditItem] = useState({})
  const dropzoneRef = useRef()
  const modalRef = useRef()
  const { t } = useTranslation()
  const { trigger: putImage, isMutating: isPutImageMutating } = useCreate(putImageHost)
  const { trigger: zipVideo, isMutating: isZipVideoMutating } = useCreate(putImageHost)
  const { queue } = useQueue({ concurrency: 1 })
  const isMutating = (isPutImageMutating || isZipVideoMutating)

  const onSubmit = async (formValues, formProps) => {
    const toastId = toast.loading('Creating...')
    const rows = get(formValues, FORM.ROWS, [])
    const batchParamsList = map(rows, getParamsListFromRecognitionData)
    const [error, resultList] = await safeAwait(
      Promise.all(map(batchParamsList, async ({ paramsList = [] }) => {
        const [newParams, ...updateParamsList] = paramsList
        const [newError] = await safeAwait(
          putImage({ url: putImageEndPoint, body: newParams })
        )
        if (newError) {
          console.log(newError)
          return { isSuccess: false }
        }

        const [updateError] = await safeAwait(
          Promise.all(updateParamsList.map((param) => {
            return putImage({ url: putImageEndPoint, body: param })
          }))
        )
        if (updateError) {
          console.log(updateError)
          return { isSuccess: false }
        }

        return { isSuccess: true }
      }))
    )

    if (isUndefined(error)) {
      toast.success('Finish!', { id: toastId })
      formProps.resetForm()
      return
    }

    const newRows = filter(rows, (row, index) => {
      const { isSuccess } = get(resultList, index, {})
      return !isSuccess
    })
    toast('Some records not success.', { id: toastId })
    formProps.resetForm({
      values: { [FORM.ROWS]: newRows }
    })
  }

  const onZipVideo = (formProps) => async () => {
    const toastId = toast.loading('Creating...')
    const formValues = get(formProps, 'values', {})
    const rows = get(formValues, FORM.ROWS, [])
    const zipVideoBody = map(rows, (row) => {
      const { paramsList } = getParamsListFromRecognitionData(row)
      const params = get(paramsList, '0', {})
      const zipVideoParams = omit(params, ['action'])
      return zipVideoParams
    })
    const [error] = await safeAwait(
      zipVideo({ url: zipVideoEndPoint, body: { items: zipVideoBody } })
    )

    if (isUndefined(error)) {
      toast.success('Finish!', { id: toastId })
      formProps.resetForm()
      return
    }

    toast('Some records not success.', { id: toastId })
  }

  const onSelectFilesFinish = (formProps) => (newFiles) => {
    return queue.add(async () => {
      const currentRows = get(formProps.values, FORM.ROWS, [])
      const existFileMap = flow(
        () => map(currentRows, (row) => get(row, `${FORM_ITEM.UPLOAD_FILE}.name`)),
        keyBy
      )()
      const rows = [
        ...currentRows,
        ...newFiles
          .filter((newFile) => !(newFile.name in existFileMap))
          .map((newFile) => {
            return {
              [FORM_ITEM.UPLOAD_FILE]: newFile,
              [FORM_ITEM.RECOGNITION_DATA]: undefined,
              [FORM_ITEM.IS_UPLOADED]: false
            }
          })
      ]
      await formProps.setValues({ [FORM.ROWS]: rows })
      await wait(100)
      setIsCalculating(false)
    }, { priority: 1 })
  }

  const onRemove = (formProps) => async (fileName) => {
    return queue.add(() => {
      dropzoneRef.current.removeFileByFileName(fileName)
      const rows = get(formProps.values, FORM.ROWS, [])
      const filteredRows = rows.filter((row) => {
        return fileName !== get(row, `${FORM_ITEM.UPLOAD_FILE}.name`)
      })
      return formProps.setFieldValue(FORM.ROWS, filteredRows)
    }, { priority: 2 })
  }

  const onEdit = (newEditItem) => {
    setEditItem(newEditItem)
    modalRef.current.open()
  }

  const onUpdated = (formProps) => (fileName, newRow) => {
    return queue.add(() => {
      const rows = get(formProps.values, FORM.ROWS, [])
      const targetRowIndex = rows.findIndex((row) => {
        return fileName === get(row, `${FORM_ITEM.UPLOAD_FILE}.name`)
      })
      const targetRow = get(rows, targetRowIndex, {})
      const updatedRow = { ...targetRow, ...newRow }
      return formProps.setFieldValue(`${FORM.ROWS}.${targetRowIndex}`, updatedRow)
    }, { priority: 0 })
  }

  const onCloseEditModal = () => setEditItem({})

  const onRefreshAllFailedRows = () => {
    const refreshBtns = document.querySelectorAll('button[data-role="triggerRefresh"]')
    for (const btn of [...refreshBtns]) {
      btn.click()
    }
  }

  return (
    <Formik
      initialValues={{
        [FORM.VIDEOS]: [],
        [FORM.ROWS]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formProps) => (
        <>
          <Form>
            <FormLayout>
              <div role='alert' className='alert'>
                <GrMultiple size='1.5em' />
                <span>
                  Upload multiple videos
                  or select one folder will upload all videos under selected folder,
                  service will generate information and images,
                  please edit and confirm before submit.
                </span>
              </div>
              <FormRow
                label={`${t('video')}`}
                error={formProps.touched[FORM.VIDEOS] && formProps.errors[FORM.VIDEOS]}
              >
                <Dropzone
                  dropzoneRef={dropzoneRef}
                  name={FORM.VIDEOS}
                  accept={ACCEPT.VIDEO}
                  onStart={() => setIsCalculating(true)}
                  onFinish={onSelectFilesFinish(formProps)}
                  maxSize={Infinity}
                  isShowPreview={false}
                  isSelectFolder
                />
              </FormRow>
              {isEmpty(formProps.values[FORM.ROWS]) && (
                <FormRow>
                  <div role='alert' className='alert grid-flow-col justify-start'>
                    <MdWarning size='1.5em' />
                    <span>No video exist.</span>
                  </div>
                </FormRow>
              )}
              {!isEmpty(formProps.values[FORM.ROWS]) && (
                <FormRow>
                  <div role='alert' className='alert grid-flow-col'>
                    <MdChecklist size='1.5em' />
                    <span>
                      {`Selected ${size(formProps.values[FORM.ROWS])} videos`}
                    </span>
                    <button
                      type='button'
                      className='btn btn-square btn-outline'
                      disabled={formProps.isValid}
                      onClick={onRefreshAllFailedRows}
                    >
                      <MdOutlineRefresh size='1.5em' />
                    </button>
                  </div>
                  <Table
                    onRemove={onRemove}
                    onEdit={onEdit}
                    onUpdated={onUpdated}
                    isCalculating={isCalculating}
                  />
                </FormRow>
              )}
              <div className='space-x-2 text-right'>
                <button
                  type='button'
                  className='btn btn-outline'
                  disabled={(
                    isMutating ||
                    isEmpty(formProps.values[FORM.ROWS]) ||
                    !isEmpty(formProps.errors)
                  )}
                  onClick={onZipVideo(formProps)}
                >
                  <GiTransform size='1.5em' />
                  僅轉檔
                </button>
                <button
                  type='submit'
                  className='btn btn-outline'
                  disabled={(
                    isMutating ||
                    isEmpty(formProps.values[FORM.ROWS]) ||
                    !isEmpty(formProps.errors)
                  )}
                >
                  <MdAdd size='1.5em' />
                  {t('newItem')}
                </button>
              </div>
              <FocusError />
            </FormLayout>
          </Form>
          <EditModal
            modalRef={modalRef}
            editItem={editItem}
            onClose={onCloseEditModal}
            onUpdated={onUpdated}
          />
        </>
      )}
    </Formik>
  )
}

export default Batch

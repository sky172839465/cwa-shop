import { useRef, useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import { MdInfo } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import {
  get,
  isEmpty,
  isUndefined
} from 'lodash-es'
import clx from 'classnames'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import FormRow from '../../../../components/Form/FormRow'
import ACCEPT from '../../../../components/Dropzone/accept'
import Dropzone from '../../../../components/Dropzone'
import getFormValues from '../../../../utils/getFormValues'
import useJsonBlock from '../../../../components/JsonBlock/useJsonBlock'
import useRecoverData from '../../../../hooks/useRecoverData'
import useCreateUploadTankInfo from '../../../../hooks/useCreateUploadTankInfo'
import useGetStaffList from '../../../../hooks/useGetStaffList'
import useRequestRecovery from '../../../../hooks/useRequestRecovery'
import useGetRecoveryStatus from '../../../../hooks/useGetRecoveryStatus'
import Modal from '../../../../components/Modal'

const FORM = {
  EXCEL: 'excel'
}

const RECOVERY_FORM = {
  STAFF_ID: 'staff_id'
}

const validationSchema = Yup.object().shape({
  [FORM.EXCEL]: Yup.array().min(1, 'Miss excel!')
})

const UploadTankInfo = () => {
  const { t } = useTranslation()
  const resetBtn = useRef()
  const modalRef = useRef()
  const [isExcelUploaded, setIsExcelUploaded] = useState(false)
  const [targetRecoveryPoint, setTargetRecoveryPoint] = useState(null)
  const { data: recoverDataResult } = useRecoverData()
  const { trigger: createUploadTankInfo, isMutating: isLoading } = useCreateUploadTankInfo()
  const { trigger: getStaffList, data: staffListData } = useGetStaffList()
  const { trigger: requestRecovery } = useRequestRecovery()
  const { trigger: getRecoveryStatus, data: recoveryStatusData } = useGetRecoveryStatus()
  const staffList = get(staffListData, 'staff_list', [])
  const recoveryStatus = get(recoveryStatusData, 'request_status', '')
  const recoveryStaffName = get(recoveryStatusData, 'staff_name', '')
  const recoverData = get(recoverDataResult, 'results.data', [])
  const [, setJsonBlock] = useJsonBlock()

  useEffect(() => {
    getStaffList()
    getRecoveryStatus()
  }, [getStaffList, getRecoveryStatus])

  const onDropExcels = (excelFiles) => {
    const isAcceptFile = isUndefined(get(excelFiles, '0.code')) && !isEmpty(excelFiles)
    setIsExcelUploaded(isAcceptFile)
    setJsonBlock({})
  }

  const clearForm = () => {
    setIsExcelUploaded(false)
    resetBtn.current.click()
  }

  const onSubmit = async (formValues, { setSubmitting }) => {
    const convertedFormValues = getFormValues(formValues, [FORM.EXCEL])
    const postParams = {
      body: {
        file_name: get(convertedFormValues, `${FORM.EXCEL}.0`)
      }
    }
    const toastId = toast.loading('Uploading...')
    const [createError, result] = await safeAwait(createUploadTankInfo(postParams))
    clearForm()
    setJsonBlock(result)
    if (createError) {
      toast.error(`Error! ${createError.message}`, { id: toastId })
      setSubmitting(false)
    }

    const isFail = get(result, 'status') === 'fail'
    const errorMessage = get(result, 'results.message')
    if (isFail) {
      toast.error(`Error! ${errorMessage}`, { id: toastId })
      return
    }

    toast.success('Finish!', { id: toastId })
    setSubmitting(false)
    setIsExcelUploaded(false)
  }

  const onRecoverClick = (recovery_point) => {
    setTargetRecoveryPoint(recovery_point)
    modalRef.current.open()
  }

  const onConfirmRecovery = async (values) => {
    const toastId = toast.loading(`${t('recover')}...`)
    const [error, result] = await safeAwait(requestRecovery({
      recovery_time: targetRecoveryPoint,
      staff_id: values[RECOVERY_FORM.STAFF_ID]
    }))
    setJsonBlock(result)
    if (error) {
      toast.error(error.message, { id: toastId })
      return
    }

    const isFail = get(result, 'status') === 'fail'
    const errorMessage = get(result, 'results.message')
    if (isFail) {
      toast.error(`Error! ${errorMessage}`, { id: toastId })
      return
    }

    toast.success(get(result, 'results.message', 'Success'), { id: toastId })
    modalRef.current.close()
    getRecoveryStatus()
  }

  return (
    <>
    <Formik
      initialValues={{
        [FORM.EXCEL]: []
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <div role='alert' className='alert'>
            <MdInfo size='1.5em' />
            <span>
              {t('uploadTankInfoDesc')}
            </span>
          </div>
          <FormRow
            label={t('uploadExcelLabel')}
            error={touched[FORM.EXCEL] && errors[FORM.EXCEL]}
            required
          >
            <Dropzone
              name={FORM.EXCEL}
              accept={ACCEPT.EXCEL}
              disabled={isLoading || isExcelUploaded}
              onFinish={onDropExcels}
              isShowPreview={false}
            />
            {isExcelUploaded && (
              <div className='alert alert-success my-4 flex flex-wrap'>
                {`按${t('newItem')}上傳 Excel`}
              </div>
            )}
          </FormRow>
          <div className='flex justify-end gap-2'>
            <button
              ref={resetBtn}
              type='reset'
              className='hidden'
            >
              reset
            </button>
            {recoveryStatus && (
              <button
                type='button'
                className='btn btn-outline pointer-events-none'
              >
                {`${recoveryStatus} + ${recoveryStaffName}`}
              </button>
            )}
            <div className='dropdown dropdown-top dropdown-hover'>
              <div
                tabIndex={0}
                role='button'
                className={clx('btn btn-outline', {
                  'btn-disabled': isEmpty(recoverData)
                })}
              >
                {t('recover')}
              </div>
              <ul
                tabIndex={-1}
                className={clx('menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-2 shadow', {
                    hidden: isEmpty(recoverData)
                })}
              >
                {recoverData.map((item, index) => {
                  return (
                    <li
                      key={index}
                        onClick={() => onRecoverClick(item)}
                    >
                      <span>{item}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <button
              type='submit'
              className='btn btn-outline'
              disabled={isLoading}
            >
              <FaPlus />
                {t('newItem')}
            </button>
          </div>
        </Form>
      )}
    </Formik>
      <Formik
        initialValues={{ [RECOVERY_FORM.STAFF_ID]: '' }}
        validationSchema={Yup.object().shape({
          [RECOVERY_FORM.STAFF_ID]: Yup.string().required('Required')
        })}
        onSubmit={onConfirmRecovery}
      >
        {() => (
          <Modal
            id='recovery-confirm-modal'
            title={t('dataRecoveryConfirmation')}
            modalRef={modalRef}
            isFormModal
            okText={t('confirm')}
            closeText={t('cancel')}
          >
            {(actions) => (
              <Form className='flex flex-col gap-4'>
                <div className='alert alert-error'>
                  <MdInfo size='1.5em' />
                  <span>{targetRecoveryPoint}</span>
                </div>
                <div className='text-sm text-gray-500'>
                  {t('recoveryAuthDescription')}
                </div>
                <FormRow label={t('selectStaff')} required>
                  <Field
                    as='select'
                    name={RECOVERY_FORM.STAFF_ID}
                    className='select select-bordered w-full'
                  >
                    <option value='' disabled>{t('selectStaff')}</option>
                    {staffList.map((staff) => (
                      <option key={staff.staff_id} value={staff.staff_id}>
                        {`(${staff.staff_id}) ${staff.staff_name}`}
                      </option>
                    ))}
                  </Field>
                </FormRow>
                {actions}
              </Form>
            )}
          </Modal>
        )}
      </Formik>
    </>
  )
}

export default UploadTankInfo

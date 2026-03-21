import {
  get,
  isEmpty
} from 'lodash-es'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import safeAwait from 'safe-await'
import useCreateUploadTankInfo from '../../../../hooks/useCreateUploadTankInfo'
import useBettaFishSystemState from '../../../../hooks/useBettaFishSystemState'
import useCreateBettaFishSystemState from '../../../../hooks/useCreateBettaFishSystemState'
import useJsonBlock from '../../../../components/JsonBlock/useJsonBlock'
import useGetLatestReport from '../../../../hooks/useGetLatestReport'

const SYSTEM_TYPE = {
  INTERNAL: 'internal',
  EXTERNAL: 'external'
}

const SYSTEM_TYPE_MAP = {
  [SYSTEM_TYPE.INTERNAL]: '內部',
  [SYSTEM_TYPE.EXTERNAL]: '外部'
}

const SYSTEM_STATUS = {
  ON: 'on',
  OFF: 'off'
}

const SYSTEM_STATUS_MAP = {
  [SYSTEM_STATUS.ON]: '開啟',
  [SYSTEM_STATUS.OFF]: '關閉'
}

const getSystemState = (data) => {
  const isSystemStateFail = get(data, 'status') === 'fail'
  if (isSystemStateFail) {
    return { isSystemStateFail, isOn: false, isOff: false }
  }

  const status = get(data, 'results.systems[0].status')
  const isOn = status === SYSTEM_STATUS.ON
  const isOff = status === SYSTEM_STATUS.OFF
  return { isSystemStateFail: false, isOn, isOff }
}

const Option = (props) => {
  const { label, systemType } = props
  const { t } = useTranslation()
  const { isMutating: isLoading } = useCreateUploadTankInfo()
  const { data: bettaFishSystemStateData } = useBettaFishSystemState({ system_type: systemType })
  const {
    trigger: createBettaFishSystemState,
    data: createBettaFishSystemStateData
  } = useCreateBettaFishSystemState()
  const { isOn } = getSystemState(
    isEmpty(createBettaFishSystemStateData)
      ? bettaFishSystemStateData
      : createBettaFishSystemStateData
  )
  const [, setJsonBlock] = useJsonBlock()

  const onUpdateSystemState = async (e) => {
    const nextChecked = get(e, 'target.checked', false)
    const action = nextChecked ? SYSTEM_STATUS.ON : SYSTEM_STATUS.OFF
    const message = `鬥魚${SYSTEM_TYPE_MAP[systemType]}服務 ${SYSTEM_STATUS_MAP[action]}`
    const toastId = toast.loading(`${message}中...`)
    const [createError, result] = await safeAwait(createBettaFishSystemState({
      action,
      system_type: systemType
    }))
    setJsonBlock(result)
    if (createError) {
      toast.error(`${createError.message}`, { id: toastId })
      return
    }

    const isFail = get(result, 'status') === 'fail'
    const errorMessage = get(result, 'results.message')
    if (isFail) {
      toast.error(`Error! ${errorMessage}`, { id: toastId })
      return
    }

    toast.success(`${message} 成功!`, { id: toastId })
  }

  return (
    <label className='label cursor-pointer'>
      <span className='label-text'>{label}</span>
      <input
        type='checkbox'
        className='toggle toggle-primary'
        onChange={onUpdateSystemState}
        checked={isOn}
        disabled={isLoading}
      />
    </label>
  )
}

const Operation = () => {
  const { t } = useTranslation()
  const { trigger: getLatestReport, isMutating: isGenerating } = useGetLatestReport()
  const [, setJsonBlock] = useJsonBlock()

  const onGenerateLatestReport = async () => {
    const toastId = toast.loading(`${t('generateLatestReport')}...`)
    const [error, result] = await safeAwait(getLatestReport())
    setJsonBlock(result)
    if (error) {
      toast.error(error.message, { id: toastId })
      return
    }
    toast.success(get(result, 'results.message', 'Success'), { id: toastId })
  }

  return (
    <div className='alert flex w-full flex-col items-start gap-4'>
      <div className='flex w-full flex-col gap-4 rounded-md bg-white px-2 py-1'>
        <Option
          label={t('openInternalPlatform')}
          systemType={SYSTEM_TYPE.INTERNAL}
        />
        <Option
          label={t('openExternalPlatform')}
          systemType={SYSTEM_TYPE.EXTERNAL}
        />
      </div>
      <div className='divider !my-0 w-full' />
      <a
        href='https://bettafish4test.uniheart.com.tw/'
        className='btn btn-outline w-full'
      >
        {t('enterInternalSystem')}
      </a>
      <a
        href='https://bettafish.uniheart.com.tw/'
        className='btn btn-outline w-full'
      >
        {t('enterExternalSystem')}
      </a>
      <div className='divider !my-0 w-full' />
      <button
        type='button'
        className='btn btn-outline w-full'
        onClick={onGenerateLatestReport}
        disabled={isGenerating}
      >
        {t('generateLatestReport')}
      </button>
    </div>
  )
}

export default Operation

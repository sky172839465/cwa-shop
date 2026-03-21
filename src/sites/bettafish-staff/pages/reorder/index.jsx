import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import JsonBlock from '../../../../components/JsonBlock'
import UploadNewFish from './UploadNewFish'
import UploadTankInfo from './UploadTankInfo'
import Operation from './Operation'

const Page = () => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('bettafishStaff')
  }, [i18n.language, t])

  return (
    <div className='flex flex-col gap-4 p-4 md:flex-row'>
      <div className='flex size-full grow flex-col gap-2'>
        <UploadNewFish />
        <div className='divider m-auto flex w-full' />
        <UploadTankInfo />
      </div>
      <div className='flex size-full flex-col gap-2 md:max-w-96'>
        <Operation />
        <div className='divider m-auto flex w-full' />
        <JsonBlock className='min-h-[50dvh] w-full' />
      </div>
    </div>
  )
}

export default Page

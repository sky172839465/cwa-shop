import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Root from '../../../components/Root'
import NavBar from '../../../components/NavBar'

const SiteLayout = (props) => {
  const { t } = useTranslation()
  const { appBaseName } = props
  return (
    <Root>
      <NavBar
        appBaseName={appBaseName}
        title={t('quotationStaffTitle')}
      />
      <div className='w-full max-w-full'>
        <Outlet />
      </div>
    </Root>
  )
}

export default SiteLayout

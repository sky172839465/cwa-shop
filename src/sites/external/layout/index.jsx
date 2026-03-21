import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RiBillLine } from 'react-icons/ri'
import Root from '../../../components/Root'
import NavBar from '../../../components/NavBar'
import LangsAction from '../../../components/NavBar/LangsAction'
import UserAction from '../../../components/NavBar/UserAction'
import LogoutAction from '../../../components/NavBar/LogoutAction'

const InternalLink = () => {
  return (
    <a
      className='btn btn-ghost'
      href='https://quotation.uniheart.com.tw/'
    >
      <div
        className='tooltip tooltip-bottom'
        data-tip='報價單系統'
      >
        <RiBillLine size='1.5em' />
      </div>
    </a>
  )
}

const SiteLayout = (props) => {
  const { appBaseName } = props
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('shopLogoTitle')
  }, [i18n.language, t])

  return (
    <Root>
      <NavBar
        appBaseName={appBaseName}
        title={t('shopLogoTitle')}
        actions={(
          <>
            <InternalLink />
            <LangsAction />
            <UserAction fixed />
            <LogoutAction />
          </>
        )}
      />
      <div className='w-full max-w-full'>
        <Outlet />
      </div>
    </Root>
  )
}

export default SiteLayout

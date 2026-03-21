import { Link } from 'react-router-dom'
import { flow, keys } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import Portal from '../../../components/Portal'

const rawLinks = flow(
  () => keys(import.meta.glob('./**/index.jsx')),
  (paths) => paths.map((path) => {
    return path.replace('../', '/').replace('/index.jsx', '')
  }),
  (endpoints) => endpoints.map((endpoint) => ({
    url: endpoint,
    name: endpoint.replace(/\.\/|\//g, '')
  }))
)()

const Demo = () => {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.title = t('bettafishStaff')
  }, [i18n.language, t])

  return (
    <Portal isFixed>
      {rawLinks.map((link) => {
        return (
          <Link
            key={link.url}
            to={link.url}
            className='btn btn-outline btn-lg'
          >
            {t(link.name)}
          </Link>
        )
      })}
    </Portal>
  )
}

export default Demo

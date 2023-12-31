import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  defer
} from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import { preload } from 'swr'
import fetcher from '../../utils/fetcher'
import getApiHost from '../../utils/getApiHost'
import SkeletonHome from '../Skeleton/Home'
import ErrorElement from './ErrorElement.jsx'
import Layout from './Layout'
import NavBar from '../NavBar'
import 'react-loading-skeleton/dist/skeleton.css'

const logoutUrl = import.meta.env.VITE_LOGOUT_URL
const loginUrl = import.meta.env.VITE_LOGIN_URL
const host = getApiHost('VITE_AWS_CHECK_AUTHORIZE')
const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX
const authConfig = {
  host,
  url: `${awsHostPrefix}/checkAuthorize`
}

const withErrorElement = (routes) => routes.map((item) => {
  const {
    element: Comp, ...route
  } = item
  return {
    ...route,
    element: <Comp />,
    errorElement: <ErrorElement />
  }
})

const defaultAuth = { message: 'NO USER' }
const getAuth = () => preload(authConfig, fetcher)
  .then((res) => {
    if (res.message === 'Unauthorized') {
      throw new Error(res.message)
    }
    return res.message
  })
  .catch((e) => {
    console.log(e)
    window.location.href = (
      window.IS_MOCK
        ? window.location.href.replace(window.location.pathname, `${window.APP_BASENAME}/${loginUrl}`)
        : logoutUrl
    )
    return 'ERROR'
  })
const Router = (props) => {
  const { routes, basename = '/', isAuthRoutes = true } = props
  const appBaseName = `${window.APP_BASENAME}${basename}`
  const totalRoutes = [
    {
      element: <Layout appBaseName={appBaseName} />,
      loader: () => {
        const redirectPath = window.sessionStorage.getItem('redirectPath')
        if (!isEmpty(redirectPath)) {
          window.sessionStorage.removeItem('redirectPath')
          const nextPath = redirectPath.replace(window.location.pathname, '')
          return redirect(nextPath.startsWith('/') ? nextPath : `/${nextPath}`)
        }

        return isAuthRoutes
          ? defer({ message: getAuth() })
          : defaultAuth
      },
      children: withErrorElement([
        ...routes,
        {
          path: '/test',
          element: SkeletonHome
        },
        {
          path: '/*',
          element: ErrorElement
        }
      ])
    }
  ]
  // console.log(totalRoutes, appBaseName)
  const router = createBrowserRouter(totalRoutes, { basename: appBaseName })
  return (
    <Suspense
      fallback={(
        <>
          <NavBar fixed />
          <SkeletonHome className='fixed top-0 z-0' />
        </>
      )}
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default Router

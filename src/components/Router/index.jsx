import { Suspense } from 'react'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import SkeletonHome from '../Skeleton/Home'
import ErrorElement from './ErrorElement'
import 'react-loading-skeleton/dist/skeleton.css'

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

const Router = (props) => {
  const {
    routes,
    basename = '/',
    layout: SiteLayout,
    loader: siteLoader
  } = props
  const appBaseName = `${window.APP_BASENAME}${basename}`
  const totalRoutes = [
    {
      element: <SiteLayout appBaseName={appBaseName} />,
      loader: siteLoader,
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
        <SkeletonHome className='fixed top-0 z-0' />
      )}
    >
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default Router

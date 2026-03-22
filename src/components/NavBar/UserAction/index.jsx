import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'
import useSWR from 'swr'
import getEnvVar from '../../../utils/getEnvVar'
import getApiPrefix from '../../../utils/getApiPrefix'

const User = () => {
  const data = useLoaderData()
  return (
    <Suspense fallback={<span>Loading</span>}>
      <Await
        resolve={data.message}
        errorElement={<span>Error</span>}
      >
        {(message) => message}
      </Await>
    </Suspense>
  )
}

const UserAction = (props) => {
  const { fixed, subPrefix } = props
  const host = getEnvVar('VITE_AWS_CHECK_AUTHORIZE')
  const awsHostPrefix = getApiPrefix(subPrefix)
  const isEnabled = typeof subPrefix === 'string'
  const { data, error, isLoading } = useSWR(
    isEnabled ? { host, url: `${awsHostPrefix}/checkAuthorize` } : null
  )

  const getTip = () => {
    if (!isEnabled) {
      return `v${window.APP_VERSION}`
    }

    if (isLoading) {
      return '載入中'
    }

    if (error) {
      return '發生錯誤'
    }

    if (data?.message === 'Unauthorized') {
      return '未登入'
    }

    return data?.message || '未登入'
  }

  return (
    <div className='btn btn-ghost'>
      <div
        className='tooltip tooltip-bottom'
        data-tip={getTip()}
      >
        <span className='max-sm:hidden'>
          {fixed ? <FaUserCircle size='1.5em' /> : <User />}
        </span>
        <FaUserCircle className='md:hidden' size='1.5em' />
      </div>
    </div>
  )
}

export default UserAction

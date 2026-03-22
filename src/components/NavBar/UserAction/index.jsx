import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'

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

const Tip = (props) => {
  const { isEnabled, data } = props
  const getTip = (message) => {
    if (!isEnabled) {
      return `v${window.APP_VERSION}`
    }

    if (message === 'Unauthorized' || !message) {
      return '未登入'
    }

    return message
  }

  return (
    <Suspense fallback='載入中'>
      <Await
        resolve={data.message}
        errorElement='發生錯誤'
      >
        {(message) => getTip(message)}
      </Await>
    </Suspense>
  )
}

const UserAction = (props) => {
  const { fixed, subPrefix } = props
  const isEnabled = typeof subPrefix === 'string'
  const data = useLoaderData()

  return (
    <div className='btn btn-ghost'>
      <div
        className='tooltip tooltip-bottom'
        data-tip={<Tip isEnabled={isEnabled} data={data} />}
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

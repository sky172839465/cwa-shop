import { Suspense } from 'react'
import { Await, useLoaderData } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'

const UserAction = (props) => {
  const { fixed, subPrefix } = props
  const isEnabled = typeof subPrefix === 'string'
  const data = useLoaderData()

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
    <div className='btn btn-ghost'>
      <Suspense fallback={<FaUserCircle size='1.5em' />}>
        <Await
          resolve={data.message}
          errorElement={<span>Error</span>}
        >
          {(message) => (
            <div
              className='tooltip tooltip-bottom'
              data-tip={getTip(message)}
            >
              <span className='max-sm:hidden'>
                {fixed ? <FaUserCircle size='1.5em' /> : message}
              </span>
              <FaUserCircle className='md:hidden' size='1.5em' />
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export default UserAction

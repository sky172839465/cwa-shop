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

const UserAction = (props) => {
  const { fixed, subPrefix } = props
  const data = useLoaderData()

  const getTip = () => {
    if (typeof subPrefix !== 'string') {
      return `v${window.APP_VERSION}`
    }

    if (!data?.message) {
      return '未登入'
    }

    return data.message
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

import { useLoaderData } from 'react-router-dom'
import { FaUserCircle } from 'react-icons/fa'

const UserAction = (props) => {
  const { fixed, subPrefix } = props
  const isEnabled = typeof subPrefix === 'string'
  const data = useLoaderData()
  const message = data?.message

  const getTip = () => {
    if (!isEnabled) {
      return `v${window.APP_VERSION}`
    }

    if (message === 'Unauthorized' || !message) {
      return '未登入'
    }

    return message
  }

  const userMessage = (message === 'Unauthorized' || !message) ? '' : message

  return (
    <div className='btn btn-ghost'>
      <div
        className='tooltip tooltip-bottom'
        data-tip={getTip()}
      >
        <span className='max-sm:hidden'>
          {fixed || !userMessage ? <FaUserCircle size='1.5em' /> : userMessage}
        </span>
        <FaUserCircle className='md:hidden' size='1.5em' />
      </div>
    </div>
  )
}

export default UserAction

import { isUndefined } from 'lodash-es'
import clx from 'classnames'

const Model = (props) => {
  const {
    id, title, children, modalLayoutClassName
  } = props
  return (
    <dialog id={id} className='modal'>
      <div
        className={clx(
          'modal-box',
          { [modalLayoutClassName]: modalLayoutClassName }
        )}
      >
        <form method='dialog'>
          {/* if there is a button in form, it will close the modal */}
          <button type='submit' className='btn btn-circle btn-ghost btn-sm absolute right-2 top-2'>✕</button>
        </form>
        {!isUndefined(title) && (
          <h3 className='text-lg font-bold'>{title}</h3>
        )}
        {children}
        <div className='modal-action'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button type='submit' className='btn'>Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default Model

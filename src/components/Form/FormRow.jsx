import clx from 'classnames'

const FormRow = (props) => {
  const {
    children, label, required, error, counter, className
  } = props
  return (
    <div
      className={clx(
        'mb-2 w-full',
        { [className]: className }
      )}
    >
      <label className='label'>
        <span>
          {label}
          {required ? (<span className='px-1 font-bold text-red-400'>*</span>) : null}
        </span>
      </label>
      {children}
      <div className='label'>
        <span className='text-xs text-red-400 empty:before:inline-block'>{error}</span>
        <span className='text-xs'>{counter}</span>
      </div>
    </div>
  )
}

export default FormRow

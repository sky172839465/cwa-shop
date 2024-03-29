import clx from 'classnames'

const FormRow = (props) => {
  const {
    children, label, required, error, counter, className
  } = props
  return (
    <div
      className={clx(
        'form-control mb-2 w-full',
        { [className]: className }
      )}
    >
      <label className='label'>
        <span className='label-text'>
          {label}
          {required ? (<span className='px-1 font-bold text-red-400'>*</span>) : null}
        </span>
      </label>
      {children}
      <label className='label'>
        <span className='label-text-alt text-red-400 empty:before:inline-block'>{error}</span>
        <span className='label-text-alt'>{counter}</span>
      </label>
    </div>
  )
}

export default FormRow

import clx from 'classnames'

/**
 * FormRow component wraps form inputs with a label and error display
 * @param {object} props
 * @param {string} [props.inputId] - Optional id to link label to input via htmlFor.
 *                                    When provided, ensure the child input has
 *                                    matching id attribute.
 * @param {string} props.label - Label text
 * @param {boolean} [props.required] - Shows required asterisk
 * @param {string} [props.error] - Error message to display
 * @param {string} [props.counter] - Counter text to display
 * @param {string} [props.className] - Additional CSS classes
 */
const FormRow = (props) => {
  const {
    children, label, required, error, counter, className, inputId
  } = props
  return (
    <div
      className={clx(
        'form-control mb-2 w-full',
        { [className]: className }
      )}
    >
      <label className='label' htmlFor={inputId}>
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

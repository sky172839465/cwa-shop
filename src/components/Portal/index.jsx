const Portal = (props) => {
  const { children } = props
  return (
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='flex flex-wrap justify-center max-sm:flex-col max-sm:space-y-4 sm:flex-row sm:space-x-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Portal

import clx from 'classnames'
import Logo from './Logo'

const NavBar = (props) => {
  const {
    fixed,
    appBaseName,
    title,
    actions
  } = props

  return (
    <div
      className={clx(
        'navbar sticky bg-base-100 shadow-sm z-10 flex justify-between items-center',
        { fixed }
      )}
    >
      <div className=''>
        <Logo appBaseName={appBaseName}>
          {title}
        </Logo>
      </div>
      <div className='flex justify-end'>
        <div className='flex items-stretch'>
          {actions}
        </div>
      </div>
    </div>
  )
}

export default NavBar

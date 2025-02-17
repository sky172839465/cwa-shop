import { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import clx from 'classnames'
import { isUndefined } from 'lodash-es'

const withBadgeBtn = (indicator, component) => {
  if (!indicator) {
    return component
  }

  return (
    <div className='indicator fixed bottom-2 right-2'>
      <span
        className={clx(
          'badge indicator-item badge-primary top-[-2.5rem] right-[2.5rem] absolute'
        )}
      >
        {indicator}
      </span>
      {component}
    </div>
  )
}

const Drawer = (props) => {
  const {
    id,
    children,
    items,
    bottomItems,
    openIcon: OpenIcon,
    closeIcon: CloseIcon = MdOutlineClose,
    overlay = false,
    indicator = false,
    defaultOpen = false,
    className,
    drawerContentClassName,
    lastItem
  } = props
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const isBottomItemsExist = !isUndefined(bottomItems)

  return (
    <div
      className={clx(
        'drawer drawer-end max-sm:h-full lg:drawer-open'
      )}
    >
      <input
        id={id}
        type='checkbox'
        className='drawer-toggle'
        defaultChecked={defaultOpen}
      />
      <div
        className={clx(
          'drawer-content m-auto h-full',
          { [drawerContentClassName]: drawerContentClassName }
        )}
      >
        {children}
        {withBadgeBtn(
          indicator,
          (
            <label
              htmlFor={id}
              className={clx(
                'btn btn-square glass btn-outline drawer-button bottom-2 right-2 fixed lg:hidden',
                { hidden: isOpen }
              )}
              onClick={() => setIsOpen(true)}
            >
              <OpenIcon size='2em' />
            </label>
          )
        )}
      </div>
      <div
        className={clx(
          'drawer-side md:z-[1] max-md:z-10 md:h-[calc(100dvh-4rem)] md:top-[4rem]'
        )}
      >
        {
          overlay && (
            <label
              htmlFor={id}
              aria-label='close sidebar'
              className={clx(
                'drawer-overlay lg:hidden'
              )}
              onClick={() => setIsOpen(false)}
            />
          )
        }
        <div className='menu min-h-full w-full bg-base-200 p-0'>
          {overlay && (
            <ul className='menu w-full'>
              <li
                className={clx(
                  'max-lg:mb-14'
                )}
              >
                <label
                  htmlFor={id}
                  className={clx(
                    'btn btn-square btn-outline drawer-button absolute left-2 lg:hidden'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <CloseIcon size='2em' />
                </label>
              </li>
            </ul>
          )}
          <div className='h-full max-h-[50dvh] flex-1 overflow-y-scroll'>
            <ul
              className={clx(
                'menu w-full md:min-w-80 bg-base-200 p-4 text-base-content',
                { 'h-full': !isBottomItemsExist },
                { [className]: className }
              )}
            >
              {/* Sidebar content here */}
              {items}
            </ul>
          </div>
          {
            isBottomItemsExist && (
              <div
                className={clx(
                  'h-full flex-1 content-end overflow-y-scroll',
                  {
                    'max-h-[32dvh]': lastItem,
                    'max-h-[46dvh]': !lastItem
                  }
                )}
              >
                <ul
                  className={clx(
                    'menu max-sm:w-full md:min-w-80 bg-base-200 p-4 text-base-content relative max-lg:top-[70%] max-sm:top-auto lg:top-auto',
                    { [className]: className }
                  )}
                >
                  {bottomItems}
                </ul>
              </div>
            )
          }
          {
            lastItem && (
              <div className='flex-none'>
                <ul className='menu'>
                  {lastItem}
                </ul>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Drawer

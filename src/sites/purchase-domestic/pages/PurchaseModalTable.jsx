import { useEffect } from 'react'
import { Field, useFormikContext } from 'formik'
import clx from 'classnames'
import { isEmpty } from 'lodash-es'
import { FaEye } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { FORM_ITEM } from './constants'
import FieldError from '../../../components/Form/FieldError'

const PurchaseModalTable = (props) => {
  const { t } = useTranslation()
  const { rowData = {}, isAddToCart, disabled } = props
  const { setValues, values } = useFormikContext()
  const editable = (!disabled && isAddToCart)
  const {
    fish_name,
    fish_code,
    fish_size,
    unit_price,
    retail_price,
    inventory,
    min_purchase_quantity,
    group,
    note,
    video_links: videos = [],
    image_links: images = [],
    quantity = 0
  } = values
  const isOverviewBtnDisabled = (
    isEmpty(videos) && isEmpty(images)
  )

  // Calculate dynamic description for purchase quantity
  const getPurchaseDescription = () => {
    if (!quantity || !group) {
      return ''
    }
    const totalFish = quantity * group
    return ` (${quantity} 組 / 總共 ${totalFish} 隻)`
  }

  const onViewFiles = () => {
    const element = document.querySelector(`#view-file-btn-${fish_code}`).click()
    if (!element) {
      return
    }
    element.click()
  }

  useEffect(() => {
    setValues(rowData)
  }, [setValues, rowData])

  return (
    <div className='m-4 rounded-box border border-base-200'>
      <table className='table table-sm'>
        <tbody>
          <tr>
            <td>{t('fishName')}</td>
            <td>{fish_name}</td>
          </tr>
          <tr>
            <td>{t('fishSize')}</td>
            <td>{fish_size}</td>
          </tr>
          <tr>
            <td>{t('unitPrice')}</td>
            <td>{unit_price}</td>
          </tr>
          <tr>
            <td>{t('retailPrice')}</td>
            <td>{retail_price}</td>
          </tr>
          <tr>
            <td>{t('inventory')}</td>
            <td>{inventory}</td>
          </tr>
          <tr>
            <td>{t('minPurchaseQuantity')}</td>
            <td>{min_purchase_quantity}</td>
          </tr>
          <tr>
            <td>{t('purchaseBySet')}</td>
            <td>{`${group} 對`}</td>
          </tr>
          <tr>
            <td>{t('note')}</td>
            <td>{note}</td>
          </tr>
          <tr>
            <td>{t('purchaseQuantity')}</td>
            <td>
              <FieldError name={FORM_ITEM.QUANTITY}>
                <Field
                  name={FORM_ITEM.QUANTITY}
                  type='text'
                  inputMode='numeric'
                  className={clx(
                    'input input-bordered w-full lg:max-w-xs',
                    { '!text-black': !editable }
                  )}
                  min={min_purchase_quantity}
                  placeholder={inventory === -1 ? '無上限' : ''}
                  disabled={!editable}
                  autoComplete='off'
                />
              </FieldError>
              {group > 0 && quantity > 0 && (
                <div className='mt-1 text-sm text-gray-600'>
                  {getPurchaseDescription()}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <td>{t('specialRequirement')}</td>
            <td>
              <Field
                as='textarea'
                name={FORM_ITEM.REQUEST}
                className='textarea textarea-bordered w-full resize-none'
                disabled={!editable}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <button
                type='button'
                className='btn btn-md w-full'
                disabled={!editable || isOverviewBtnDisabled}
                onClick={onViewFiles}
              >
                <FaEye
                  className='!fill-indigo-500'
                />
                檢視
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PurchaseModalTable

import { useTranslation } from 'react-i18next'
import { map } from 'lodash-es'
import CartBottomItems from '../../../components/CartBottomItems'

const CustomCartBottomItems = (props) => {
  const { t } = useTranslation()
  const {
    cart: {
      total_price,
      total_quantity,
      total_discount_amt = 0,
      discounts = []
    } = {}
  } = props
  const actualPayment = total_price - total_discount_amt
  const customItems = [
    <details open>
      <summary>
        {`${t('totalDiscount')}: ${total_discount_amt}`}
      </summary>
      <ul>
        {map(discounts, (discount, index) => {
          const { type, discount_amt } = discount
          return (
            <li key={index}>
              <a href='void:(0)'>
                {`${type} ${discount_amt}`}
              </a>
            </li>
          )
        })}
      </ul>
    </details>,
    `${t('totalCount')}: ${new Intl.NumberFormat('en-US').format(total_quantity)}`,
    `${t('totalPrice')}: ${`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(total_price)} NTD`}`,
    `${t('actualPayment')}: ${`${new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(actualPayment)} NTD`}`
  ]
  return (
    <CartBottomItems
      items={customItems}
      confirmLinkTo='./confirm'
      confirmLinkText={`${t('confirmOrder')}`}
      showConfirmBtn={false}
    />
  )
}

export default CustomCartBottomItems

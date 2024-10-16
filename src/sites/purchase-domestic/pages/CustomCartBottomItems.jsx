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
  const customItems = [
    <details open>
      <summary>
        {`總折扣: ${total_discount_amt}`}
      </summary>
      <ul>
        {map(discounts, (discount) => {
          const { type, discount_amt } = discount
          return (
            <li>
              <a href='void:(0)'>
                {`${type} ${discount_amt}`}
              </a>
            </li>
          )
        })}
      </ul>
    </details>,
    `${t('totalCount')}: ${total_quantity}`,
    `${t('totalPrice')}: ${total_price}`
  ]
  return (
    <CartBottomItems
      items={customItems}
      confirmLinkTo='./confirm'
      confirmLinkText={`${t('confirmOrder')}`}
    />
  )
}

export default CustomCartBottomItems

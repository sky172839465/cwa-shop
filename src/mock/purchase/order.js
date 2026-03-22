import {
  get,
  isString, random, size, times
} from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

const FISH_SIZES = ['M', 'L', 'XL']

const statusList = [
  { status: 'fail', message: '購買數量大於庫存' },
  { status: 'success', message: '正常' },
  { status: 'fail', message: '購買數量大於庫存2' },
  { status: 'success', message: '正常' },
  { status: 'success', message: '正常' },
  { status: 'success', message: '正常' }
]

const videos = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
]

const getFakeImage = (width, height, text) => {
  return `https://dummyimage.com/${width}x${height}/?text=${text}&font=lobster&font_size=50`
}

const getRecommendations = () => {
  return {
    results: times(random(2, 5)).map((index) => {
      const fish_code = `FF120L${index}`
      const quantity = `${random(20, 40)}`
      const request = ['smaller', 'bigger', ''][random(0, 2)]
      const fishName = `fish_name_${index}`
      return {
        fish_code,
        scientific_name: `scientific_name_${index}`,
        quantity,
        request,
        group: `${random(1, 5)}`,
        fish_name: fishName,
        fish_size: FISH_SIZES[random(0, 2)],
        unit_price: `${random(10, 100)}.0`,
        retail_price: `${random(10, 100)}.0`,
        inventory: random(20, 100),
        note: ['', `note_${index}`][random(0, 1)],
        image_link: getFakeImage(100, 100, fishName),
        video_link: videos[random(0, 2)],
        ...(statusList[random(0, size(statusList - 1))])
      }
    })
  }
}

export default [
  {
    url: `${awsHostPrefix}/prepurchaseorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const order_items = get(isString(body) ? JSON.parse(body) : body, 'order_items', [])
      return {
        status: 'success',
        results: {
          items: order_items.map(({ fish_code, quantity, request = '', group = `${random(1, 5)}` }) => {
            return {
              fish_code,
              fish_name: `fish_name_${fish_code}`,
              fish_size: 'M',
              quantity,
              request,
              unit_price: `${random(100, 200)}.0`,
              group,
              image_link: getFakeImage(100, 100, fish_code),
              video_link: videos[random(0, 2)],
              ...(statusList[random(0, size(statusList - 1))])
            }
          }),
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          total_quantity: `${random(10, 100)}`,
          total_price: `${random(100, 200)}.00`
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/prepurchaseorder`,
    method: 'get',
    timeout: 100,
    response: () => {
      const { results } = getRecommendations()
      return {
        status: 'success',
        results: {
          total_quantity: `${random(5, 10)}`,
          total_price: `${random(10, 20)}.00`,
          discounts: times(random(1, 3)).map((index) => {
            return {
              type: `優惠方案${index}`,
              discount_amt: `${random(100, 500)}`
            }
          }),
          items: results
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/confirmorder`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        SendMessageResponse: {
          ResponseMetadata: {
            RequestId: `f9195ba7-e29d-58d5-9fbe-${random(1000, 9999)}`
          },
          SendMessageResult: {
            MD5OfMessageBody: 'f7da2aca7114f1b6ff07d516d57bdac7',
            MessageId: `msg_${new Date().getTime()}`
          }
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/exportprepurchaseorder`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const order_items = get(isString(body) ? JSON.parse(body) : body, 'order_items', [])
      return {
        status: 'success',
        results: {
          items: order_items.map(({ fish_code, quantity, request, group = '1' }) => {
            return {
              fish_code,
              fish_name: `fish_name_${fish_code}`,
              fish_size: 'L',
              quantity,
              request,
              unit_price: `${random(1000, 2000)}.0`,
              group,
              image_link: getFakeImage(100, 100, fish_code),
              video_link: videos[random(0, 2)],
              ...(statusList[random(0, size(statusList - 1))])
            }
          }),
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          total_quantity: `${random(10, 100)}`,
          total_price: `${random(100, 200)}.00`
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/exportprepurchaseorder`,
    method: 'get',
    timeout: 100,
    response: () => {
      const { results } = getRecommendations()
      return {
        status: 'success',
        results: {
          total_quantity: `${random(5, 10)}`,
          total_price: `${random(10, 20)}.00`,
          discounts: [
            {
              type: '優惠方案',
              discount_amt: `${random(100, 500)}`
            }
          ],
          items: results
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/exportconfirmorder`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: ''
      }
    }
  }
]

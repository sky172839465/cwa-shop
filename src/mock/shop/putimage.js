import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/putimage`,
    method: 'post',
    timeout: 100,
    response: ({ body = {} }) => {
      const {
        itemSerial = '456',
        fishType = 'FF1322L'
      } = body
      return {
        status: 'success',
        results: {
          itemImages: [
            'https://serverless-resize.s3.ap-southeast-1.amazonaws.com/origin/aaa.png'
          ],
          itemVideos: [
            'https://serverless-resize.s3.ap-southeast-1.amazonaws.com/origin/bbb.mp4'
          ],
          itemSerial,
          fishType,
          onSite: new Date().toISOString(),
          booked: ''
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/zipvideo`,
    method: 'post',
    timeout: 100,
    response: () => ({
      status: 'success',
      reason: '已傳送'
    })
  }
]

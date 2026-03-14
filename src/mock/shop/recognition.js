import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/getRecognition`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const { fileKey = '1709957554786.MOV' } = JSON.parse(JSON.stringify(stringObject))
      return {
        status: 'success',
        results: {
          itemVideo: `https://bettafish.uniheart.com.tw/origin/${fileKey.replace('.MOV', '.mp4')}`,
          fishType: 'FF1301L',
          itemSerial: '111',
          originItemImage: 'https://serverless-resize.s3.ap-southeast-1.amazonaws.com/origin/2831531024905733811.jpeg'
        }
      }
    }
  }
]

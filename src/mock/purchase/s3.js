import { times } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const MOCK_SIGNED_URL = `${awsHostPrefix}/mockSignedUrl`

export default [
  {
    url: `${awsHostPrefix}/presignedurls`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const {
        parts = 1,
        file_name = 'mockFile.zip'
      } = JSON.parse(JSON.stringify(stringObject))
      return {
        fileId: 'SdNmR__VjCtFb6rfEPYQmnXOrT22gMOODs1XZLMR58Oum_C399tPJrN36oTqDUbYrdRALajJICFO7nQVDvXCUBy9.9aeyiOWZLH61JqDd7wIp3f9OjoIs1U3hIEJyHSnzHR1a0M6S6B1gcHlPjrrTloN4mffnEheTTaaHrYgF1s-',
        fileKey: `tmp/${file_name}`,
        parts: times(+parts, (index) => {
          const PartNumber = index + 1
          return {
            signedUrl: `${MOCK_SIGNED_URL}?part=${PartNumber}`,
            PartNumber
          }
        })
      }
    }
  },
  {
    url: MOCK_SIGNED_URL,
    method: 'put',
    timeout: 100,
    response: () => ({})
  },
  {
    url: `${awsHostPrefix}/uploadfinalize`,
    method: 'post',
    timeout: 100,
    response: () => ({
      status: 'success',
      message: '成功完成上傳'
    })
  }
]

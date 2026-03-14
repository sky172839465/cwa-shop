import { times } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'

const MOCK_SIGNED_URL = `${getApiPrefix()}/mockSignedUrl`

export default [
  {
    url: `${getApiPrefix()}/getPreSignedUrls`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const {
        parts = 1
      } = JSON.parse(JSON.stringify(stringObject))
      return {
        fileId: 'SdNmR__VjCtFb6rfEPYQmnXOrT22gMOODs1XZLMR58Oum_C399tPJrN36oTqDUbYrdRALajJICFO7nQVDvXCUBy9.9aeyiOWZLH61JqDd7wIp3f9OjoIs1U3hIEJyHSnzHR1a0M6S6B1gcHlPjrrTloN4mffnEheTTaaHrYgF1s-',
        fileKey: 'tmp/mockFileKey.mov',
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
    url: `${getApiPrefix()}/finalize`,
    method: 'post',
    timeout: 100,
    response: () => ({
      status: 'success',
      message: '成功完成上傳'
    })
  }
]

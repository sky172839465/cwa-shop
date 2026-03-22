import { get } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/checkAuthorize`,
    method: 'get',
    timeout: 100,
    statusCode: 200,
    response: (response) => {
      const authorization = get(response, 'headers.authorization')
      if (authorization === 'Bearer MOCK_TOKEN') {
        return { message: 'MOCK USER' }
      }
      return { message: 'Unauthorized', reason: 'Token missing' }
    }
  }
]

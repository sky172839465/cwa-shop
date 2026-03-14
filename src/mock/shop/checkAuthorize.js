import { get, isEmpty } from 'lodash-es'
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
      if (isEmpty(authorization)) {
        // vite-plugin-mock doesn't easily support dynamic status codes in a simple response function
        // but we can return the error body.
        return { message: 'Unauthorized', reason: 'Token missing' }
      }
      return { message: 'MOCK USER' }
    }
  }
]

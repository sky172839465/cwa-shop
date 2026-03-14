import { random } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/uploadquotation`,
    method: 'post',
    timeout: 100,
    response: () => {
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          validation: 'passed',
          success_count: 5,
          fail_count: 0
        }
        : {
          validation: 'failed',
          success_count: 0,
          fail_count: 1,
          fail_description: ['Excel驗證未通過']
        }
      return {
        status: isSuccess ? 'success' : 'fail',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/uploaddiscountplan`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          success_count: random(0, 1000),
          fail_count: random(0, 100),
          fail_description: ['欄位不符', null][random(0, 1)]
        }
      }
    }
  }
]

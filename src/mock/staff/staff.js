import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/getstafflist`,
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          message: '員工列表獲取成功',
          staff_list: [
            {
              staff_id: 'user001',
              staff_name: '張三',
              staff_email: 'zhang.san@company.com'
            },
            {
              staff_id: 'staff_001',
              staff_name: '李四',
              staff_email: 'li.si@company.com'
            }
          ]
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/requestrecovery`,
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          message: '成功獲取請求狀態',
          request_status: 'pending',
          staff_id: 'staff_001',
          staff_name: '李四'
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/requestrecovery`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          message: '成功創建恢復請求',
          request_id: `req_${new Date().getTime()}`,
          request_status: 'pending',
          expire_time: new Date(Date.now() + 3600000).toISOString()
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/recoveryauth`,
    method: 'get',
    timeout: 100,
    response: () => {
      return '<html><body><h1>Authorization Successful</h1></body></html>'
    }
  },
  {
    url: `${awsHostPrefix}/recoveredata`,
    method: 'post',
    timeout: 100,
    response: ({ body }) => {
      const { recovery_point } = body
      return {
        status: 'success',
        results: {
          message: '數據恢復成功',
          recovered_to: recovery_point
        }
      }
    }
  }
]

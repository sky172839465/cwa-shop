import { random } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)

export default [
  {
    url: `${awsHostPrefix}/systemstate`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const {
        system_type = 'empty'
      } = JSON.parse(JSON.stringify(stringObject))
      const results = {
        systems: system_type === 'empty'
          ? [
            { system_type: 'external', status: true },
            { system_type: 'internal', status: false }
          ]
          : [{
            system_type,
            status: [true, false][random(0, 1)]
          }]
      }
      return {
        status: 'success',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/systemstate`,
    method: 'post',
    timeout: 100,
    response: ({ body = {} }) => {
      const {
        system_type,
        action
      } = body
      const results = {
        message: '系統狀態更新成功',
        systems: [{
          system_type,
          status: action === 'on' || action === true
        }]
      }
      return {
        status: 'success',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/demandreport`,
    method: 'get',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        reason: '已寄發信件'
      }
    }
  },
  {
    url: `${awsHostPrefix}/uploaddemandreport`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          success_count: 3942,
          fail_count: 30,
          fail_description: '欄位不符',
          success_ids: ['order_id_1', 'order_id_2']
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/uploadpurchaseorder`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          success_count: 150,
          fail_count: 5,
          fail_description: '數據格式錯誤',
          success_ids: ['po_001', 'po_002']
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/uploadshippingorder`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          success_count: 100,
          fail_count: 0,
          fail_description: ''
        }
      }
    }
  }
]

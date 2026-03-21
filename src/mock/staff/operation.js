import { random } from 'lodash-es'
import getApiPrefix from '../../utils/getApiPrefix'
import getEnvVar from '../../utils/getEnvVar'

const subPrefix = getEnvVar('VITE_AWS_SHOP_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const commonV2Host = getEnvVar('VITE_AWS_COMMON_HOST_V2')

export default [
  {
    url: `${commonV2Host}/default/betta/get_latest_report`,
    method: 'post',
    timeout: 100,
    response: () => {
      return {
        status: 'success',
        results: {
          message: '訂單總表生成中，請檢查郵件'
        }
      }
    }
  },
  {
    url: `${awsHostPrefix}/uploadnewfish`,
    method: 'post',
    timeout: 100,
    response: () => {
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          message: '新購進魚資料處理完成',
          success_count: 42,
          fail_count: 1,
          validation_errors: [
            {
              row_number: 5,
              field_name: 'fishType',
              error_message: '魚種編號不存在'
            }
          ],
          download_url: 'https://cwafightfish2.s3.ap-southeast-1.amazonaws.com/results/upload_result_20260306.xlsx'
        }
        : {
          message: '文件格式錯誤',
          fail_count: 2,
          validation_errors: [
            {
              row_number: 3,
              field_name: '進貨數量',
              error_message: '必須為正整數'
            },
            {
              row_number: 5,
              field_name: '廠商代碼',
              error_message: '代碼格式不正確'
            }
          ]
        }
      return {
        status: 'success',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/uploadtankinfo`,
    method: 'post',
    timeout: 100,
    response: () => {
      const isSuccess = random(0, 5) > 1
      const results = isSuccess
        ? {
          message: '櫃位資料更新完成，已備份舊資料',
          backup_id: `backup_${new Date().getTime()}`,
          backup_time: new Date().toISOString(),
          success_count: 120,
          fail_count: 0,
          validation_errors: []
        }
        : {
          message: '文件格式錯誤',
          validation_errors: [
            {
              field_name: '文件格式',
              error_message: '必須為有效的Excel文件'
            }
          ]
        }
      return {
        status: 'success',
        results
      }
    }
  },
  {
    url: `${commonV2Host}/default/recoveredata`,
    method: 'get',
    timeout: 100,
    response: () => {
      const results = {
        message: '成功獲取可恢復時間點列表',
        data: [
          '2025-09-24T10:00:00Z',
          '2025-09-25T10:00:00Z'
        ]
      }
      return {
        status: 'success',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/bettafishsystemstate`,
    method: 'get',
    timeout: 100,
    response: ({ query: stringObject }) => {
      const {
        system_type = 'empty'
      } = JSON.parse(JSON.stringify(stringObject))
      const results = {
        message: '成功返回系統狀態',
        systems: system_type === 'empty'
          ? [
            { system_type: 'external', status: 'on' },
            { system_type: 'internal', status: 'off' }
          ]
          : [{
            system_type,
            status: ['on', 'off'][random(0, 1)]
          }]
      }
      return {
        status: 'success',
        results
      }
    }
  },
  {
    url: `${awsHostPrefix}/bettafishsystemstate`,
    method: 'post',
    timeout: 100,
    response: ({ body = {} }) => {
      const {
        system_type,
        action
      } = body
      const results = {
        message: '鬥魚系統狀態更新成功',
        systems: [{
          system_type,
          status: action
        }]
      }
      return {
        status: 'success',
        results
      }
    }
  }
]

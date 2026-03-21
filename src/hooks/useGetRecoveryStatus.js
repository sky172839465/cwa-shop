import useSWR from 'swr'
import { get } from 'lodash-es'
import getEnvVar from '../utils/getEnvVar'

const host = getEnvVar('VITE_AWS_COMMON_HOST_V2')
const url = `/default/requestrecovery`

const useGetRecoveryStatus = (options = {}) => {
  const {
    data: defaultData, error, mutate, isValidating, isLoading
  } = useSWR({ url, host }, { suspense: false, ...options })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading: isValidating || isLoading,
    isError: error,
    mutate
  }
}

export default useGetRecoveryStatus

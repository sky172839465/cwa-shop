import useGet from './useGet'
import getEnvVar from '../utils/getEnvVar'

const host = getEnvVar('VITE_AWS_COMMON_HOST_V2')
const url = `/default/getstafflist`

const useGetStaffList = () => {
  return useGet({ url, host })
}

export default useGetStaffList

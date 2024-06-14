import useSWR from 'swr'
import qs from 'query-string'
import { get, isEmpty } from 'lodash-es'
import getApiHost from '../utils/getApiHost'
import getApiPrefix from '../utils/getApiPrefix'

const host = getApiHost('VITE_AWS_GET_EXPORT_CATEGORY_INFO_PURCHASE_HOST')
const awsHostPrefix = getApiPrefix()
const useExportCategoryInfo = (category) => {
  const params = { category }
  const qsStr = isEmpty(category) ? '' : `?${qs.stringify(params)}`
  const url = `${awsHostPrefix}/exportcategoryinfo${qsStr}`
  const {
    data: defaultData = [], error, isLoading
  } = useSWR(() => ({ url, host }), { suspense: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isLoading,
    isError: error
  }
}

export default useExportCategoryInfo
import getEnvVar from '../utils/getEnvVar'
import getApiPrefix from '../utils/getApiPrefix'
import useCreate from './useCreate'

const createUploadQuotationHost = getEnvVar('VITE_AWS_CREATE_UPLOAD_QUOTATION_PURCHASE_HOST')
const subPrefix = getEnvVar('VITE_AWS_PURCHASE_HOST_PREFIX')
const awsHostPrefix = getApiPrefix(subPrefix)
const createUploadQuotationEndPoint = `${awsHostPrefix}/uploadquotation`

const useCreateUploadQuotation = () => {
  const { trigger: originTrigger, ...rest } = useCreate(createUploadQuotationHost)

  const trigger = (body) => {
    return {
      url: createUploadQuotationEndPoint,
      body,
      isJsonResponse: false
    }
  }

  return {
    ...rest,
    trigger
  }
}

export default useCreateUploadQuotation

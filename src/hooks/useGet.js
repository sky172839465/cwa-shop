import { get } from 'lodash-es'
import useSWRMutation from 'swr/mutation'

const useGet = (args) => {
  const host = get(args, 'host', args)
  const url = get(args, 'url')
  const options = {}
  const {
    data: defaultData = [], error, isMutating, trigger
  } = useSWRMutation(() => ({ host, url, options }), { keepPreviousData: false })
  const data = get(defaultData, 'results', defaultData)
  return {
    data,
    isMutating,
    isError: error,
    trigger
  }
}

export default useGet

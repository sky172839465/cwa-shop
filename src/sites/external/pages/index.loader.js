import {
  concat, filter, flow, get, keyBy, keys, map, values
} from 'lodash-es'
import safeAwait from 'safe-await'
import { preload } from 'swr'
import { defer } from 'react-router-dom'
import getApiHost from '../../../utils/getApiHost'
import fetcher from '../../../utils/fetcher'
import getAuth from '../../../components/Router/getAuth'

const awsHostPrefix = import.meta.env.VITE_AWS_HOST_PREFIX
const preorderHost = getApiHost('VITE_AWS_FISH_PREORDER')
const preorderConfig = {
  host: preorderHost,
  url: `${awsHostPrefix}/bettafishpreorder`
}
const fishDataHost = getApiHost('VITE_AWS_FISH_INFO_HOST')
const getFishDataConfig = (fishType) => ({
  host: fishDataHost,
  url: `${awsHostPrefix}/bettafishinfo?fishType=${fishType}`
})

const getSelectedFishData = async () => {
  const [preOrderError, preOrderResp] = await safeAwait(preload(preorderConfig, fetcher))
  if (preOrderError) {
    console.log(preOrderError)
    return []
  }

  const preOrder = get(preOrderResp, 'results', {})
  const preOrderItemSerialMap = flow(
    () => values(preOrder),
    (preOrderValues) => map(preOrderValues, (item) => get(item, 'items', [])),
    (itemsList) => concat(...itemsList),
    (totalItemSerial) => keyBy(totalItemSerial)
  )()
  const [fishDataError, fishDataList] = await safeAwait(Promise.all(
    keys(preOrder)
      .map((fishType) => {
        return preload(getFishDataConfig(fishType), fetcher)
          .then((fishDataResp) => {
            return get(fishDataResp, 'results', []).map((result) => ({ ...result, fishType }))
          })
      })
  ))
  if (fishDataError) {
    console.log(fishDataError)
    return []
  }

  const fishData = concat(...fishDataList)
  const selectedFishData = filter(fishData, (item) => item.itemSerial in preOrderItemSerialMap)
  return selectedFishData
}
const loader = async () => {
  const [error, auth, response] = await getAuth()
  if (error) {
    throw response
  }

  return defer({
    selectedFishData: getSelectedFishData(),
    auth
  })
}

export default loader

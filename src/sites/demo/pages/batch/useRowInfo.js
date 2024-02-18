import { useState } from 'react'
import wait from '../../../../utils/wait'

const useRowInfo = (url) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({})

  if (!isLoading) {
    return { isLoading, data }
  }

  wait(3000).then(() => {
    setIsLoading(false)
    setData({ id: url.slice(30, 50), fishType: 'test type' })
  })

  return {
    isLoading,
    data
  }
}

export default useRowInfo

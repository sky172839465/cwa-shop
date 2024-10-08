import { SWRConfig } from 'swr'
import { RecoilRoot } from 'recoil'
import { Toaster } from 'react-hot-toast'
import fetcher from '../../utils/fetcher'
import '../../i18n'
import '../../index.css'

const Root = (props) => {
  const { children } = props
  return (
    <>
      <SWRConfig
        value={{
          // https://swr.vercel.app/docs/api
          revalidateOnFocus: false,
          keepPreviousData: true,
          errorRetryCount: 3,
          suspense: false,
          fetcher
        }}
      >
        <RecoilRoot>
          {children}
        </RecoilRoot>
      </SWRConfig>
      <Toaster />
    </>
  )
}

export default Root

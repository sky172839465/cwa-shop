const shopPaths = ['/external', '/external-demo', '/internal']
const purchasePaths = ['/purchase-domestic', '/purchase-export', '/staff']

const getEntry = (location = window.location) => {
  const isDev = window.ENTRY_PATH === '/'
  const [isShop, isPurchase] = [shopPaths, purchasePaths].map((targetPaths) => {
    return (
      (isDev && targetPaths.some((shopPath) => location.pathname.startsWith(shopPath))) ||
      (!isDev && targetPaths.includes(window.ENTRY_PATH))
    )
  })
  return { isDev, isShop, isPurchase }
}

export default getEntry

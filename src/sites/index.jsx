import ReactDOM from 'react-dom/client'
import { flow, keys } from 'lodash-es'
import Root from '../components/Root'

const links = flow(
  () => keys(import.meta.glob('./**/index.html')),
  (paths) => paths.filter((path) => path !== './index.html'),
  (filteredPaths) => filteredPaths.map((path) => path.replace('./', '/').replace('index.html', '')),
  (endpoints) => endpoints.map((endpoint) => ({ url: `${window.APP_BASENAME}${endpoint}`, name: endpoint.replace(/\//g, '') }))
)()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Root>
    <div className='hero min-h-screen bg-base-200'>
      <div className='hero-content text-center'>
        <div className='flex flex-wrap justify-center max-sm:flex-col max-sm:space-y-4 sm:flex-row sm:space-x-4'>
          {links.map((link) => {
            return (
              <a
                href={link.url}
                className='btn btn-outline btn-lg'
                key={link.url}
              >
                {link.name}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  </Root>
)

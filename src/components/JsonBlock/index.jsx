import clx from 'classnames'
import { useTranslation } from 'react-i18next'
import safeJSON from '../../utils/safeJSON'
import useJsonBlock from './useJsonBlock'

const JsonBlock = ({ className }) => {
  const { t } = useTranslation()
  const [json] = useJsonBlock()
  const { t } = useTranslation()
  return (
    <div
      className={clx('alert flex w-full flex-col items-start gap-4', { [className]: className })}
    >
      <div>
        {t('apiResponse')}
      </div>
      <div>
        <pre className='whitespace-break-spaces break-all text-left'>
          {safeJSON(json)}
        </pre>
      </div>
    </div>
  )
}

export default JsonBlock

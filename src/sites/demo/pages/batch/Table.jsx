import TableRow from './TableRow'
import { FORM_ITEM } from './constants'

const Table = (props) => {
  const {
    field,
    data,
    onRemove,
    onEdit,
    onUpdated
  } = props

  return (
    <div className='mt-4 overflow-x-auto'>
      <table className='table table-pin-rows table-pin-cols table-xs'>
        <thead>
          <tr>
            <th />
            <td>Name</td>
            <td>Id</td>
            <td>FishType</td>
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <TableRow
              field={`${field}.${index}`}
              item={item[FORM_ITEM.UPLOAD_FILE]}
              index={index}
              key={index}
              onRemove={onRemove}
              onEdit={onEdit}
              onUpdated={onUpdated}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

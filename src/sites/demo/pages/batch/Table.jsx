import TableRow from './TableRow'

const Table = (props) => {
  const { data = [], onRemove, onEdit } = props

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
          {data.map((item, index) => {
            return (
              <TableRow
                item={item}
                index={index}
                key={index}
                onRemove={onRemove}
                onEdit={onEdit}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table

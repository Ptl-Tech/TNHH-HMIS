import { Badge, Table } from 'antd'

const RadiologyRequestTable = () => {
    const columns = [
        {
          title: 'Radiology Request Name',
          dataIndex: 'radiologyRequestName',
          key: 'radiologyRequestName',
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
          title: 'Status',
          dataIndex: 'action',
          key: 'action',
          render: (text) => <Badge status="processing" text={text} />
        },
      ]
      const data = [
        {
          key: '1',
          radiologyRequestName: 'X-Ray',
          date: '12/12/2021',
          time: '12:00pm',
          action: 'Pending',
        },
      ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default RadiologyRequestTable
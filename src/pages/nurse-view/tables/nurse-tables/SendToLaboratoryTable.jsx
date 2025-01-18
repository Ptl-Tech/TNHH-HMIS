import { Badge, Table } from "antd"


const 
SendToLaboratoryTable = () => {

    const columns = [
        {
          title: 'Lab Request Name',
          dataIndex: 'labRequestName',
          key: 'labRequestName',
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
          labRequestName: 'Blood Test',
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

export default SendToLaboratoryTable
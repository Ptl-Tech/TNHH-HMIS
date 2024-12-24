import { Badge, Table } from "antd"

const PhysiotherapyRequestTable = () => {
    const columns = [
        {
          title: 'Diagnosis',
          dataIndex: 'diagnosis',
          key: 'diagnosis',
        },
        {
            title: 'Treatment',
            dataIndex: 'treatment',
            key: 'treatment',
          },
        {
          title: 'Process',
          dataIndex: 'process',
          key: 'process',
        },
        {
            title: 'Frequency',
            dataIndex: 'frequency',
            key: 'frequency',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Instructions',
            dataIndex: 'instructions',
            key: 'instructions',
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
          diagnosis: 'Diagnosis 1',
          treatment: 'Treatment 1',
          process: 'Process 1',
          frequency: 'Frequency 1',
          duration: 'Duration 1',
          instructions: 'Instructions 1',
          action: 'Pending',
        },
      ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default PhysiotherapyRequestTable
import { Badge, Button, Space, Table } from "antd"
import PropTypes from "prop-types"

const MentalStatusExaminationTable = ({ showModal }) => {
    const columns = [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: (_, record) => {
            if (record.status === 'Good') {
              return <Badge status="success" text={record.status} />
            } else if (record.status === 'Average') {
              return <Badge status="warning" text={record.status} />
            } else if (record.status === 'Bad') {
                return <Badge status="error" text={record.status} />
            }
          }
          
        },
        {
          title: 'Comments',
          dataIndex: 'comments',
          key: 'comments',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => showModal()}>Edit</Button>
                </Space>
            ),
        }
    ]

    const data = [
        {
            key: '1',
            date: '12/07/2023',
            status: 'Good',
            comments: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.',
        }
    ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default MentalStatusExaminationTable

// props validation
MentalStatusExaminationTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
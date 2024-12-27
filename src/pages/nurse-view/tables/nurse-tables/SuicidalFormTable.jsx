import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types'
import { EditOutlined } from '@ant-design/icons'

const SuicidalFormTable = ({ showModal }) => {
    const columns = [
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
          title: 'Handing Over',
          dataIndex: 'handingOver',
          key: 'handingOver',
        },
        {
            title: 'Assessed By',    
            dataIndex: 'assessedBy',
            key: 'assessedBy',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => showModal()}><EditOutlined /> Edit</Button>
                </Space>
            ),
        }
    ]
    const data = [
        {
            key: '1',
            date: '2023-01-01',
            time: '10:00 AM',
            handingOver: 'Nurse A',
            assessedBy: 'Dr. John Doe',
        }
    ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default SuicidalFormTable

// props validation
SuicidalFormTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
import { Button, Space, Table } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

const DietaryIntakeTable = ({ showModal }) => {
    const columns = [
        {
          title: 'Admission Number',
          dataIndex: 'admission_number',
          key: 'admission_number',
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
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
              <Button type="primary" onClick={() => showModal()}><EditOutlined /> Edit</Button>
            </Space>
          ),
        }
        
    ]
    const data = [
        {
            key: '1',
            admission_number: '123456',
            category: 'Good',
            comments: 'Good',
        }
    ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default DietaryIntakeTable
// prop validation
DietaryIntakeTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
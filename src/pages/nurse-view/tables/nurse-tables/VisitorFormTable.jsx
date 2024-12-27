import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types'
import { EditOutlined } from '@ant-design/icons'

const VisitorFormTable = ({ showModal }) => {
    const columns = [
        {
            title: 'Admission Number',
            dataIndex: 'admissionNumber',
            key: 'admissionNumber',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Contact Number',
            dataIndex: 'contactNumber',
            key: 'contactNumber',
        },
        {
            title: 'Id Number',
            dataIndex: 'idNumber',
            key: 'idNumber',
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
            admissionNumber: '1234567890',
            name: 'John Brown',
            contactNumber: '0712345678',
            idNumber: '1234567890',
        },
        {
            key: '2',
            admissionNumber: '1234567890',
            name: 'Jim Green',
            contactNumber: '0712345678',
            idNumber: '1234567890',
        }
    ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default VisitorFormTable

//props validation
VisitorFormTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
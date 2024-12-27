import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types'
import { EditOutlined } from '@ant-design/icons'

const JacksonVisualFormTable = ({ showModal }) => {
    const columns = [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'Score',
          dataIndex: 'score',
          key: 'score',
        },
        {
          title: 'IV Line',
          dataIndex: 'iv_line',
          key: 'iv_line',
        },
        {
            title: 'Nurse',
            dataIndex: 'nurse',
            key: 'nurse',
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
            score: '10',
            iv_line: 'Removal',
            nurse: 'Nurse 1',
        }
    ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default JacksonVisualFormTable

//props validation
JacksonVisualFormTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
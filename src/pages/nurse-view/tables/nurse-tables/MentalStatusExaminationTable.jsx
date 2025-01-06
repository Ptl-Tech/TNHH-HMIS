import { Badge, Button, Space, Table } from "antd"
import PropTypes from "prop-types"
import Loading from "../../../../partials/nurse-partials/Loading"
import { useState } from "react"
import { EditOutlined } from '@ant-design/icons'

const MentalStatusExaminationTable = ({ showModal, loadingIpGetMentalStatusForm, ipGetMentalStatusForm }) => {
    const columns = [
        {
          title: 'Date',
          dataIndex: 'Date',
          key: 'Date',
        },
        {
          title: 'Status',
          dataIndex: 'Status',
          key: 'Status',
          render: (_, record) => {
            if (record.Status === 'good') {
              return <Badge status="success" text={record.Status} />
            } else if (record.Status === 'average') {
              return <Badge status="warning" text={record.Status} />
            } else if (record.Status === 'bad') {
                return <Badge status="error" text={record.Status} />
            }
          }
          
        },
        {
          title: 'Comments',
          dataIndex: 'Comments',
          key: 'Comments',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => showModal(record)}><EditOutlined />Edit</Button>
                </Space>
            ),
        }
    ]

    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: ipGetMentalStatusForm?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };

  return (
    <>
      {
        loadingIpGetMentalStatusForm ? (
          <Loading />
        ) : (
          <div style={{ paddingTop: '30px' }}>
           <Table columns={columns} dataSource={ipGetMentalStatusForm} 
           bordered size='middle' 
           pagination={{
             ...pagination,
             total: ipGetMentalStatusForm?.length,
             showSizeChanger: true,
             showQuickJumper: true,
             position: ['bottom', 'right'],
             showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
             onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
             onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
             style: {
                 marginTop: '30px',
             }
         }}
         />
      </div>
        )
      }
    </>
  )
}

export default MentalStatusExaminationTable

// props validation
MentalStatusExaminationTable.propTypes = {
    showModal: PropTypes.func.isRequired,
    loadingIpGetMentalStatusForm: PropTypes.bool.isRequired,
    ipGetMentalStatusForm: PropTypes.array.isRequired
}
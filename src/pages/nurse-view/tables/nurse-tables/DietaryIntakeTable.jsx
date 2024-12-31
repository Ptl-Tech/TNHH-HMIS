import { Button, Space, Table } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import Loading from '../../../../partials/nurse-partials/Loading'
import { useState } from 'react'

const DietaryIntakeTable = ({ showModal, ipGetDietaryForm, loadingGetIpDietaryForm }) => {
    const columns = [
        {
          title: 'Admission Number',
          dataIndex: 'AdmissionNo',
          key: 'AdmissionNo',
        },
        {
          title: 'Category',
          dataIndex: 'Category',
          key: 'Category',
        },
        {
          title: 'Comments',
          dataIndex: 'Comment',
          key: 'Comment',
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => showModal(record)}><EditOutlined /> Edit</Button>
            </Space>
          ),
        }
        
    ]
     const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: ipGetDietaryForm?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };
  return (
    <>
    {
      loadingGetIpDietaryForm ? (
        <Loading />
      ) : (
        <Table columns={columns} dataSource={ipGetDietaryForm}
        bordered size='middle' 
        pagination={{
          ...pagination,
          total: ipGetDietaryForm?.length,
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
      )
    }
    </>
  )
}

export default DietaryIntakeTable
// prop validation
DietaryIntakeTable.propTypes = {
    showModal: PropTypes.func.isRequired,
    loadingGetIpDietaryForm: PropTypes.bool.isRequired,
    ipGetDietaryForm: PropTypes.array.isRequired
}
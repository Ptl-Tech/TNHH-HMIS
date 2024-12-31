import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types'
import { EditOutlined } from '@ant-design/icons'
import { useState } from 'react'
import Loading from '../../../../partials/nurse-partials/Loading'

const JacksonVisualFormTable = ({ showModal, loadingGetJacksonVisual, getJacksonVisual }) => {
    const columns = [
        {
          title: 'Date',
          dataIndex: 'Date',
          key: 'Date',
        },
        {
          title: 'Score',
          dataIndex: 'Score',
          key: 'Score',
        },
        {
          title: 'IV Line',
          dataIndex: 'IVLine',
          key: 'IVLine',
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
            total: getJacksonVisual?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };
  return (
    <div style={{ paddingTop: '30px' }}>
         {
          loadingGetJacksonVisual ? (
            <Loading /> 
          ):(
            <Table columns={columns} dataSource={getJacksonVisual} 
          bordered size='middle' 
          pagination={{
            ...pagination,
            total: getJacksonVisual?.length,
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
    </div>
  )
}

export default JacksonVisualFormTable

//props validation
JacksonVisualFormTable.propTypes = {
    showModal: PropTypes.func.isRequired,
    loadingGetJacksonVisual: PropTypes.bool.isRequired,
    getJacksonVisual: PropTypes.array.isRequired
}
import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types'
import { EditOutlined } from '@ant-design/icons'
import Loading from '../../../../partials/nurse-partials/Loading'
import { useState } from 'react'

const VisitorFormTable = ({ showModal, loadingIpVisitors, ipVisitors }) => {

    const columns = [
        {
            title: 'Admission Number',
            dataIndex: 'AdmissionNo',
            key: 'AdmissionNo',
        },
        {
            title: 'Name',
            dataIndex: 'VisitorName',
            key: 'VisitorName',
        },
        {
            title: 'Contact Number',
            dataIndex: 'PhoneNumber',
            key: 'PhoneNumber',
        },
        {
            title: 'Id Number',
            dataIndex: 'IdNumber',
            key: 'IdNumber',
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
        total: ipVisitors?.length,
    });
          
    const handleTableChange = (newPagination) => {
        setPagination(newPagination); // Update pagination settings
    };

  return (
    <>
    {
        loadingIpVisitors ? (
            <Loading />
        ) : (
            <div style={{ paddingTop: '30px' }}>
            <Table columns={columns} dataSource={ipVisitors} 
             bordered size='middle' 
              pagination={{
                ...pagination,
                total: ipVisitors?.length,
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

export default VisitorFormTable

//props validation
VisitorFormTable.propTypes = {
    showModal: PropTypes.func.isRequired,
    loadingIpVisitors: PropTypes.bool.isRequired,
    ipVisitors: PropTypes.array.isRequired
}
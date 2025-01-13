import { Table } from 'antd'
import PropTypes from 'prop-types'
import Loading from '../../../../partials/nurse-partials/Loading'
import { useState } from 'react'

const VisitorFormTable = ({ loadingIpVisitors, filterVisitorList, rowSelection }) => {

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
    ]

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: filterVisitorList?.length,
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
            <Table 
              rowKey={(record, index) => record.PhoneNumber + index}
              columns={columns} 
              dataSource={filterVisitorList} 
              bordered size='middle'
              rowSelection={rowSelection} 
              pagination={{
                ...pagination,
                total: filterVisitorList?.length,
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
    filterVisitorList: PropTypes.array.isRequired,
    rowSelection: PropTypes.array.isRequired
}
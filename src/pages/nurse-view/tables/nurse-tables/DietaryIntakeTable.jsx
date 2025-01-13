import { Table } from 'antd'
import PropTypes from 'prop-types'
import Loading from '../../../../partials/nurse-partials/Loading'
import { useState } from 'react'

const DietaryIntakeTable = ({ filterDietaryIntakeForm, loadingGetIpDietaryForm, rowSelection }) => {
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
        
    ]
     const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: filterDietaryIntakeForm?.length,
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
        <Table columns={columns}
        rowKey={(record, index) => record.AdmissionNo + index}
        rowSelection={rowSelection} 
        dataSource={filterDietaryIntakeForm}
        bordered size='middle' 
        pagination={{
          ...pagination,
          total: filterDietaryIntakeForm?.length,
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
    filterDietaryIntakeForm: PropTypes.array.isRequired,
    rowSelection: PropTypes.array.isRequired
}
import { Table } from 'antd'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Loading from '../../../../partials/nurse-partials/Loading'

const JacksonVisualFormTable = ({ loadingGetJacksonVisual, getJacksonVisual, rowSelection }) => {
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
          title: 'Nurse',
          dataIndex: 'Nurse',
          key: 'Nurse',
        },
        {
          title: 'IV Line',
          dataIndex: 'IVLine',
          key: 'IVLine',
        },
        
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
            <Table 
            rowKey={(record, index) => record.Date + index}
            rowSelection={rowSelection}
            columns={columns} 
            dataSource={getJacksonVisual} 
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
    showModal: PropTypes.bool,
    loadingGetJacksonVisual: PropTypes.bool.isRequired,
    getJacksonVisual: PropTypes.array.isRequired,
    rowSelection: PropTypes.object.isRequired
}
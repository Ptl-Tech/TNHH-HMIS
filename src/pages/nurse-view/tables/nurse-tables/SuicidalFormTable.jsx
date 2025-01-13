import { Table } from 'antd'
import PropTypes from 'prop-types'
import Loading from '../../../../partials/nurse-partials/Loading'
import { useState } from 'react'

const SuicidalFormTable = ({ loadingIpSuicidalForm, ipSuicidalForm, rowSelection}) => {
    const columns = [
        {
          title: 'Date',
          dataIndex: 'Date',
          key: 'Date',
        },
        {
          title: 'Time',
          dataIndex: 'Time',
          key: 'Time',
        },
        {
          title: 'Handing Over',
          dataIndex: 'HandingOver',
          key: 'HandingOver',
        },
        {
            title: 'Taking Over',    
            dataIndex: 'TakingOver',
            key: 'TakingOver',
        },
    ]

     const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: ipSuicidalForm?.length,
        });
              
        const handleTableChange = (newPagination) => {
            setPagination(newPagination); // Update pagination settings
        };
  return (
    <>
      {
        loadingIpSuicidalForm ? (
          <Loading />
        ) : (
          <div style={{ paddingTop: '30px' }}>
              <Table columns={columns} dataSource={ipSuicidalForm} 
               bordered size='middle' 
               rowKey={(record, index) => record.Time + index}
               rowSelection={rowSelection}
               pagination={{
                 ...pagination,
                 total: ipSuicidalForm?.length,
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

export default SuicidalFormTable

// props validation
SuicidalFormTable.propTypes = {
    showModal: PropTypes.func.isRequired,
    loadingIpSuicidalForm: PropTypes.bool.isRequired,
    ipSuicidalForm: PropTypes.array.isRequired,
    rowSelection: PropTypes.array.isRequired

}
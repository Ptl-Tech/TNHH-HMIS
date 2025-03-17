import { Table } from 'antd'
import PropTypes from 'prop-types'
import Loading from '../../../../partials/nurse-partials/Loading'
import { useState } from 'react'
import moment from 'moment'

const SuicidalFormTable = ({ loadingIpSuicidalForm, ipSuicidalForm, rowSelection}) => {

    const columns = [
      {
        title: 'Date',
        dataIndex: 'Date',
        key: 'Date',
        fixed: 'left',
        width: 150,
        sorter: (a, b) => moment(b.Date, "DD-MM-YYYY").valueOf() - moment(a.Date, "DD-MM-YYYY").valueOf(),
        render: (text) => (
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f5689' }}>
            {moment(text).format('DD-MM-YYYY')}
          </span>
        ),
      },
        {
          title: 'Time',
          dataIndex: 'Time',
          key: 'Time',
          render: (text) => (
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f5689' }}>
              {
                text
              }
            </span>
          )
        },
        {
          title: 'Handing Over',
          dataIndex: 'HandingOver',
          key: 'HandingOver',
          render: (text) => (
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {text}
            </span>
          ) 
        },
        {
            title: 'Taking Over',    
            dataIndex: 'TakingOver',
            key: 'TakingOver',
            render: (text) => (
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {text}
              </span>
            ) 
        },
        {
          title: 'Remarks',    
          dataIndex: 'Remarks',
          key: 'Remarks',
          fixed: 'right',
          width: 200,
          render: (text) => (
            <span style={{ fontSize: '14px' }}>
              {text}
            </span>
          ) 
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
    showModal: PropTypes.func,
    loadingIpSuicidalForm: PropTypes.bool,
    ipSuicidalForm: PropTypes.object,
    rowSelection: PropTypes.object

}
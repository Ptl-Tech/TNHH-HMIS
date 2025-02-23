import { Badge, Button, Table } from "antd"
import PropTypes from "prop-types"
import Loading from "../../../../partials/nurse-partials/Loading"
import { useState } from "react"

const MentalStatusExaminationTable = ({ rowSelection, loadingIpGetMentalStatusForm, filterMSEFormData }) => {
    const columns = [
        {
          title: 'Date',
          dataIndex: 'Date',
          key: 'Date',
          render: (_, record) => {
            const date = new Date(record.Date);
            const formattedDate = date.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            });
            return formattedDate;
          }
        },
        {
          title: 'Status',
          dataIndex: 'Status',
          key: 'Status',
          render: (_, record) => {
            if (record.Status === 'good') {
              return <span>
                <Button style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}>{record.Status}</Button>
              </span>
            } else if (record.Status === 'average') {
              return <span>
                <Button style={{ backgroundColor: 'yellow', borderColor: 'yellow', color: 'black' }}>{record.Status}</Button>
              </span>
            } else if (record.Status === 'bad') {
              return <span>
              <Button  style={{ backgroundColor: 'red', borderColor: 'red', color: 'white' }}>{record.Status}</Button>
            </span>
            }
          }
          
        },
        {
          title: 'Comments',
          dataIndex: 'Comments',
          key: 'Comments',
          
        },
    ]

    const [pagination, setPagination] = useState({
            current: 1,
            pageSize: 10,
            total: filterMSEFormData?.length,
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
           <Table columns={columns} 
           rowKey={(record, index) => record.Date + index}
           dataSource={filterMSEFormData} 
           bordered size='middle' 
           rowSelection={rowSelection}
           pagination={{
             ...pagination,
             total: filterMSEFormData?.length,
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
    filterMSEFormData: PropTypes.array.isRequired,
    rowSelection: PropTypes.array.isRequired
}
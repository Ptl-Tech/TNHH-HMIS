import { Button, Table } from "antd"
import PropTypes from "prop-types"
import Loading from "../../../../partials/nurse-partials/Loading"
import { useState } from "react"

const ConsumablesTables = ({ showModal, loadingGetPatientConsumables, getPatientConsumables }) => {
    const columns = [
    
        {
          title: 'Date Administered',
          dataIndex: 'dateAdministered',
          key: 'dateAdministered',
        },
        {
            title: 'Item Name',
            dataIndex: 'itemName',
            key: 'itemName',
        },
        {
          title: 'Transaction Code',
          dataIndex: 'transactionCode',
          key: 'transactionCode',
        },
        {
            title: 'Store',
            dataIndex: 'store',
            key: 'store',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          render: (text) => <Button style={{ color: '#0f5689'}} onClick={() => showModal(text)}>{text}</Button>
        }
      ]

      const [pagination, setPagination] = useState({
              current: 1,
              pageSize: 10,
              total: getPatientConsumables?.length,
          });
                
          const handleTableChange = (newPagination) => {
              setPagination(newPagination); // Update pagination settings
          };
  return (
    <div style={{ paddingTop: '30px' }}>
         {
          loadingGetPatientConsumables ? (
                <Loading />
            ) : (
                <Table columns={columns} 
                dataSource={getPatientConsumables} 
                bordered size='middle' 
              pagination={{
                ...pagination,
                total: getPatientConsumables?.length,
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

export default ConsumablesTables

//props validation
ConsumablesTables.PropTypes = {
    showModal: PropTypes.func.isRequired,
    loadingGetPatientConsumables: PropTypes.bool.isRequired,
    getPatientConsumables: PropTypes.array.isRequired,
}
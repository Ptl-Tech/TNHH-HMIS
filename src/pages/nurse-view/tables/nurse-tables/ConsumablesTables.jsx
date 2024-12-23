import { Button, Table } from "antd"
import PropTypes from "prop-types"

const ConsumablesTables = ({ showModal }) => {
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
    
      const data = [
        {
          key: '1',
          dateAdministered: '12/12/2021',
          itemName: 'Paracetamol',
          transactionCode: 'Code 1',
          store: 'Main Store',
          quantity: '1',
          remarks: 'Delivered by Nurse Jane',
          date: '12/12/2021',
          action: 'View',
          
        },
      ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default ConsumablesTables

//props validation
ConsumablesTables.PropTypes = {
    showModal: PropTypes.func
}
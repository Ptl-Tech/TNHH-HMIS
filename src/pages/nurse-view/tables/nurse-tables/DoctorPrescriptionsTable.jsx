import { Badge, Space, Table } from "antd"

const DoctorPrescriptionsTable = () => {
const columns = [
        {
            title: 'Drug Name',
            dataIndex: 'drugName',
            key: 'drugName',
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
          key: 'quantity',
        },
        {
          title: 'Quantity Issued',
          dataIndex: 'quantityIssued',
          key: 'quantityIssued',
        },
        {
            title: 'Remaining Quantity',
            dataIndex: 'remainingQuantity',
            key: 'remainingQuantity',
           
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          key: 'remarks',
        },
        
        
      ];
      
      const data = [
        {
          key: '1',
          drugName: 'Drug 1',
          quantity: '10',
          quantityIssued: '5',
          remainingQuantity: '5',
          remarks: 'Remarks 1',
        }
    ];
  return (
    <div style={{ paddingTop: '30px' }}>
        <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default DoctorPrescriptionsTable

import { Table } from "antd"
import PropTypes from "prop-types";

const TreatmentSheetTable = ({ rowSelection }) => {

    const columns = [
        {
            title: 'Drug Number',
            dataIndex: 'drugNumber',
            key: 'drugNumber',
        },
        {
          title: 'Drug Name',
          dataIndex: 'drugName',
          key: 'drugName',
        },
        {
          title: 'Date Prescribed',
          dataIndex: 'datePrescribed',
          key: 'datePrescribed'
        },
        {
          title: 'Prescribed By',
          dataIndex: 'prescribedBy',
          key: 'prescribedBy',
        },
        {
            title: 'Days Prescribed',
            dataIndex: 'daysPrescribed',
            key: 'daysPrescribed',
        },
        {
            title: 'Days Remaining',
            dataIndex: 'daysRemaining',
            key: 'daysRemaining',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        }
      ];
      
      const data = [
        {
            key: '1',
            drugNumber: '1',
            drugName: 'Paracetamol',
            datePrescribed: '2023-04-20',
            prescribedBy: 'Dr. John Doe',
            daysPrescribed: '3',
            daysRemaining: '2',
            status: 'Active'
        }
      ];
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table 
         
            columns={columns} 
            dataSource={data} 
            className="admit-patient-table"
            rowSelection={rowSelection}
         
         />
    </div>
  )
}

export default TreatmentSheetTable

//props types validations
TreatmentSheetTable.propTypes = {
    rowSelection: PropTypes.object.isRequired,
}
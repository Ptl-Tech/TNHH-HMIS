import { Table } from "antd"
import PropTypes from "prop-types"


const SickOffTable = ({ rowSelection }) => {
    const columns = [
        {
            title: 'Off Days Duty',
            dataIndex: 'offDays',
            key: 'offDays',
        },
        {
            title: 'Light Duty Days',
            dataIndex: 'lightDutyDays',
            key: 'lightOffDays',
        },
        {
            title: 'Sick off Start Day',
            dataIndex: 'sickOffStartDay',
            key: 'sickOffStartDay',
        },
        {
            title: 'Sick off End Day',
            dataIndex: 'sickOffEndDay',
            key: 'sickOffEndDay',
        },
        {
            title: 'Next Appointment Date',
            dataIndex: 'nextAppointmentDate',
            key: 'nextAppointmentDate',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
    ]
   
    
  return (
    <div style={{ paddingTop: '10px' }}>
    <Table
    
       columns={columns} 
   
       className="admit-patient-table"
       rowSelection={rowSelection}
    />
    </div>
  )
}

export default SickOffTable

//props validation
SickOffTable.propTypes = {
    rowSelection: PropTypes.object.isRequired,
}
import { Button, Table } from "antd"
import PropTypes from "prop-types"

const DoctorNotesTable = ({ showModal }) => {

  const columns = [
    
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor',
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
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
      date: '12/12/2021',
      doctor: 'Dr. John Doe',
      notes: 'Patient is responding well to treatment',
      action: 'View',
      
    },
    {
      key: '2',
      date: '12/12/2021',
      doctor: 'Dr. John Doe',
      notes: 'Patient is responding well to treatment',
      action: 'View'
    }
  ]

  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
   
  )
}

export default DoctorNotesTable

//Prop validations

DoctorNotesTable.propTypes = {
  showModal: PropTypes.func.isRequired,
}
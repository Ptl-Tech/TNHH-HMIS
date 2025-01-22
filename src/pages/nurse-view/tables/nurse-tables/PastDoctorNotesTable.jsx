import { Table } from "antd"
import PropTypes from "prop-types"

const PastDoctorNotesTable = ({ showModal }) => {

    const columns = [
    
        {
          title: 'Encounter Number',
          dataIndex: 'treatmentNo',
          key: 'treatmentNo',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
          title: 'Patient Type',
          dataIndex: 'patientType',
          key: 'patientType',
        },
        {
          title: 'Branch',
          dataIndex: 'branch',
          key: 'branch',
        },
        {
            title: 'Added By',
            dataIndex: 'AddedBy',
            key: 'AddedBy',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          // render: (text) => <Button style={{ color: '#0f5689'}} onClick={() => showModal(text)}>{text}</Button>
        }
      ]
    
      const data = [
        {
          key: '',
          treatmentNo: '',
          date: '',
          PatientFile: '',
          branch: '',
          paymentMethod: '',
          treatmentReport: '',          
        },
      ]
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default PastDoctorNotesTable

//props validation
PastDoctorNotesTable.propTypes = {
    showModal: PropTypes.func
}
import { Button, Table } from "antd"
import PropTypes from "prop-types"

const TreatmentHistoryTable = ({ showModal }) => {

    const columns = [
    
        {
          title: 'Treatment Number',
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
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
          title: 'Treatment Report',
          dataIndex: 'treatmentReport',
          key: 'treatmentReport',
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

export default TreatmentHistoryTable

//props validation
TreatmentHistoryTable.propTypes = {
    showModal: PropTypes.func
}
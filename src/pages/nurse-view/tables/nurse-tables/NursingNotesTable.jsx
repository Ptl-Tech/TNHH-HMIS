import { Button, Table } from "antd"
import PropTypes from "prop-types"

const NursingNotesTable = ({ showModal }) => {

  const columns = [
    
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
      title: 'Nurse',
      dataIndex: 'nurse',
      key: 'nurse',
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
      time: '12:00',
      nurse: 'Kellyman',
      notes: 'Patient is responding well to treatment',
      action: 'View',
      
    },
    {
      key: '2',
      date: '12/12/2021',
      time: '12:00',
      nurse: 'Cole Palmer',
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

export default NursingNotesTable

//Prop validations

NursingNotesTable.propTypes = {
  showModal: PropTypes.func.isRequired,
}
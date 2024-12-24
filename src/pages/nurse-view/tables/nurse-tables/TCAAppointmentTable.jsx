import { Button, Space, Table } from "antd"
import PropTypes from "prop-types";

const TCAAppointmentTable = ({ showModal }) => {

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
            title: 'Doctor Name',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="primary"
                    onClick={() => handleEdit(record)}
                    >Edit</Button>
                    <Button color="danger" variant="outlined"
                    onClick={() => handleDelete(record)}
                    >Cancel</Button>
                </Space>
            ),
        }
    ];

    const data = [
        {
            key: '1',
            date: '2023-05-10',
            time: '10:00 AM',
            doctorName: 'Dr. John Doe',
            remarks: 'Follow-up appointment',
        }
    ]

    const handleEdit = (record) => {
        showModal();    
        console.log(record);
    }

    const handleDelete = (record) => {
        console.log(record);
    }
  return (
    <div style={{ paddingTop: '30px' }}>
    <Table 
    
       columns={columns} 
       dataSource={data} 
       className="admit-patient-table"
    />
    </div>
  )
}

export default TCAAppointmentTable

// props types validations
TCAAppointmentTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
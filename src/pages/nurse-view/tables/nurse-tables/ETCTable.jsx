import { Button, Space, Table } from "antd"
import PropTypes from "prop-types";

const ETCTable = ({ showModal }) => {
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
            title: 'Operation',
            dataIndex: 'operation',
            key: 'operation',
        },
        {
            title: 'Doctor Name',
            dataIndex: 'doctorName',
            key: 'doctorName',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
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
            date: '2023-04-20',
            time: '10:00 AM',
            operation: 'ECT',
            doctorName: 'Dr. John Doe',
            description: 'This is a description',
        },
    ];

    const handleEdit = (record) => {
        showModal();
        console.log(record);
    };
    const handleDelete = (record) => {
        console.log(record);
    };
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

export default ETCTable

//props types validations
ETCTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
import { Button, Space, Table } from "antd"
import PropTypes from "prop-types";

const ETCTable = ({ showModal }) => {
const columns = [
        {
            title: 'Requested for',
            dataIndex: 'requestedFor',
            key: 'requestedFor',
        },

        {
            title: 'Frequency',
            dataIndex: 'Frequency',
            key: 'Frequency',
        },
        {
            title: 'Date',
            dataIndex: 'Date',
            key: 'Date',
        },
        {
            title: 'Doctor',
            dataIndex: 'Doctor',
            key: 'Doctor',
        },
        {
            title: 'Requesting Doctor',
            dataIndex: 'Requesting Doctor',
            key: 'Requesting Doctor',
        },
        {
            title: 'Doctor',
            dataIndex: 'Doctor',
            key: 'Doctor',
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
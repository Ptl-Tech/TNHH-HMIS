import { Button, Space, Table } from "antd"
import PropTypes from "prop-types";

const DiagnosisTable = ({ showModal }) => {
    const columns = [
        {
            title: 'Injection Date',
            dataIndex: 'date',
            key: 'date',
          },
        {
          title: 'Injection',
          dataIndex: 'injection',
          key: 'injection',
        },
        
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          key: 'remarks',
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space>
                <Button type="primary" variant="outlined" onClick={() => showModal()}>View</Button>
            </Space>
          ),
        },
      ];

      const data = [
        {
          key: '1',
          injection: 'Headache',
          date: '2023-04-20',
          remarks: 'Dr. John Doe',
        },
      ];
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default DiagnosisTable

//props types validations
DiagnosisTable.propTypes = {
    showModal: PropTypes.func.isRequired,
}
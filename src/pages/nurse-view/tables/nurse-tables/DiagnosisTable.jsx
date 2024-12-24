import { Button, Space, Table } from "antd"
import PropTypes from "prop-types";

const DiagnosisTable = ({ showModal }) => {
    const columns = [
        {
            title: 'Diagnosis Type',
            dataIndex: 'diagnosisType',
            key: 'diagnosisType',
          },
        {
          title: 'Diagnosis',
          dataIndex: 'diagnosis',
          key: 'diagnosis',
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'Diagnosed By',
          dataIndex: 'diagnosedBy',
          key: 'diagnosedBy',
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space>
                <Button type="primary" variant="outlined" onClick={() => showModal()}>Edit</Button>
                <Button  color="danger" variant="outlined">Delete</Button>
            </Space>
          ),
        },
      ];

      const data = [
        {
          key: '1',
          diagnosisType: 'Primary',
          diagnosis: 'Headache',
          date: '2023-04-20',
          diagnosedBy: 'Dr. John Doe',
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
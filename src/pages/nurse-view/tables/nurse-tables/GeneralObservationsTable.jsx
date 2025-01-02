import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types';

const GeneralObservationsTable = ({ showModal }) => {
    const columns = [
        {
          title: 'Process',
          dataIndex: 'process',
          key: 'process',
        },
        {
          title: 'Time',
          dataIndex: 'time',
          key: 'time',
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
            <Space size="middle">
              <Button type="primary" onClick={() => showModal()}>View</Button>
            </Space>
          ),
        },
      ];
      
      const data = [
        {
          key: '1',
          process: 'Patient is feeling better',
          date: '2023-07-25',
          time: '10:00 AM',
          remarks: 'Normal',
        },
        {
          key: '2',
          process: 'Patient is feeling better',
          time: '11:00 AM',
          remarks: 'Normal',
        },
      ];
  return (
    <div style={{ paddingTop: '30px' }}>
         <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default GeneralObservationsTable

//props validations

GeneralObservationsTable.propTypes = {
    showModal: PropTypes.func.isRequired,
  };
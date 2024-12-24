import { Button, Space, Table } from 'antd'
import PropTypes from 'prop-types';

const GeneralObservationsTable = ({ showModal }) => {
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
          title: 'Observation',
          dataIndex: 'observation',
          key: 'observation',
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button type="primary" onClick={() => showModal()}>Edit</Button>
              <Button color="danger" variant="outlined">Delete</Button>
            </Space>
          ),
        },
      ];
      
      const data = [
        {
          key: '1',
          date: '2023-07-25',
          time: '10:00 AM',
          observation: 'Patient is feeling better',
          value: 'Normal',
        },
        {
          key: '2',
          date: '2023-07-26',
          time: '11:00 AM',
          observation: 'Patient is feeling better',
          value: 'Normal',
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
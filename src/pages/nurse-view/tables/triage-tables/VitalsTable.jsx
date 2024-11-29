import { Button, Space, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const VitalsTable = ({ handleOpenModal }) => {
    
    const vitalsColumns = [
        {
          title: 'Observation No',
          dataIndex: 'observationNo',
          rowScope: 'row',
        },
        {
          title: 'Patient No',
          dataIndex: 'patientNo',
          rowScope: 'row',
        },
        {
          title: 'Pulse Rate',
          dataIndex: 'pulseRate',
          rowScope: 'row',
        },
        {
          title: 'Pain',
          dataIndex: 'pain',
          rowScope: 'row',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          rowScope: 'row',
          fixed: 'right',
          width: 200,
          render: () => {
            return (
              <Space>
                <Button type='primary' onClick={() => handleOpenModal('Check In', null)}>
                  <EditOutlined />
                  Edit
                </Button>
                <Button color="danger" variant="outlined" onClick={() => handleOpenModal('Check In', null)}>
                  <DeleteOutlined />
                  Delete
                </Button>
              </Space>
            )
          }
        },
      ];
    
      const vitalsData = [
        {
          observationNo: 1,
          patientNo: 1,
          pulseRate: 1,
          pain: 1,
          checkIn: 1
        }
      ]

  return (
    <Table dataSource={vitalsData} columns={vitalsColumns} bordered size='middle' style={{ marginTop: '20px' }} />
  )
}

export default VitalsTable

//proTypes validation
VitalsTable.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
}
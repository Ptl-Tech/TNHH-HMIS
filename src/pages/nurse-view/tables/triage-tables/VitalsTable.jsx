import { Button, Space, Table } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const VitalsTable = ({ handleOpenModal, vitalsLines }) => {
    const { styles } = useStyle();
    const vitalsColumns = [
        {
          title: 'Date  Taken',
          dataIndex: 'dateTaken',
          rowScope: 'row',
          fixed: 'left',
          width: 150,
        },
        {
          title: 'Observation No',
          dataIndex: 'observationNo',
          rowScope: 'row',
          with: 150,
          fixed: 'left',
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
          title: 'Respiration Rate',
          dataIndex: 'respirationRate',
          rowScope: 'row',
        },
        {
          title: 'SP02',
          dataIndex: 'sP02',
          rowScope: 'row',
        },
        {
          title: 'Temperature',
          dataIndex: 'temperature',
          rowScope: 'row',
        },
        {
          title: 'Weight',
          dataIndex: 'weight',
          rowScope: 'row',
        },
        {
          title: 'Height',
          dataIndex: 'height',
          rowScope: 'row',
        },
        {
          title: 'BMI',
          dataIndex: 'bmi',
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

      const vitalsTableData = vitalsLines?.map((vitalsLine) => ({
        dateTaken: vitalsLine.dateTaken,
        observationNo: vitalsLine?.ObservationNo,
        patientNo: vitalsLine?.PatientNo,
        pulseRate: vitalsLine?.PulseRate,
        respirationRate: vitalsLine?.RespirationRate,
        sP02: vitalsLine?.SP02,
        temperature: vitalsLine?.Temperature,
        weight: vitalsLine?.Weight,
        height: vitalsLine?.Height,
        bmi: vitalsLine?.BMI,
        pain: vitalsLine?.Pain,
      })).sort((a, b) => new Date(b.dateTaken) - new Date(a.dateTaken));
    
  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
         <Table 
          dataSource={vitalsTableData} 
          columns={vitalsColumns} 
          bordered size='middle' 
          className={styles.customTable}
          scroll={{
              x: 'max-content',
            }}
          />
    </div>
  )
}

export default VitalsTable

//proTypes validation
VitalsTable.propTypes = {
  handleOpenModal: PropTypes.func.isRequired,
  vitalsLines: PropTypes.array.isRequired,
}
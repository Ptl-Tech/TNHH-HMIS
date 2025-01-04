import { Badge, Table } from "antd"
import PropTypes from "prop-types"
import useSetTablePagination from "../../../../hooks/useSetTablePagination"
import Loading from "../../../../partials/nurse-partials/Loading"

const VitalsTable = ({ rowSelection, filterVitals, loadingInpatientVitals, loadingTriageList }) => {
  const columns = [
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Observation No',
      dataIndex: 'ObservationNo',
      key: 'ObservationNo',
    },
    {
      title: 'Pulse Rate',
      dataIndex: 'PulseRate',
      key: 'PulseRate',
      render: (_, record) => {
        return record.PulseRate ? (
          <span>{record.PulseRate} bpm</span>
        ) : (
          <span>0</span>
        )
      }
    },
    {
      title: 'Respiratory Rate',
      dataIndex: 'RespirationRate',
      key: 'RespirationRate',
      render: (_, record) => {
        return record.RespirationRate ? (
          <span>{record.RespirationRate} bpm</span>
        ) : (
          <span>0</span>
        )
      }
    },
    {
      title: 'Blood Pressure',
      dataIndex: 'BloodPressure',
      key: 'BloodPressure',
      render: (_, record) => {
        return record.BloodPressure ? (
          <span>{record.BloodPressure} mmHg</span>
        ) : (
          <span>0</span>
        )
      }
    },
    {
      title: 'Oxygen Saturation',
      dataIndex: 'SP02',
      key: 'SP02',
      render: (_, record) => {
        return record.SP02 ? (
          <span>{record.SP02} %</span>
        ) : (
          <span>0</span>
        )
      }
    },
    {
      title: 'Height',
      dataIndex: 'Height',
      key: 'Height',
      render: (_, record) => {
        return record.Height ? (
          <span>{record.Height} cm</span>
        ) : (
          <span>0</span>
        )
      }
    },
    {
      title: 'Weight',
      dataIndex: 'Weight',
      key: 'Weight',
      render: (_, record) => {
        return record.Weight ? (
          <span>{record.Weight} kg</span>
        ) : (
          <span>0</span>
        )
      }
    },
    {
      title: 'Temperature',
      dataIndex: 'Temperature',
      key: 'Temperature',
      render: (_, record) => {
        const temperature = record.Temperature;
  
        // Conditional rendering based on temperature range
        if (temperature > 37) {
          return (
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {temperature} &deg;C{" "}
              <Badge color="red" text="High" />
            </span>
          );
        } else if (temperature < 35) {
          return (
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {temperature} &deg;C{" "}
              <Badge color="orange" text="Low" />
            </span>
          );
        } else {
          return (
            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {temperature} &deg;C{" "}
              <Badge color="green" text="Normal" />
            </span>
          );
        }
      },
      
    },
    {
      title: 'BMI',
      dataIndex: 'BMI',
      key: 'BMI',
      render: (_, record) => {
        return record.BMI ? record.BMI.toFixed(2) : 0
      }
    },
    {
      title: 'Date Taken',
      dataIndex: 'DateTaken',
      key: 'DateTaken',
      fixed: 'right',
      width: 100,
    },

  ]

  const { pagination, handleTableChange } = useSetTablePagination(filterVitals);
 
  return (
    <div style={{ paddingTop: '30px' }}>
        {
            loadingInpatientVitals || loadingTriageList ? (
              <Loading />
            ) : (
              <Table columns={columns} 
                rowKey={(record, index) => (record.BMI || 0) + '-' + index}
                scroll={{ x: 'max-content' }}
                dataSource={filterVitals} 
                rowSelection={rowSelection}
                bordered size='middle' 
                pagination={{
                ...pagination,
                total: filterVitals?.length,
                showSizeChanger: true,
                showQuickJumper: true,
                position: ['bottom', 'right'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
                onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
                style: {
                marginTop: '30px',
                    }
                }}
                />
            ) 
        }
    </div>
  )
}

export default VitalsTable
//props types validations
VitalsTable.propTypes = {
    rowSelection: PropTypes.object.isRequired,
    filterVitals: PropTypes.array,
    loadingInpatientVitals: PropTypes.bool,
    loadingTriageList: PropTypes.bool
}
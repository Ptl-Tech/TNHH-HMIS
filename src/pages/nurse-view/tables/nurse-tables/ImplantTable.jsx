import { Badge, Table, Tag } from "antd"
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const ImplantTable = ({ loadingKetamine, data, doctors }) => {
  const [updatedData, setUpdatedData] = useState([]);

  useEffect(() => {
    if (doctors && data) {
      const doctorsMap = doctors.reduce((acc, doctor) => {
        acc[doctor.DoctorID] = doctor.DoctorsName;
        return acc;
      }, {});

      const newData = data.map((item) => ({
        ...item,
        DoctorName: doctorsMap[item.Doctor_ID] || "",
      }));

      setUpdatedData(newData); // Update the data object with doctor names
    }
  }, [doctors, data]);

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Visit No',
      dataIndex: 'Link_No',
      key: 'Link_No',
      render: (text) => (
        <span
          style={{ color: "#b96000", cursor: "pointer", fontWeight: "bold" }}
        >
          {text}
        </span>
      ),
    },

    {
      title: 'Patient No',
      dataIndex: 'Patient_No',
      key: 'Patient_No',
    },
    {
      title: 'Procedure Date',
      dataIndex: 'Procedure_Date',
      key: 'Procedure_Date',
    },
    /* {
      title: 'Requested Date',
      dataIndex: 'Request_Date',
      key: 'Request_Date',
    },  */
    /* {
      title: "Procedure Type",
      dataIndex: "Procedure_Type",
      key: "Procedure_Type",
    }, */
    /* {
      title: 'Requesting Doctor',
      dataIndex: 'Requesting Doctor',
      key: 'Requesting Doctor',
    }, */
    {
      title: 'Requested to',
      dataIndex: 'DoctorName',
      key: 'DoctorName',
  },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text, record) => {
        if (record.Status === '0') {
          return <Tag color="#87d068">New</Tag>
          
        } else {
          return <Tag color="#87d068">New</Tag>
          
        }
      },
    }

  ];
  return (
    <div style={{}}>
      <Table
        bordered
        size="small"
        rowKey={'SystemId'}
        dataSource={updatedData}
        loading={loadingKetamine}
        columns={columns}
        className="admit-patient-table"
      />
    </div>
  )
}

export default ImplantTable

//props types validations
ImplantTable.propTypes = {
  loadingKetamine: PropTypes.bool,
  data: PropTypes.array,
  doctors: PropTypes.array,
}
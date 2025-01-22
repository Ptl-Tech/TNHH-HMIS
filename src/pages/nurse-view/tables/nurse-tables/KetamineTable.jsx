import { Badge, Table } from "antd"
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { listDoctors } from "../../../../actions/DropdownListActions";
import { useDispatch, useSelector } from "react-redux";

const KetamineTable = ({ loadingKetamine, data, treatmentNo, admissionNo }) => {
  const dispatch = useDispatch();
  const [updatedData, setUpdatedData] = useState([]);

  const { data: doctors } = useSelector((state) => state.getDoctorsList);

  useEffect(() => {
    dispatch(listDoctors()); // Fetch the list of doctors
  }, [dispatch]);

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

  console.log('doctorMap', updatedData);

  const filterData = updatedData?.filter((item) =>
    treatmentNo ? item?.Link_No === treatmentNo : item?.Link_No === admissionNo
  );
  const filterProcedureData = filterData?.filter((item) => item.Procedure_Type === 'Ketamine Infusion')
  const columns = [
    {
      title: 'Visit No',
      dataIndex: 'Link_No',
      key: 'Link_No',
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
    }, {
      title: "Procedure Type",
      dataIndex: "Procedure_Type",
      key: "Procedure_Type",
    },
    {
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
          return (
            <Badge
              status="success"
              text="Pending" // or any other label
            />
          );
        } else {
          return (
            <Badge
              status="error"
              text="Approved" // or any other label
            />
          );
        }
      },
    }

  ];
  return (
    <div style={{}}>
      <Table
        dataSource={filterProcedureData}
        loading={loadingKetamine}
        columns={columns}
        className="admit-patient-table"
      />
    </div>
  )
}

export default KetamineTable

//props types validations
KetamineTable.propTypes = {
  loadingKetamine: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  treatmentNo: PropTypes.string.isRequired,
  admissionNo: PropTypes.string,
}
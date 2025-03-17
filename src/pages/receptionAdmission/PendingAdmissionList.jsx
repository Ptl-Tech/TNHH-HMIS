import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPendingAdmissionRequests } from "../../actions/reception-admissions/pendingAdmissionsList";
import { Table, Typography } from "antd";

const PendingAdmissionList = () => {
  const dispatch = useDispatch();
  const { loading, patients } = useSelector(
    (state) => state.pendingAdmissionRequests
  );

  useEffect(() => {
    dispatch(getPendingAdmissionRequests());
  }, [dispatch]);

  if (patients) {
    console.log("admission req", patients);
  }
  const columns = [
    {
      title: "Adm No",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Patient Name",
      dataIndex: "Patient_Name",
      Key: "Patient_Name",
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
    },
    // {
    //   title: "Patient No",
    //   dataIndex: "PatientNo",
    //   key: "PatientNo",
    // },
  ];
  return (
    <div>
      <Typography.Title level={3}>Pending Admissions</Typography.Title>

      <Table columns={columns} dataSource={patients} />
    </div>
  );
};

export default PendingAdmissionList;

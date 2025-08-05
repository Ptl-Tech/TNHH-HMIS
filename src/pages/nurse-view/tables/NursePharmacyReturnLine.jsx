import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPharmacyLineReturnbyPharmacyNo } from "../../../actions/pharmacy-actions/getPharmacyLineReturns";
import { Button, Space, Table, Typography, Alert } from "antd";
import { ReturnDrugsComponent } from "../../pharmacy-views/ReturnDrugsComponent";

const NursePharmacyReturnLine = ({ patientNo }) => {
  const dispatch = useDispatch();
  const { data = [], loading, error } = useSelector(
    (state) => state.getPatientPharmacyReturnLine || {}
  );

  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (patientNo) {
      dispatch(getPharmacyLineReturnbyPharmacyNo("PatientNo", patientNo));
    }
  }, [patientNo, dispatch]);

  const handleReturn = useCallback((record) => {
    setSelectedRecord(record);
    setOpen(true);
  }, []);

  const columns = [
    {
      title: "Drug No",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Drug Name",
      dataIndex: "DrugName",
      key: "DrugName",
    },
    {
      title: "Prescription Dose",
      dataIndex: "Prescription_Dose",
      key: "Prescription_Dose",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Issued Quantity",
      dataIndex: "IssuedQuantity",
      key: "IssuedQuantity",
    },
    {
      title: "Measuring Unit",
      dataIndex: "MeasuringUnit",
      key: "MeasuringUnit",
    },
    {
      title: "Duration Days",
      dataIndex: "Duration_Days",
      key: "Duration_Days",
    },
    {
      title: "Returned Quantity",
      dataIndex: "Returns_Quantity",
      key: "Returns_Quantity",
    },
    {
      title: "Actions",
      key: "Actions",
      render: (_, record) => (
        <Space>
         <ReturnDrugsComponent
record={record}
         
        />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Typography.Title level={4}>Pharmacy Return </Typography.Title>

      {error && (
        <Alert
          type="error"
          message="Failed to load return lines"
          description={error.message || "An unexpected error occurred."}
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        rowKey="SystemId"
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
      />

     
    </>
  );
};

export default NursePharmacyReturnLine;

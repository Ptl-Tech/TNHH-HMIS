import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import PropTypes from "prop-types";
import Loading from "../../../../partials/nurse-partials/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getDiagnosisLines } from "../../../../actions/Doc-actions/getDiagnosisLines";

const DiagnosisTable = ({ treatmentNo }) => {
  const dispatch = useDispatch();

  const { loading: loadingDiagnosisLines, data: diagnosisLines } = useSelector(
    (state) => state.getDiagnosisLines
  );

  useEffect(() => {
    if (treatmentNo) {
      dispatch(getDiagnosisLines(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  const diagnosisLinesColumns = [
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
      render: (text) => (
        <span style={{ color: "#0F5689", fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "Diagnosis Code",
      dataIndex: "DiagnosisCode", // Updated
      key: "DiagnosisCode",
    },
    {
      title: "Diagnosis",
      dataIndex: "DiagnosisName", // Updated
      key: "DiagnosisName",
    },
    {
      title: "Confirmed",
      dataIndex: "Confirmed",
      key: "Confirmed",
      render: (text) => (
        <span style={{ color: text ? "green" : "red", fontWeight: "bold" }}>
          {text ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Remarks",
      dataIndex: "Remarks", // Updated
      key: "Remarks",
    },
    /* {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button type="link" danger>
          Delete
        </Button>
      ),
    }, */
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: diagnosisLines?.length,
  });

  console.log("mydiagnosisLines", diagnosisLines);
   // Convert diagnosisLines to an array if necessary
  const dataSource = Array.isArray(diagnosisLines)
    ? diagnosisLines
    : Object.keys(diagnosisLines).map((item, index) => ({
        key: index,
        TreatmentNo: item.TreatmentNo,
        DiagnosisCode: item.DiagnosisCode,
        DiagnosisName: item.DiagnosisName || item.Description,
        Confirmed: item.Confirmed,
        Remarks: item.Remarks,
      }));

console.log("dataSource", dataSource)

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return (
    <div style={{ paddingTop: "30px" }}>
      {loadingDiagnosisLines ? (
        <Loading />
      ) : dataSource && dataSource.length > 0 ? (
        <Table
  columns={diagnosisLinesColumns}
  dataSource={dataSource.map((item, index) => ({
    ...item,
    key: item.key || index, // Ensure unique keys
  }))}
  bordered
  size="middle"
  pagination={{
    ...pagination,
    total: dataSource.length,
    showSizeChanger: true,
    showQuickJumper: true,
  }}
  onChange={handleTableChange}
/>

      ) : (
        <p>No diagnosis lines available.</p>
      )}
    </div>
  );
};

export default DiagnosisTable;

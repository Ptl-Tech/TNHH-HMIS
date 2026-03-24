import { useEffect, useState } from "react";
import { Table } from "antd";
import Loading from "../../../../partials/nurse-partials/Loading";
import { useDispatch, useSelector } from "react-redux";
import { getDiagnosisLines } from "../../../../actions/Doc-actions/getDiagnosisLines";

const DiagnosisTable = ({ treatmentNo }) => {
  const dispatch = useDispatch();

  console.log("treatmentNo", treatmentNo);
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
        <span style={{ color: "#b96000", fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title: "Diagnosis Code",
      dataIndex: "DiagnosisNo", // Updated
      key: "DiagnosisNo",
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

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  return (
    <div style={{ paddingTop: "30px" }}>
      {loadingDiagnosisLines ? (
        <Loading />
      ) : (
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

      )}
    </div>
  );
};

export default DiagnosisTable;

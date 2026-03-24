import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, message, Modal, Row, Space, Typography } from "antd";
import moment from "moment";

import { FaCheckToSlot, FaPrint } from "react-icons/fa6";
import {
  GENERATE_LAB_RESULTS_REPORT_RESET,
  generateLabResultsReport,
} from "../../../../actions/lab-actions/generateLabResultsReport";
import {
  POST_LAB_TO_DOCTOR_RESET,
  submitLabRequestToDoctor,
} from "../../../../actions/lab-actions/postLabRequestToDoctor";
import PDFViewer from "../../../../components/PDFView";
import SkeletonLoading from "../../../../partials/nurse-partials/Skeleton";

const LabHeader = ({ patientData, patientLabRecord }) => {
  const dispatch = useDispatch();

  console.log({ patientData, patientLabRecord });

  const [openReport, setOpenReport] = useState(false);
  const {
    data: reportData,
    loading: reportLoading,
    error: reportError,
  } = useSelector((state) => state.generateLabResultsReport);
  const [currentReportData, setCurrentReportData] = useState(reportData);
  const { data, loading, error } = useSelector(
    (state) => state.postLabRequestToDoctor
  );

  useEffect(() => {
    if (reportData) {
      message.success("Report generated successfully");
      setCurrentReportData(reportData);
      dispatch({ type: GENERATE_LAB_RESULTS_REPORT_RESET });
    }

    if (reportLoading) {
      message.info("Generating Report...");
    }

    if (reportError) {
      message.warning(
        Array.isArray(reportError?.errors)
          ? reportError.errors[0]
          : reportError.errors
      );
      dispatch({ type: GENERATE_LAB_RESULTS_REPORT_RESET });
    }
  }, [reportData, reportLoading, reportError]);

  useEffect(() => {
    if (data) {
      const { status } = data;
      status === "success"
        ? message.success("Lab request submitted to the doctor")
        : message.error("Could not send the lab request to the doctor");

      dispatch({ type: POST_LAB_TO_DOCTOR_RESET });
    }

    if (error) {
      message.error(error);
      dispatch({ type: POST_LAB_TO_DOCTOR_RESET });
    }

    if (loading) message.info("Submitting the request to the doctor");
  }, [data, loading, error]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#237804";
      case "New":
        return "#ad4e00";
      case "Voided":
        return "#ad4e00";
      case "Forwarded":
        return "#ED9D47";
      case "Review":
        return "#006d75";
      case "Recalled":
        return "#391085";
      default:
        return "black";
    }
  };

  const handleMarkAsCompleted = (labNo) => {
    dispatch(submitLabRequestToDoctor(labNo));
  };

  const handleGenerateResultsReport = async () => {
    await dispatch(generateLabResultsReport(patientLabRecord));
    setOpenReport(true);
  };

  const rowData = [
    {
      title: "Patient & Billing Information",
      data: [
        {
          highlighted: "#5b8c00",
          type: "patientInformation",
          data: { label: "Patient Number", value: "PatientNo" },
        },
        {
          highlighted: "#fa8c16",
          type: "patientInformation",
          data: { label: "Patient Name", value: "Names" },
        },
        {
          type: "patientInformation",
          data: { label: "Gender", value: "Gender" },
        },
        {
          type: "patientInformation",
          data: { label: "Age", value: "DateOfBirth" },
          helper: (value) => `${moment().diff(value, "years")} Years`,
        },
        {
          type: "patientInformation",
          data: { label: "Date of Birth", value: "DateOfBirth" },
        },
        {
          type: "labInformation",
          data: { label: "Patient Type", value: "PatientType" },
        },
        {
          highlighted: "#5b8c00",
          type: "labInformation",
          data: { label: "Insurance Number", value: "Insurance_No" },
        },
        {
          highlighted: "#fa8c16",
          type: "labInformation",
          data: { label: "Insurance Name", value: "Insurance_Name" },
        },
      ],
    },
    {
      title: "Laboratory Information",
      data: [
        {
          highlighted: "#5b8c00",
          type: "labInformation",
          data: { label: "Laboratory Number", value: "LaboratoryNo" },
        },
        {
          highlighted: "#fa8c16",
          type: "labInformation",
          data: { label: "Laboratory Type", value: "LinkType" },
        },
        {
          type: "labInformation",
          data: { label: "Lab Test Date", value: "LaboratoryDate" },
        },
        {
          type: "labInformation",
          data: { label: "Lab Test Time", value: "LaboratoryTime" },
        },
        {
          type: "labInformation",
          data: { label: "Lab Request Area", value: "Request_Area" },
        },
        {
          type: "labInformation",
          highlighted: getStatusColor,
          data: {
            value: "Status",
            label: "Lab Request Status",
          },
        },
        {
          highlighted: "#fa8c16",
          type: "labInformation",
          data: { label: "Doctor's Name", value: "Doctor_Names" },
        },
      ],
    },
  ];

  const generateCellData = (cellData) => {
    if (
      cellData.type === "patientInformation" ||
      cellData.type === "labInformation"
    ) {
      return (
        <InfoRow
          cellData={cellData}
          key={cellData.data.value}
          patientData={patientData}
          patientLabRecord={patientLabRecord}
        />
      );
    }
  };

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <Space className="justify-content-end" style={{ width: "100%" }}>
        <Button
          icon={<FaCheckToSlot />}
          style={{
            display: "inline",
            width: "fit-content",
          }}
          onClick={() => handleMarkAsCompleted(patientLabRecord?.LaboratoryNo)}
        >
          {" "}
          Finalize
        </Button>
        <Button
          icon={<FaPrint />}
          type="primary"
          onClick={() =>
            handleGenerateResultsReport(patientLabRecord?.LaboratoryNo)
          }
        >
          Report
        </Button>
      </Space>
      <Space
        gutter={[16, 16]}
        direction="vertical"
        className="d-grid gap-0 border"
        style={{
          overflow: "clip",
          borderTopLeftRadius: "7px",
          borderTopRightRadius: "7px",
        }}
      >
        {rowData.map((row, index) => (
          <Row
            key={index}
            md={{ span: 8 }}
            xs={{ span: 24 }}
            style={{
              display: "grid",
              borderTop: "1px solid #efefef",
            }}
          >
            {row.title && (
              <Typography.Title
                level={5}
                style={{
                  padding: "8px",
                  marginBottom: 0,
                  color: "#b96000",
                  background: "#efefef89",
                }}
              >
                {row.title}
              </Typography.Title>
            )}
            <Space
              className="d-grid p-2 gap-3"
              style={{
                gridTemplateColumns: "repeat(6, 1fr)",
              }}
            >
              {row.data.map((cellData, index) =>
                generateCellData(cellData, index)
              )}
            </Space>
          </Row>
        ))}
      </Space>
      <Modal
        title="Results Report"
        open={openReport}
        onCancel={() => setOpenReport(false)}
        footer={null}
        width={800}
        style={{ top: 2 }}
      >
        {reportLoading ? (
          <SkeletonLoading />
        ) : (
          <PDFViewer base64String={currentReportData?.base64} />
        )}
      </Modal>
    </div>
  );
};

const InfoRow = ({ cellData, patientLabRecord, patientData }) => {
  const { highlighted, type, data, helper } = cellData || {};

  let value = "";
  let color = "#333";

  value =
    type === "patientInformation" && patientData
      ? patientData[data.value]
      : type === "labInformation" && patientLabRecord
      ? (value = patientLabRecord[data.value])
      : value;

  value = helper ? helper(value) : value;

  if (highlighted) {
    color = typeof highlighted === "string" ? highlighted : highlighted(value);
  }

  return (
    <Typography.Text level={5} style={{ display: "grid" }} className="p-0 m-0">
      <span>{data.label}</span>
      <span style={{ color, fontWeight: "600" }}>{value || "N/A"}</span>
    </Typography.Text>
  );
};

export default LabHeader;

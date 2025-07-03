import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import moment from "moment";
import { Button, Typography, Row, Col, message, Modal } from "antd";

import PDFViewer from "../../../../components/PDFView";
import {
  POST_LAB_TO_DOCTOR_RESET,
  submitLabRequestToDoctor,
} from "../../../../actions/lab-actions/postLabRequestToDoctor";
import {
  GENERATE_LAB_RESULTS_REPORT_RESET,
  generateLabResultsReport,
} from "../../../../actions/lab-actions/generateLabResultsReport";
import SkeletonLoading from "../../../../partials/nurse-partials/Skeleton";

const LabHeader = ({ patientData, patientLabRecord }) => {
  const dispatch = useDispatch();

  console.log({ patientLabRecord });

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

  const capitalizeWords = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const patientName = patientData?.SearchName
    ? capitalizeWords(patientData.SearchName)
    : capitalizeWords(
        [patientData?.Surname, patientData?.FirstName, patientData?.MiddleName]
          .filter(Boolean)
          .join(" ")
      );

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#237804";
      case "New":
        return "#ad4e00";
      case "Voided":
        return "#ad4e00";
      case "Forwarded":
        return "#0060a3";
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
      title: "Patient Information",
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
      ],
    },
    {
      title: "Lab Actions",
      data: [
        {
          type: "buttons",
          data: [
            {
              buttonType: "default",
              data: {
                disabled: "Finalize",
                active: "Finalize",
              },
              style: {
                display: "inline",
                width: "fit-content",
              },
              onClick: (value) => handleMarkAsCompleted(value),
              disabled: (value) => value === "Completed" || loading,
            },
            {
              buttonType: "default",
              data: {
                disabled: "Report",
                active: "Report",
              },
              style: {
                display: "inline",
                width: "fit-content",
              },
              onClick: (value) => handleGenerateResultsReport(value),
              disabled: (value) => false,
            },
          ],
        },
      ],
    },
  ];

  const generateCellData = (cellData, index) => {
    if (
      cellData.type === "patientInformation" ||
      cellData.type === "labInformation"
    ) {
      return (
        <InfoRow
          key={cellData.data.value}
          cellData={cellData}
          patientData={patientData}
          patientLabRecord={patientLabRecord}
        />
      );
    }
    if (cellData.type === "buttons") {
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          {cellData.data.map((button, index) => (
            <Button
              key={`button${index}`}
              style={button.style}
              type={button.buttonType}
              disabled={button.disabled(patientLabRecord?.Status)}
              onClick={() => button.onClick(patientLabRecord?.LaboratoryNo)}
            >
              {button.disabled ? button.data.disabled : button.data.active}
            </Button>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {rowData.map((colData, index) => (
          <Col
            key={index}
            md={{ span: 8 }}
            xs={{ span: 24 }}
            style={{
              display: "grid",
              alignContent: "flex-start",
              gap: "8px",
            }}
          >
            <Typography.Title
              level={5}
              style={{ color: "#0F5689", marginBottom: "12px" }}
            >
              {colData.title}
            </Typography.Title>
            {colData.data.map((cellData, index) =>
              generateCellData(cellData, index)
            )}
          </Col>
        ))}
      </Row>
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
    </>
  );
};

const InfoRow = ({ cellData, patientLabRecord, patientData }) => {
  const { highlighted, type, data, helper } = cellData || {};

  let value = "";
  let color = "gray";

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
    <Typography.Text level={5} style={{ display: "block", fontWeight: "bold" }}>
      <span>{`${data.label} :`}</span>
      <span style={{ color }}>{` ${value}` || "N/A"}</span>
    </Typography.Text>
  );
};

export default LabHeader;

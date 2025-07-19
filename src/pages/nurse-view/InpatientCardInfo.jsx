import { useState } from "react";

import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Spin, Typography, Modal } from "antd";

import { calculateAge } from "../../utils/helpers";
import useFetchPatientDetailsHook from "../../hooks/useFetchPatientDetailsHook";

import PatientFile from "./PatientFile";

const InpatientCardInfo = ({ patientDetail }) => {
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get("PatientNo");
  const [patientFileVisible, setPatientFileVisible] = useState(false);

  const { loadingPatientDetails, patientDetails } =
    useFetchPatientDetailsHook(patientNo);

  const invalidDate = "0001-01-01";
  const handlePatientFileClick = () => {
    setPatientFileVisible(true);
  };

  const handleModalClose = () => {
    setPatientFileVisible(false);
  };

  return (
    <>
      <Card
        className="card"
        style={{
          width: "100%",
          borderTop: "3px solid #0f5689",
          padding: "20px",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Typography.Text
              style={{ fontWeight: "bold", fontSize: "16px", color: "#0f5689" }}
            >
              {patientDetails?.SearchName || "N/A"}
            </Typography.Text>
            <br />
            <Typography.Text style={{ fontWeight: "bold", color: "#0f5689" }}>
              Patient Number: {patientDetails?.PatientNo || "N/A"}
            </Typography.Text>
          </div>
          <div>
            <Button
              type="primary"
              style={{ backgroundColor: "#0f5689", color: "#ffffff" }}
              onClick={handlePatientFileClick}
            >
              Patient File
            </Button>
          </div>
        </div>

        <Divider />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
          <div>
            <Typography.Text strong>Admission No:</Typography.Text>
            <br />
            <Typography.Text>
              {patientDetails?.CurrentAdmNo || "N/A"}
            </Typography.Text>
          </div>

          <div>
            <Typography.Text strong>Age and Gender:</Typography.Text>
            <br />
            {loadingPatientDetails ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 24, color: "#0f5689" }}
                    spin
                  />
                }
              />
            ) : (
              <Typography.Text>
                {calculateAge(patientDetails?.DateOfBirth) || "N/A"},{" "}
                {patientDetails?.Gender || "N/A"}
              </Typography.Text>
            )}
          </div>

          <div>
            <Typography.Text strong>Admitting Doctor:</Typography.Text>
            <br />
            <Typography.Text>
              {patientDetail?.Doctors_Name || "N/A"}
            </Typography.Text>
          </div>

          <div>
            <Typography.Text strong>Date of Admission:</Typography.Text>
            <br />
            <Typography.Text>
              {moment(patientDetails?.Admission_Date).isValid() &&
              patientDetails?.Admission_Date !== invalidDate
                ? moment(patientDetails?.Admission_Date).format(
                    "dddd, MMMM Do, YYYY"
                  )
                : "N/A"}
            </Typography.Text>
          </div>

          <div>
            <Typography.Text strong>Expected Discharge:</Typography.Text>
            <br />
            <Typography.Text>
              {moment(patientDetails?.Expected_Date_of_Discharge).isValid() &&
              patientDetails?.Expected_Date_of_Discharge !== invalidDate
                ? moment(patientDetails?.Expected_Date_of_Discharge).format(
                    "dddd, MMMM Do, YYYY"
                  )
                : "N/A"}
            </Typography.Text>
          </div>
          <div>
            <Typography.Text strong>Payment Mode:</Typography.Text>
            <br />
            <Typography.Text>
              {patientDetails?.PatientType || "N/A"}
            </Typography.Text>
          </div>
         {patientDetails?.PatientType && patientDetails?.PatientType !== "Cash" && (
            <div>
            <Typography.Text strong>Insurance Name:</Typography.Text>
            <br />
            <Typography.Text>
              {patientDetails?.InsuranceName || "N/A"}
            </Typography.Text>
          </div>
         )}
          <div>
            <Typography.Text strong>Ward and Room:</Typography.Text>
            <br />
            <Typography.Text>
              {patientDetail?.Ward || "N/A"}, {patientDetail?.Bed || "N/A"}
            </Typography.Text>
          </div>
        </div>
      </Card>

      <Modal
        title="Patient File"
        open={patientFileVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ padding: "8px" }}
      >
        <PatientFile patientNo={patientNo} />
      </Modal>
    </>
  );
};

export default InpatientCardInfo;

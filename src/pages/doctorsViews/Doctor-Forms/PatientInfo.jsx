import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Avatar,
  Button,
  message,
  Modal,
  Form,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import useAuth from "../../../hooks/useAuth";
import { postInterimInvoice } from "../../../actions/Charges-Actions/printInterimInvoice";
import { listClinics, listDoctors } from "../../../actions/DropdownListActions";
import { postMarkasCompleted } from "../../../actions/Doc-actions/postMarkasCompleted";
import TextArea from "antd/es/input/TextArea";
import { postPsychologyRequestReviewSlice } from "../../../actions/Doc-actions/psychologyReducers";
import { calculateAge } from "../../../utils/helpers";
import { useLocation } from "react-router-dom";

const PatientInfo = ({ patientNo, treatmentNo, patientDetails, role }) => {
  const dispatch = useDispatch();
  const staffNo = useAuth().userData.No;
  const location = useLocation();
  const patient = location.state?.patientDetails || {};

  console.log('patient details', patient)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading: invoiceProcessingLoading, error: invoiceProcessingError } =
    useSelector((state) => state.postInterimInvoice);
  const { loadingCheInPatient: markasCompleteLoading } = useSelector(
    (state) => state.markAsCompleted
  );

  const { loading: doctorsLoading, data: doctorsPayload } = useSelector(
    (state) => state.getDoctorsList
  );
  const [form] = Form.useForm();

  const { loading: loadingPostPsychologyRequest } = useSelector(
    (state) => state.postPsychologyRequest
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { loading: clinicsLoading, clinics: clinicsPayload } = useSelector(
    (state) => state.clinics
  );

  const [selectedClinic, setSelectedClinic] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const handleSelectChange = (value) => {
    setSelectedClinic(value);
    const matchingDoctors = doctorsPayload.filter(
      (doctor) => doctor.Specialization.toUpperCase() === value.toUpperCase()
    );
    setFilteredDoctors(matchingDoctors);
  };

  const handleOnFinish = async (values) => {
    const data = {
      ...values,
      patientNo,
      treatmentNo,
      staffNo,
    };

    await dispatch(postPsychologyRequestReviewSlice(data)).then((data) => {
      if (data?.status === "success") {
        message.success("Request Sent Successfully");
      } else {
        message.error("Failed to send request. Please try again.");
      }
    });
  };

  const capitalizeWords = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const patientName = patientDetails?.Names
    ? capitalizeWords(patientDetails.Names)
    : capitalizeWords(
        [
          patientDetails?.Surname,
          patientDetails?.LastName,
          patientDetails?.MiddleName,
        ]
          .filter(Boolean)
          .join(" ")
      );
  const handlePrintInvoice = () => {
    const invoiceData = {
      PatientNo: patientNo,
      visitNo: treatmentNo,
      staffNo,
    };

    dispatch(postInterimInvoice(invoiceData));
  };

  useEffect(() => {
    dispatch(listClinics());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listDoctors());
  }, [dispatch]);

  const handleMarkAsCompleted = () => {
    dispatch(postMarkasCompleted(treatmentNo))
      .then((data) => {
        if (data?.status === "success") {
          message.success("Patient has been Marked as completed");
        } else {
          message.error("Failed to mark as completed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error marking as completed:", error);
        message.error("An error occurred. Please try again.");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        alignContent: "center",
        gap: "20px",
        paddingBottom: "20px",
      }}
    >
      <Modal
        title="Request Patient Review"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Send Request"
        confirmLoading={loadingPostPsychologyRequest}
      >
        <Form
          layout="vertical"
          style={{ paddingTop: "10px" }}
          form={form}
          onFinish={handleOnFinish}
          initialValues={{
            date: "",
            time: "",
            handingOver: "",
            takingOver: "",
            remarks: "",
          }}
        >
          <Form.Item
            label="Select Clinic"
            name="clinic"
            rules={[{ required: true, message: "Please select clinic" }]}
          >
            <Select
              showSearch
              placeholder="Select Clinic"
              style={{ width: "100%" }}
              onChange={handleSelectChange}
              loading={clinicsLoading}
              options={
                clinicsPayload?.map((clinic) => ({
                  value: clinic?.No,
                  label: clinic?.Description,
                })) || []
              }
              filterOption={(value, option) =>
                option?.label.toLowerCase().includes(value.toLowerCase())
              }
            />
          </Form.Item>
          {(selectedClinic?.toLowerCase() === "psychiatrist" ||
            selectedClinic?.toLowerCase() === "psychologist") && (
            <Form.Item
              label={
                selectedClinic?.toLowerCase() === "psychiatrist"
                  ? "Select Psychiatrist"
                  : "Select Psychologist"
              }
              name="doctor"
            >
              <Select
                showSearch
                placeholder={
                  selectedClinic?.toLowerCase() === "psychiatrist"
                    ? "Select Psychiatrist"
                    : "Select Psychologist"
                }
                style={{ width: "100%" }}
                loading={doctorsLoading}
                options={filteredDoctors.map((doctor) => ({
                  value: doctor?.DoctorID,
                  label: doctor?.DoctorsName,
                }))}
                filterOption={(value, option) =>
                  option?.label.toLowerCase().includes(value.toLowerCase())
                }
              />
            </Form.Item>
          )}

          <Form.Item label="Request Reason" name="remarks">
            <TextArea
              placeholder="Enter Request Reason"
              style={{ width: "100%" }}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Card
        className="card col-md-6 col-lg-6 col-xl-6"
        style={{
          padding: "10px 16px",
          marginTop: "10px",
          background: "#e5e3e3",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <Avatar icon={<UserOutlined />} size={48} />
          <div>
            <Typography.Title
              level={5}
              style={{ margin: 0, fontSize: "16px", color: "#0F5689" }}
            >
              {patientName || patientDetails?.SearchName}
            </Typography.Title>
            <Typography.Text style={{ fontSize: "13px", color: "gray" }}>
              Age: {calculateAge(patientDetails?.DateOfBirth)}
            </Typography.Text>
          </div>
        </div>

        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          Additional Information
        </Typography.Title>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <InfoRow
            label="Patient Number"
            value={patientDetails?.PatientNo || patientNo}
          />
          <InfoRow label="Treatment Number" value={treatmentNo} />
          {/* <InfoRow label="Age" value={`${patientDetails?.AgeinYears} Years`} /> */}
          <InfoRow label="Gender" value={patientDetails?.Gender} />
          {/* {!loadingConsultationRoomDetails && <InfoRow label={'Consulting Doctor'} value={consultationRoomDetails[0].DoctorsName} />} */}
          {/* <InfoRow label={'Consulting Doctor'} value={consultationRoomDetails[0].DoctorsName} /> */}
        </div>
      </Card>
      <Card
        className="card col-md-6 col-lg-6 col-xl-6"
        style={{
          padding: "10px 16px",
          marginTop: "10px",
          background: "#e5e3e3",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography.Title
          level={5}
          style={{
            color: "#0f5689",
            fontSize: "14px",
            margin: "10px 0 10px 0",
          }}
        >
          Settlement Information
        </Typography.Title>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography.Title
            level={5}
            style={{ fontSize: "14px", color: "black" }}
          >
            Settlement Type
          </Typography.Title>

          <Typography.Text
            style={{
              fontSize: "12px",
              color: "gray",
              fontWeight: "bold",
            }}
          >
            {patientDetails?.PatientType || "N/A"}
          </Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography.Title
            level={5}
            style={{ fontSize: "14px", color: "black" }}
          >
            Phone Number
          </Typography.Title>

          <Typography.Text
            style={{
              fontSize: "12px",
              color: "gray",
              fontWeight: "bold",
            }}
          >
            {patientDetails?.TelephoneNo1 || "N/A"}
          </Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          {patientDetails?.PatientType === "Cash" ? null : (
            <>
              <Typography.Title
                level={5}
                style={{ fontSize: "14px", color: "black" }}
              >
                Insurance
              </Typography.Title>
              <Typography.Text
                style={{
                  fontSize: "12px",
                  color: "gray",
                  fontWeight: "bold",
                }}
              >
                {patientDetails?.SchemeName || "N/A"}
              </Typography.Text>
            </>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <Typography.Title
            level={5}
            style={{ fontSize: "14px", color: "black" }}
          >
            Treatment Date
          </Typography.Title>
          <Typography.Text
          >
            {patient?.TreatmentDate}
          </Typography.Text>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          {(role === "Doctor" || role === "Psychology") &&
        patient?.Status !== "Completed" && (
            <div className="d-block gap-4 d-md-flex justify-content-center align-items-center w-100">
              <Button
                type="primary"
                onClick={handleMarkAsCompleted}
                loading={markasCompleteLoading}
                disabled={markasCompleteLoading}
                style={{ width: "100%", marginBottom: "10px" }}
              >
                Mark as Completed
              </Button>
              <Button
                type="default"
                onClick={showModal}
                style={{ width: "100%" }}
              >
                Request Patient Review
              </Button>
              {/* <Button
                    type="primary"
                    // style={{ marginTop: "10px", width: "100%" }}
                    onClick={() => handlePrintInvoice(patientDetails?.PatientId)}
                    >
                    Print Interim Invoice
                    </Button> */}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Helper component for displaying label and value pairs
const InfoRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    <Typography.Title
      level={5}
      style={{ fontSize: "14px", color: "black", margin: 0 }}
    >
      {label}
    </Typography.Title>
    <Typography.Text
      style={{
        fontSize: "14px",
        color: "gray",
        fontWeight: "bold",
      }}
    >
      {value || "N/A"}
    </Typography.Text>
  </div>
);

export default PatientInfo;

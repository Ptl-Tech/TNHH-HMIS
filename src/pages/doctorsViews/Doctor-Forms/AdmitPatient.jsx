import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  Typography,
  Modal,
} from "antd";
import {
  FileTextOutlined,
  HistoryOutlined,
  CloseCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { IoBedOutline } from "react-icons/io5";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPatientAdmission,
  saveAdmissionDetails,
} from "../../../actions/Doc-actions/postAdmissionRequest";

const AdmitPatientForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo"); // Get 'TreatmentNo' from query params
  const [historyVisible, setHistoryVisible] = useState(false);
  const { loading } = useSelector((state) => state.saveAdmissionDetails);
  const { loading: loadingAdmissionRequest, success: admissionRequestSuccess } =
    useSelector((state) => state.requestAdmission);

  // Set current date for the date of admission
  const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

  // Sample patient admission history data
  const admissionHistoryData = [
    {
      key: "1",
      admissionDate: "01/01/2024",
      admissionArea: "Ward A",
      admissionNurse: "Nurse A",
      reason: "General Checkup",
    },
    {
      key: "2",
      admissionDate: "05/02/2024",
      admissionArea: "Ward B",
      admissionNurse: "Nurse B",
      reason: "Surgery",
    },
  ];

  // Table columns for the admission history
  const admissionHistoryColumns = [
    {
      title: "Admission Date",
      dataIndex: "admissionDate",
      key: "admissionDate",
    },
    {
      title: "Admission Area",
      dataIndex: "admissionArea",
      key: "admissionArea",
    },
    {
      title: "Admission Nurse",
      dataIndex: "admissionNurse",
      key: "admissionNurse",
    },
    { title: "Reason for Admission", dataIndex: "reason", key: "reason" },
  ];

  // Function to show the modal
  const handleHistoryClick = () => setHistoryVisible(true);

  // Function to close the modal
  const handleCancel = () => setHistoryVisible(false);

  const handleAdmissionRequest = () => {
    dispatch(requestPatientAdmission(treatmentNo));
    console.log("Admission request sent for treatmentNo:", treatmentNo);
  };

  // Function to handle form submission and dispatch action
  const handlePatientAdmission = (values) => {
    const admissionObject = {
      myAction: "create",  // Action type
      treatmentNo: values.treatmentNo,  // Treatment number from form
      dateOfAdmission: values.dateOfAdmission,  // Use the date as-is from the form
      admissionReason: values.admissionReason,  // Admission reason from form
    };
  
    // Ensure the dateOfAdmission is in the correct format (YYYY-MM-DD) before sending to the backend
    if (admissionObject.dateOfAdmission) {
      const formattedDate = new Date(admissionObject.dateOfAdmission).toISOString().split("T")[0]; // Format as YYYY-MM-DD
      admissionObject.dateOfAdmission = formattedDate;
    }
  
    dispatch(saveAdmissionDetails(admissionObject));  // Dispatch the action with the Admission object
  };
  
  return (
    <div>
      {/* Button Section */}
      <div style={{ marginBottom: "20px" }}>
        <Typography.Title
          level={4}
          style={{ color: "#0F5689", display: "flex", alignItems: "center" }}
        >
          <FileTextOutlined style={{ marginRight: "8px" }} />
          Patient Admission
        </Typography.Title>

        <div style={{ float: "right", display: "flex", alignItems: "center" }}>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            icon={<IoBedOutline />}
            loading={loadingAdmissionRequest}
            onClick={handleAdmissionRequest}
            disabled={loadingAdmissionRequest} // Prevent clicking until saved
            className={
              loading || admissionRequestSuccess ? "ant-btn-disabled" : ""
            } // Ensure it appears visually disabled
          >
            Request Admission
          </Button>

          <Button
            type="default"
            onClick={handleHistoryClick}
            style={{ marginRight: "10px" }}
            icon={<HistoryOutlined />}
          >
            Show History
          </Button>
          <Button
            type="default"
            variant="Dashed"
            style={{ marginLeft: "10px" }}
            icon={<CloseCircleOutlined />}
            danger
          >
            Cancel Admission
          </Button>
        </div>
      </div>

      {/* Patient Admission Form */}
      <Form
        layout="vertical"
        className="admit-patient-card-container my-4"
        initialValues={{
          treatmentNo: treatmentNo,
          dateOfAdmission: currentDate,
          admissionReason: "",
        }}
        onFinish={handlePatientAdmission}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="treatmentNo"
              label="Treatment Number"
              rules={[{ required: true }]}
            >
              <Input
                style={{ width: "100%", color: "green", fontWeight: "bold" }}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Date of Admission" name="dateOfAdmission">
              <Input type="text" value={currentDate} disabled />{" "}
              {/* Default to current date */}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Admission Reason" name="admissionReason">
              <TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Space>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              <SaveOutlined /> Save Admission Details
            </Button>
          </Form.Item>
        </Space>
      </Form>

      {/* Modal for Patient Admission History */}
      <Modal
        title="Patient Admission History"
        visible={historyVisible}
        onCancel={handleCancel}
        footer={
          <Button type="primary" onClick={handleCancel}>
            Close
          </Button>
        }
        width={800}
      >
        <Table
          dataSource={admissionHistoryData}
          columns={admissionHistoryColumns}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default AdmitPatientForm;

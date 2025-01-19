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
  PlusOutlined,
} from "@ant-design/icons";
import { IoBedOutline } from "react-icons/io5";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  requestPatientAdmission,
  saveAdmissionDetails,
} from "../../../actions/Doc-actions/postAdmissionRequest";
import { getAdmissionLines } from "../../../actions/Doc-actions/Admission/getAdmissionLines";
import { useForm } from "antd/es/form/Form";
import moment from "moment";

const AdmitPatientForm = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = useForm();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo"); // Get 'TreatmentNo' from query params

  const [historyVisible, setHistoryVisible] = useState(false);

  const { loading } = useSelector((state) => state.saveAdmissionDetails);

  const { loading: loadingAdmissionRequest, success: admissionRequestSuccess } =  
    useSelector((state) => state.requestAdmission);

  const { loading: loadingAdmissionLines, data: admissionLines } = useSelector(
    (state) => state.getAdmissionLines
  );

  useEffect(() => {
    if (treatmentNo) {
      dispatch(getAdmissionLines(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  // Table columns for the admission history
  const admissionHistoryColumns = [
    {
      title: "Treatment Number",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Reason for Admission",
      dataIndex: "AdmissionReason",
      key: "AdmissionReason",
    },

    {
      title: "Admission Date",
      dataIndex: "DateOfAdmission",
      key: "DateOfAdmission",
    },

    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (text) => {
        return (
          <span
            style={{
              color: text === "Approved" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {text}
          </span>
        );
      },
    },
  ];

  const dataSource = [
    {
      key: admissionLines?.TreatmentNo,
      TreatmentNo: admissionLines?.TreatmentNo,
      AdmissionReason: admissionLines?.AdmissionReason,
      DateOfAdmission: admissionLines?.DateOfAdmission,
      Status: admissionLines?.Status,
    },
  ];
  
  // Function to show the modal
  const handleHistoryClick = () => {
    setHistoryVisible(true);
  };

  // Function to close the modal
  const handleCancel = () => setHistoryVisible(false);

  const handleAdmissionRequest = () => {
    dispatch(requestPatientAdmission(treatmentNo));

    if (admissionRequestSuccess) {
      dispatch(getAdmissionLines(treatmentNo));
    }
  };

  const handlePatientAdmission = () => {
    const { admissionReason } = form.getFieldsValue(); 
    
    const admissionObject = {
      myAction: "create", // Action type
      treatmentNo: treatmentNo,
      dateOfAdmission: moment().format("YYYY-MM-DD"),
      admissionReason: admissionReason || "", 
    };

    dispatch(saveAdmissionDetails(admissionObject));
     
    if (admissionRequestSuccess) {
      dispatch(getAdmissionLines(treatmentNo));
    }
    
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

        <div className="d-flex justify-content-end my-2">
          <Button
            type="primary"
            onClick={handleHistoryClick}
            style={{ marginRight: "10px" }}
            icon={<PlusOutlined />}
          >
            New Admission Request
          </Button>
        </div>
      </div>

      {/* Patient Admission Form */}
      <Table
        dataSource={dataSource}
        columns={admissionHistoryColumns}
        pagination={false}
      />

      {/* Modal for Patient Admission History */}
      <Modal
        title="Patient Admission "
        visible={historyVisible}
        onCancel={handleCancel}
        footer={
          <Space>
            <Button type="primary" loading={loading} onClick={handlePatientAdmission}>
              <SaveOutlined /> Save Admission Details
            </Button>
            <Button
              type="primary"
              style={{ marginRight: "10px" }}
              icon={<IoBedOutline />}
              loading={loadingAdmissionRequest}
              onClick={handleAdmissionRequest}
              disabled={loadingAdmissionRequest} // Prevent clicking until saved
              className={loading || admissionRequestSuccess ? "ant-btn-disabled" : ""}
            >
              Request Admission
            </Button>
            <Button type="primary" onClick={handleCancel}>
              Close
            </Button>
          </Space>
        }
        width={800}
      >
        <Form
          layout="vertical"
          className="admit-patient-card-container"
          initialValues={{
            treatmentNo: treatmentNo,
            admissionReason: "",
          }}
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="treatmentNo"
                label="Treatment Number"
                rules={[{ required: true }]}
              >
                <Input
                  style={{ width: "100%", color: "#0F5689", fontWeight: "bold" }}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date of Admission" name="dateOfAdmission">
                <Input
                  type="text"
                  value={moment().format("DD MMM YYYY")}
                  style={{ fontWeight: "bold", color: "#0F5689" }}
                  disabled
                />
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
        </Form>
      </Modal>
    </div>
  );
};

export default AdmitPatientForm;

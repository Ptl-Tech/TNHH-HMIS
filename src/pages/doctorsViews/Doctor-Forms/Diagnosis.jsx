import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Button,
  Typography,
  Select,
  Checkbox,
  message,
  Modal,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FileTextOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { getdiagnosisSetup } from "../../../actions/Doc-actions/qyDiagnosisSetup";
import { postDiagnosisRequest } from "../../../actions/Doc-actions/postDiagnosis";
import ModalComponent from "../../../components/MessageModal";

const { Option } = Select;

const Diagnosis = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getDiagnosisSetup);
  const { loading, error, success } = useSelector((state) => state.postdiagnosis);

  const [diagnosisList, setDiagnosisList] = useState([]);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    type: "info",
    title: "",
    content: "",
  });

  useEffect(() => {
    dispatch(getdiagnosisSetup());
  }, [dispatch]);

  const handleAddDiagnosis = () => {
    if (diagnosisInput.trim()) {
      setDiagnosisList([
        ...diagnosisList,
        { diagnosisCode: diagnosisInput, confirmed: false, remarks: "" },
      ]);
      setDiagnosisInput(""); // Reset Select field
    }
  };

  const handleUpdateDiagnosis = (index, field, value) => {
    const updatedList = [...diagnosisList];
    updatedList[index][field] = value;
    setDiagnosisList(updatedList);
  };

  const handleRemoveDiagnosis = (index) => {
    setDiagnosisList(diagnosisList.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values) => {
    const { dueDate } = values;
  
    const formattedDueDate = {
      year: dueDate.year(),
      month: dueDate.month() + 1,
      day: dueDate.date(),
    };
  
    const Diagnosis = {
      myAction: "create",
      treatmentNo: treatmentNo || values.treatmentNo,
      diagnosisNo: values.diagnosisCode,
      confirmed: false,
      dueDate: formattedDueDate,
      diagnosisList,
    };
  
    try {
      let success = true;
  
      // Dispatch each diagnosis
      for (let diagnosis of diagnosisList) {
        const diagnosisData = {
          myAction: "create",
          treatmentNo: treatmentNo || values.treatmentNo,
          diagnosisNo: diagnosis.diagnosisCode,
          diagnosisCode: diagnosis.diagnosisCode,
          confirmed: diagnosis.confirmed,
          remarks: diagnosis.remarks,
        };
  
        const response = await dispatch(postDiagnosisRequest(diagnosisData));
  
        // Check response for success status
        if (response.status !== "success") {
          success = false;
          break;
        }
      }
  
      // Update modal content based on the result
     setTimeout(() => {
      if (success) {
        Modal.success({
          content: "Diagnosis saved successfully.",
        });
      } else {
        setModalContent({
          type: "error",
          title: "Save Failed",
          content: "Failed to save diagnosis. Please try again.",
        });
      }
  
      // Display the modal after processing
      if (success) {
        setDiagnosisList([]); // Clear the list on success
      }
      setIsModalVisible(true);
    }, 1000);
    
    } catch (error) {
      setModalContent({
        type: "error",
        title: "Error",
        content: "An error occurred while saving the diagnosis. Please try again.",
      });
      setIsModalVisible(true);
    }
  };
  
  return (
    <div>
      <Typography.Title
        level={5}
        style={{
          color: "#0F5689",
          fontSize: "16px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Diagnosis
      </Typography.Title>

      <Form
        layout="vertical"
        initialValues={{
          treatmentNo: treatmentNo || "",
          diagnosisCode: "",
          dueDate: moment(),
        }}
        autoComplete="off"
        onFinish={handleSubmit}
      >
        <Row gutter={24} style={{ paddingBottom: "16px" }}>
          <Col span={12}>
            <Form.Item
              name="treatmentNo"
              label="Treatment Number"
              rules={[{ required: true, message: "Please enter the treatment number." }]}
            >
              <Input
                placeholder="Treatment Number"
                style={{ width: "100%", color: "green", fontWeight: "bold" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: "Please select a due date!" }]}
            >
              <DatePicker
                placeholder="Select Due Date"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24} style={{ paddingBottom: "16px" }}>
          <Col span={18}>
            <Form.Item name="diagnosisCode" label="Diagnosis Code">
              <Select
                placeholder="Select Diagnosis"
                onChange={setDiagnosisInput}
                value={diagnosisInput}
                name="diagnosisCode"
              >
                {data?.map((item) => (
                  <Option key={item.Code} value={item.Code}>
                    {item.Description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddDiagnosis}
                style={{ width: "100%", marginTop: "26px" }}
              >
                Add
              </Button>
            </Form.Item>
          </Col>
        </Row>

        {diagnosisList.length > 0 && (
          <div
            style={{
              marginTop: "16px",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontWeight: "bold",
                padding: "8px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div style={{ flex: "1" }}>#</div>
              <div style={{ flex: "3" }}>Diagnosis Code</div>
              <div style={{ flex: "2" }}>Confirmed</div>
              <div style={{ flex: "4" }}>Remarks</div>
              <div style={{ flex: "1" }}>Action</div>
            </div>
            {diagnosisList.map((diagnosis, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  padding: "8px 0",
                  borderBottom: "1px solid #f0f0f0",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: "1" }}>{index + 1}</div>
                <div style={{ flex: "3" }}>
                  <Input
                    value={diagnosis.diagnosisCode}
                    onChange={(e) =>
                      handleUpdateDiagnosis(index, "diagnosisCode", e.target.value)
                    }
                  />
                </div>
                <div style={{ flex: "2", marginLeft: "20px" }}>
                  <Checkbox
                    checked={diagnosis.confirmed}
                    onChange={(e) =>
                      handleUpdateDiagnosis(index, "confirmed", e.target.checked)
                    }
                  >
                    Confirm
                  </Checkbox>
                </div>
                <div style={{ flex: "4" }}>
                  <Input
                    value={diagnosis.remarks}
                    onChange={(e) =>
                      handleUpdateDiagnosis(index, "remarks", e.target.value)
                    }
                  />
                </div>
                <div style={{ flex: "1" }}>
                  <Button
                    type="text"
                    danger
                    onClick={() => handleRemoveDiagnosis(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "16px", marginBottom: "56px" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "150px", float: "right" }}
            icon={<SaveOutlined />}
            loading={loading}
          >
            Save Diagnosis
          </Button>
        </div>
      </Form>

      {/* Show the success/error message modal */}
      {isModalVisible && (
        <ModalComponent
          type={modalContent.type}
          title={modalContent.title}
          content={modalContent.content}
          onOk={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default Diagnosis;

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
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FileTextOutlined,
  SaveOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getdiagnosisSetup } from "../../../actions/Doc-actions/qyDiagnosisSetup";
import { postDiagnosisRequest } from "../../../actions/Doc-actions/postDiagnosis";
import ModalComponent from "../../../components/MessageModal";
import { getDiagnosisLines } from "../../../actions/Doc-actions/getDiagnosisLines";
import { getSecondaryDiagnosisSetup } from "../../../actions/Doc-actions/qySecondaryDiagnosisSetup";

const { Option } = Select;

const Diagnosis = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getDiagnosisSetup);
  const { data: secondaryDiagnosis } = useSelector((state) => state.getSecondaryDiagnosisSetup);  
  const { loading, error, success } = useSelector(
    (state) => state.postdiagnosis
  );
  const { loading: diagnosisLinesLoading, data: diagnosisLines } = useSelector(
    (state) => state.getDiagnosisLines
  );

  const [diagnosisList, setDiagnosisList] = useState([]);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);

  const [modalContent, setModalContent] = useState({
    type: "info",
    title: "",
    content: "",
  });

  useEffect(() => {
    dispatch(getdiagnosisSetup());
    dispatch(getSecondaryDiagnosisSetup());
  }, [dispatch]);

  useEffect(() => {
    if (treatmentNo) {
      dispatch(getDiagnosisLines(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

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

  const handleViewDoctorNotes = () => {
    navigate("/Doctor/Doctor-Notes");
  };

  const handleHistoryClick = () => {
    setHistoryVisible(true);
  };

  const handleSubmit = async (values) => {
    const Diagnosis = {
      myAction: "create",
      treatmentNo: treatmentNo || values.treatmentNo,
      diagnosisNo: values.diagnosisCode,
      confirmed: false,
      dueDate: moment().format("YYYY-MM-DD"),
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
        content:
          "An error occurred while saving the diagnosis. Please try again.",
      });
      setIsModalVisible(true);
    }
  };

  const diagnosisLinesColumns = [
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
      // render text  in blue color
      render: (text) => (
        <span style={{ color: "#0F5689", fontWeight: "bold" }}>{text}</span>
      ),
    },
    {
      title:"Diagnosis Code",
      dataIndex: "DiagnosisCode",
      key: "DiagnosisCode",
    },
    {
      title: "Diagnosis",
      dataIndex: "DiagnosisName",
      key: "DiagnosisName",
    },
    {
      title: "Confirmed",
      dataIndex: "Confirmed",
      key: "Confirmed",
      render: (text) => {
        return (
          <span style={{ color: text ? "green" : "red", fontWeight: "bold" }}>
            {text ? "Yes" : "No"}
          </span>
        );
      },
    },
    
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          danger
          // onClick={() => handleDeleteDiagnosis(record.TreatmentNo)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const dataSource=Array.isArray(diagnosisLines)
  ? diagnosisLines.filter((item) => item.TreatmentNo === treatmentNo) // Filter by TreatmentNo
  : Object.keys(diagnosisLines)
      .filter((key) => diagnosisLines[key].TreatmentNo === treatmentNo) // Filter based on TreatmentNo
      .map((key) => ({
        ...diagnosisLines[key],
        TreatmentNo: key,
      }));


  return (
    <div className="mt-4">
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
      <Row gutter={24}>
          <Col span={24}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginBottom: "16px", float: "right" }}
              onClick={handleHistoryClick}
            >
             Add New Diagnosis
            </Button>
          </Col>
          <Col span={12}>
            {/* <Button
            type="default"
            icon={<FileTextOutlined />}
            style={{ marginBottom: "16px", width: "100%" }}
            onClick={handleViewDoctorNotes}
          >
            Add Doctor Notes
          </Button> */}
          </Col>
        </Row>
      <Table
        dataSource={dataSource}
        columns={diagnosisLinesColumns}
        size="small"
        pagination={{
          position: ["bottom", "right"],
          showSizeChanger: true,
          pageSize: 10,
          style: { marginTop: "16px" },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />

      {/* Show the success/error message modal */}
      {isModalVisible && (
        <ModalComponent
          type={modalContent.type}
          title={modalContent.title}
          content={modalContent.content}
          onOk={() => setIsModalVisible(false)}
        />
      )}

      {/* Show the diagnosis history modal */}
      <Modal
        title="DIAGNOSTIC FORMULATION "
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
        width={1000}
      >
      
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
                name="diagnosisCode"
                label=" Primary Diagnosis"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Diagnosis"
                  onChange={setDiagnosisInput}
                  value={diagnosisInput}
                  name="diagnosisCode"
                  size='large'
                >
                  {data?.map((item) => (
                    <Option key={item.Code} value={item.Code}>
                      {item.Description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="underlyingIssues"
                label="Comorbid Issues"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Diagnosis"
                  onChange={setDiagnosisInput}
                  value={diagnosisInput}
                  name="underlyingIssues"
                  mode="multiple"
                  size="large"
                  style={{ width: "100%" }}
                >
                 {secondaryDiagnosis?.map((item) => (
                    <Option key={item.DiagnosisCode} value={item.DiagnosisCode}>
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
                        handleUpdateDiagnosis(
                          index,
                          "diagnosisCode",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div style={{ flex: "2", marginLeft: "20px" }}>
                    <Checkbox
                      checked={diagnosis.confirmed}
                      onChange={(e) =>
                        handleUpdateDiagnosis(
                          index,
                          "confirmed",
                          e.target.checked
                        )
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
      </Modal>
    </div>
  );
};

export default Diagnosis;

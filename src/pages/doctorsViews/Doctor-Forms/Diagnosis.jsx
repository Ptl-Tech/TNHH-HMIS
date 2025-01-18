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
  Tabs,
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
import TabPane from "antd/es/tabs/TabPane";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
const { Option } = Select;

const Diagnosis = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const patientNo = queryParams.get("PatientNo");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data } = useSelector((state) => state.getDiagnosisSetup);
  const { loading: diagnosisLinesLoadingData, data:diagnosisLinesData } = useSelector((state) => state.getTreatmentDiagnosisLines);

  const { data: secondaryDiagnosis } = useSelector(
    (state) => state.getSecondaryDiagnosisSetup
  );
  const { loading, error, success } = useSelector(
    (state) => state.postdiagnosis
  );
  const { loading: diagnosisLinesLoading, data: diagnosisLines } = useSelector(
    (state) => state.getDiagnosisLines
  );
  const { loading: savePatientHistory } = useSelector(
    (state) => state.postPatientHistory
  );
  const [primaryDiagnosisList, setPrimaryDiagnosisList] = useState([]);
  const [secondaryDiagnosisList, setSecondaryDiagnosisList] = useState([]);
  const [activeKey, setActiveKey] = useState("1"); // Default active key to Primary Diagnosis
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const[lastSavedDiagnosis, setLastSavedDiagnosis] = useState([]);
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

  const handleEditorChange = (state) => {
    setEditorState(state);
    form.setFieldValue("notes", state.getCurrentContent().getPlainText());
  };
  const handleViewDoctorNotes = () => {
    navigate("/Doctor/Doctor-Notes");
  };

  const handleHistoryClick = () => {
    setHistoryVisible(true);
  };

  const handleSave = () => {
    const plainTextContent = editorState.getCurrentContent().getPlainText();
    form.validateFields().then((values) => {
      const payload = {
        myAction: "create",
        recId: "",
        treatmentNo: treatmentNo,
        patientNo: patientNo,
        notesType: "11",
        notes: plainTextContent,
      };
      const success = dispatch(postPatientHistoryNotes(payload));
      if (success) {
        message.success("Notes saved successfully");
      }
    });
  };
  const handleAddDiagnosis = (type) => {
    if (diagnosisInput !== "") {
      const newDiagnosis = {
        diagnosisCode: diagnosisInput,
        confirmed: false,
        remarks: "",
        diagnosisType: type, // 1 for primary, 2 for secondary
      };

      if (type === 1) {
        setPrimaryDiagnosisList((prevList) => [...prevList, newDiagnosis]);
      } else if (type === 2) {
        setSecondaryDiagnosisList((prevList) => [...prevList, newDiagnosis]);
      }

      setDiagnosisInput(""); // Reset the input field
    }
  };

  const handleUpdateDiagnosis = (index, field, value, type) => {
    let updatedList = [];
    if (type === 1) {
      updatedList = [...primaryDiagnosisList];
      updatedList[index][field] = value;
      setPrimaryDiagnosisList(updatedList);
    } else if (type === 2) {
      updatedList = [...secondaryDiagnosisList];
      updatedList[index][field] = value;
      setSecondaryDiagnosisList(updatedList);
    }
  };

  const handleRemoveDiagnosis = (index, type) => {
    if (type === 1) {
      setPrimaryDiagnosisList(
        primaryDiagnosisList.filter((_, i) => i !== index)
      );
    } else if (type === 2) {
      setSecondaryDiagnosisList(
        secondaryDiagnosisList.filter((_, i) => i !== index)
      );
    }
  };
  const handleSubmit = async (values) => {
    let success = true;
  
    // Filter for unsaved diagnoses
    const lastUnSavedPrimaryDiagnosis = primaryDiagnosisList.filter((diagnosis) => !diagnosis.diagnosisNo);
    const lastUnSavedSecondaryDiagnosis = secondaryDiagnosisList.filter((diagnosis) => !diagnosis.diagnosisNo);
  
    try {
      if (activeKey === "2") {
        // Primary Diagnosis Tab
        for (let diagnosis of lastUnSavedPrimaryDiagnosis) {
          const diagnosisData = {
            myAction: "create",
            treatmentNo: treatmentNo || values.treatmentNo,
            diagnosisType: "1",
            diagnosisNo: diagnosis.diagnosisCode,
            confirmed: diagnosis.confirmed,
            remarks: diagnosis.remarks,
          };
  
          const response = await dispatch(postDiagnosisRequest(diagnosisData));
  
          if (response.status === "success") {
            // Add saved diagnosis to the primary list
            message.success("Diagnosis saved successfully!");
            const updatedDiagnosis = { ...diagnosis, diagnosisNo: response.data.diagnosisNo }; // Assume `response.data.diagnosisNo` contains the saved ID
            setPrimaryDiagnosisList((prevList) => [...prevList, updatedDiagnosis]);
            form.resetFields();

          } else {
            success = false;
            message.error(`Error saving primary diagnosis: ${diagnosis.diagnosisCode}`);
          }
        }
      } else if (activeKey === "3") {
        // Secondary Diagnosis Tab
        for (let diagnosis of lastUnSavedSecondaryDiagnosis) {
          const diagnosisData = {
            myAction: "create",
            treatmentNo: treatmentNo || values.treatmentNo,
            diagnosisType: "2",
            diagnosisNo: diagnosis.diagnosisCode,
            confirmed: diagnosis.confirmed,
            remarks: diagnosis.remarks,
          };
  
          const response = await dispatch(postDiagnosisRequest(diagnosisData));
  
          if (response.status === "success") {
            // Add saved diagnosis to the secondary list
            message.success("Diagnosis saved successfully!");

            const updatedDiagnosis = { ...diagnosis, diagnosisNo: response.data.diagnosisNo }; // Assume `response.data.diagnosisNo` contains the saved ID
            setSecondaryDiagnosisList((prevList) => [...prevList, updatedDiagnosis]);
            form.resetFields();
          } else {
            success = false;
            message.error(`Error saving secondary diagnosis: ${diagnosis.diagnosisCode}`);
          }
        }
      }
  
      if (success) {
        setModalContent({
          type: "success",
          title: "Success",
          content: "All unsaved diagnoses have been successfully saved!",
        });
      } else {
        setModalContent({
          type: "error",
          title: "Error",
          content: "One or more diagnoses failed to save. Please try again.",
        });
      }
    } catch (error) {
      success = false;
      console.error("Error in handleSubmit:", error);
      message.error("An unexpected error occurred. Please try again.");
      setModalContent({
        type: "error",
        title: "Error",
        content: "An unexpected error occurred. Please try again.",
      });
    }
  
    setIsModalVisible(true); // Display success/error modal
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
      title: "Diagnosis Code",
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

  const dataSource =[
   {
    // key: diagnosisLines?.treatmentNo,
    TreatmentNo: diagnosisLines?.treatmentNo,
    DiagnosisCode: diagnosisLines?.diagnosisCode,
    DiagnosisName: diagnosisLines?.diagnosisName,
    Confirmed: diagnosisLines?.confirmed,
    Remarks: diagnosisLines?.remarks
   } 
  ]

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
        title="DIAGNOSTIC FORMULATION"
        visible={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={null}
        width={1000}
        maskClosable={false} // Prevents closing the modal by clicking outside
        style={{ top: 20 }}
      >
        <Tabs key="1" type="card" activeKey={activeKey} onChange={setActiveKey}>
          <TabPane tab="Diagnosis Formulation" key="1">
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="notes"
                    label="Notes"
                    rules={[
                      {
                        required: true,
                        message: "Please enter notes",
                      },
                      {
                        validator: (_, value) => {
                          if (value && value.length > 2000) {
                            return Promise.reject(
                              "Notes cannot exceed 2000 characters"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={handleEditorChange}
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "list",
                          "textAlign",
                          "history",
                        ],
                      }}
                      editorStyle={{
                        border: "1px solid #f0f0f0",
                        padding: "10px",
                        minHeight: "200px",
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "15px",
                }}
              >
                <Button type="primary" onClick={handleSave}>
                  Save
                </Button>
                <Button
                  type="default"
                  onClick={() => setHistoryVisible(false)}
                  danger
                >
                  Close
                </Button>
              </div>
            </Form>
          </TabPane>
          <TabPane tab="Add Primary Diagnosis " key="2">
            <Form
              layout="vertical"
              initialValues={{
                treatmentNo: treatmentNo || "",
                diagnosisCode: "",
                dueDate: moment(),
              }}
              autoComplete="off"
            >
              <Row gutter={24} style={{ paddingBottom: "16px" }}>
                <Col span={18}>
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
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        option?.children
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
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
                      onClick={() => handleAddDiagnosis(1)} // 1 for Primary
                      style={{ width: "100%", marginTop: "30px" }}
                      size="large"
                    >
                      Add
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              {primaryDiagnosisList.length > 0 && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  {/* Primary Diagnosis List */}
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
                  {primaryDiagnosisList.map((diagnosis, index) => (
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
                              e.target.value,
                              1
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
                              e.target.checked,
                              1
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
                            handleUpdateDiagnosis(
                              index,
                              "remarks",
                              e.target.value,
                              1
                            )
                          }
                        />
                      </div>
                      <div style={{ flex: "1" }}>
                        <Button
                          type="text"
                          danger
                          onClick={
                            () => handleRemoveDiagnosis(index, 1) // Passing diagnosisType for primary
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  marginTop: "16px",
                  marginBottom: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "15px",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "150px", float: "right" }}
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={() => handleSubmit()}
                >
                  Save Diagnosis
                </Button>
                <Button
                  type="default"
                  onClick={() => setHistoryVisible(false)}
                  danger
                >
                  Close
                </Button>
              </div>
            </Form>
          </TabPane>
          <TabPane tab="Add Secondary Diagnosis " key="3">
            <Form
              layout="vertical"
              initialValues={{
                treatmentNo: treatmentNo || "",
                diagnosisCode: "",
                dueDate: moment(),
              }}
              autoComplete="off"
            >
              <Row gutter={24} style={{ paddingBottom: "16px" }}>
                <Col span={18}>
                  <Form.Item
                    name="secondaryDiagnosisCode"
                    label="Comorbid Issues"
                    rules={[{ required: true }]}
                  >
                    <Select
                      placeholder="Select Diagnosis"
                      onChange={setDiagnosisInput}
                      value={diagnosisInput}
                      name="secondaryDiagnosisCode"
                      // mode="multiple"
                      showSearch
                      filterOption={(input, option) =>
                        option?.children
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      size="large"
                      style={{ width: "100%" }}
                    >
                      {secondaryDiagnosis?.map((item) => (
                        <Option
                          key={item.DiagnosisCode}
                          value={item.DiagnosisCode}
                        >
                          {item.Description}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddDiagnosis(2)} // 2 for Secondary
                    style={{ width: "100%", marginTop: "30px" }}
                    size="large"
                  >
                    Add
                  </Button>
                </Col>
              </Row>

              {secondaryDiagnosisList.length > 0 && (
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
                  {secondaryDiagnosisList.map((diagnosis, index) => (
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
                              e.target.value,
                              2
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
                              e.target.checked,
                              2
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
                            handleUpdateDiagnosis(
                              index,
                              "remarks",
                              e.target.value,
                              2
                            )
                          }
                        />
                      </div>
                      <div style={{ flex: "1" }}>
                        <Button
                          type="text"
                          danger
                          onClick={
                            () => handleRemoveDiagnosis(index, 2) // Passing diagnosisType for secondary
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

<div
                style={{
                  marginTop: "16px",
                  marginBottom: "56px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "15px",
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "150px", float: "right" }}
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={() => handleSubmit()}
                >
                  Save Diagnosis
                </Button>
                <Button
                  type="default"
                  onClick={() => setHistoryVisible(false)}
                  danger
                >
                  Close
                </Button>
              </div>
            </Form>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default Diagnosis;

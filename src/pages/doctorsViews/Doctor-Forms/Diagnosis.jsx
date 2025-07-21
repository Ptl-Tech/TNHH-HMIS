import {
  Form,
  Row,
  Col,
  Button,
  Typography,
  message,
  Modal,
  Tabs,
  Spin,
  Drawer,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getdiagnosisSetup } from "../../../actions/Doc-actions/qyDiagnosisSetup";
import { postDiagnosisRequest } from "../../../actions/Doc-actions/postDiagnosis";
import { getDiagnosisLines } from "../../../actions/Doc-actions/getDiagnosisLines";
import { getSecondaryDiagnosisSetup } from "../../../actions/Doc-actions/qySecondaryDiagnosisSetup";
import TabPane from "antd/es/tabs/TabPane";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import DiagnosisTable from "../tables/Diagnosis/DiagnosisTable";
import DiagnosisForm from "./DiagnosisForm";
// import useAuth from "../../../hooks/useAuth";

const Diagnosis = () => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const role = null.userData.departmentName;
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const admissionNo = queryParams.get("AdmNo");
  const patientNo = queryParams.get("PatientNo");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data } = useSelector((state) => state.getDiagnosisSetup);
  const { loading: loadingDiagnosisLines, data: diagnosisLines } = useSelector(
    (state) => state.getDiagnosisLines
  );
  const { data: secondaryDiagnosis } = useSelector(
    (state) => state.getSecondaryDiagnosisSetup
  );
  const { loading, error, success } = useSelector(
    (state) => state.postdiagnosis
  );

  const { loading: savePatientHistory } = useSelector(
    (state) => state.postPatientHistory
  );
  const [provisionDiagnosisList, setProvisionDiagnosisList] = useState([]);
  const [primaryDiagnosisList, setPrimaryDiagnosisList] = useState([]);
  const [secondaryDiagnosisList, setSecondaryDiagnosisList] = useState([]);
  const [activeKey, setActiveKey] = useState("1"); // Default active key to Primary Diagnosis
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [lastSavedDiagnosis, setLastSavedDiagnosis] = useState([]);
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
    } else if (admissionNo) {
      dispatch(getDiagnosisLines(admissionNo));
    }
  }, [dispatch, treatmentNo, admissionNo]);

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
  const handleClose = () => {
    setIsModalVisible(false); // Close the modal by updating state
    //reset the diagnosis list
    if (activeTab === "1") {
      setProvisionDiagnosisList([]);
    } else if (activeTab === "2") {
      setPrimaryDiagnosisList([]);
    } else if (activeTab === "3") {
      setSecondaryDiagnosisList([]);
    }
  };

  const handleSave = async () => {
    const plainTextContent = editorState.getCurrentContent().getPlainText();
    form.validateFields().then((values) => {
      const payload = {
        myAction: "create",
        recId: "",
        treatmentNo: treatmentNo ? treatmentNo : admissionNo,
        patientNo: patientNo,
        notesType: "11",
        notes: plainTextContent,
      };
      console.log("payload", payload);
      const success = dispatch(postPatientHistoryNotes(payload));
      if (success) {
        message.success("Notes saved successfully");
      }
    });
  };
  const handleAddDiagnosis = (type) => {
    console.log("clicked", type);
    if (diagnosisInput !== "") {
      const newDiagnosis = {
        remarks: "",
        confirmed: false,
        diagnosisCode: diagnosisInput,
        diagnosisType: type, // 1 for primary, 2 for secondary
      };
      if (type === 1) {
        setProvisionDiagnosisList((prevList) => [...prevList, newDiagnosis]);
      } else if (type === 2) {
        setPrimaryDiagnosisList((prevList) => [...prevList, newDiagnosis]);
      } else if (type === 3) {
        setSecondaryDiagnosisList((prevList) => [...prevList, newDiagnosis]);
      }

      setDiagnosisInput(""); // Reset the input field
    }
  };

  const handleUpdateDiagnosis = (index, field, value, type) => {
    let updatedList = [];
    if (type === 1) {
      updatedList = [...provisionDiagnosisList];
      updatedList[index][field] = value;
      setProvisionDiagnosisList(updatedList);
    } else if (type === 2) {
      updatedList = [...primaryDiagnosisList];
      updatedList[index][field] = value;
      setPrimaryDiagnosisList(updatedList);
    } else if (type === 3) {
      updatedList = [...secondaryDiagnosisList];
      updatedList[index][field] = value;
      setSecondaryDiagnosisList(updatedList);
    }
  };

  const handleRemoveDiagnosis = (index, type) => {
    if (type === 1) {
      setProvisionDiagnosisList(
        provisionDiagnosisList.filter((_, i) => i !== index)
      );
    } else if (type === 2) {
      setPrimaryDiagnosisList(
        primaryDiagnosisList.filter((_, i) => i !== index)
      );
    } else if (type === 3) {
      setSecondaryDiagnosisList(
        secondaryDiagnosisList.filter((_, i) => i !== index)
      );
    }
  };
  const handleSubmit = async (values) => {
    const activeTab = activeKey; // Get the active tab key

    const lastUnsavedProvisionDiagnosis = provisionDiagnosisList.filter(
      (diagnosis) => !diagnosis.diagnosisNo
    );

    const lastUnSavedPrimaryDiagnosis = primaryDiagnosisList.filter(
      (diagnosis) => !diagnosis.diagnosisNo
    );
    const lastUnSavedSecondaryDiagnosis = secondaryDiagnosisList.filter(
      (diagnosis) => !diagnosis.diagnosisNo
    );

    let success = true; // Tracks overall success

    try {
      console.log("active tab", activeTab);
      const diagnosisList =
        activeTab === "1"
          ? lastUnsavedProvisionDiagnosis
          : activeTab === "2"
          ? lastUnSavedPrimaryDiagnosis
          : lastUnSavedSecondaryDiagnosis;

      // Process diagnoses based on active tab
      for (let diagnosis of diagnosisList) {
        const diagnosisData = {
          myAction: "create",
          treatmentNo: treatmentNo ?? admissionNo,
          diagnosisType: activeTab,
          diagnosisNo: diagnosis.diagnosisCode,
          confirmed: diagnosis.confirmed,
          remarks: diagnosis.remarks,
        };

        console.log("diagnosisData", diagnosisData);

        const response = await dispatch(postDiagnosisRequest(diagnosisData));

        if (response.status !== "success") {
          success = false;
          message.error(`Error saving diagnosis: ${diagnosis.diagnosisCode}`);
        } else {
          message.success(
            `Diagnosis saved successfully: ${diagnosis.diagnosisCode}`
          );
          // Reset the input field
          setDiagnosisInput("");
          //reset the diagnosis list
          if (activeTab === "1") {
            setProvisionDiagnosisList([]);
          } else if (activeTab === "2") {
            setPrimaryDiagnosisList([]);
          } else if (activeTab === "3") {
            setSecondaryDiagnosisList([]);
          }
        }
      }

      // Final feedback
      if (success) {
        // message.success("All diagnoses saved successfully!");
        dispatch(getDiagnosisLines(treatmentNo ?? admissionNo));
        form.resetFields();
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
      console.error("Error in handleSubmit:", error);
      message.error("An unexpected error occurred. Please try again.");
      setModalContent({
        type: "error",
        title: "Error",
        content: "An unexpected error occurred. Please try again.",
      });
    }

    setIsModalVisible(true); // Show modal after processing
  };

  if (!patientDetails) return <Spin />;

  return (
    <div className="mt-4">
      <Typography.Title
        level={5}
        style={{
          color: "#0F5689",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Diagnosis Lines
      </Typography.Title>

      {(role === "Doctor" ||
        (role === "Psychology" && patientDetails?.Status !== "Completed")) && (
        <Row gutter={24}>
          <Col span={24}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ marginBottom: "4px", float: "right" }}
              onClick={handleHistoryClick}
            >
              Add New Diagnosis
            </Button>
          </Col>
        </Row>
      )}

      <DiagnosisTable treatmentNo={treatmentNo} />

      {/* Show the diagnosis history modal */}
      <Drawer
        title="DIAGNOSTIC FORMULATION"
        visible={historyVisible}
        onCancel={handleClose}
        footer={null}
        width={1000}
        maskClosable={false} // Prevents closing the modal by clicking outside
        style={{ top: 20 }}
      >
        <Tabs key="1" type="card" activeKey={activeKey} onChange={setActiveKey}>
          {/* <TabPane tab="Diagnosis Formulation" key="1">
           <DiagnosisFormulationForm
           form={form}
           editorState={editorState}
           setEditorState={setEditorState}
           onFinish={handleSave}
           />
          </TabPane> */}
          <TabPane tab="Add Provisional Diagnosis" key="1">
            <DiagnosisForm
              diagnosisType={1}
              data={data}
              diagnosisInput={diagnosisInput}
              setDiagnosisInput={setDiagnosisInput}
              diagnosisList={provisionDiagnosisList}
              handleAddDiagnosis={handleAddDiagnosis}
              handleUpdateDiagnosis={handleUpdateDiagnosis}
              handleRemoveDiagnosis={handleRemoveDiagnosis}
              handleSubmit={handleSubmit}
              loading={loading}
              handleClose={() => setHistoryVisible(false)}
            />
          </TabPane>
          <TabPane tab="Add Primary Diagnosis" key="2">
            <DiagnosisForm
              diagnosisType={2}
              data={data}
              diagnosisInput={diagnosisInput}
              setDiagnosisInput={setDiagnosisInput}
              diagnosisList={primaryDiagnosisList}
              handleAddDiagnosis={handleAddDiagnosis}
              handleUpdateDiagnosis={handleUpdateDiagnosis}
              handleRemoveDiagnosis={handleRemoveDiagnosis}
              handleSubmit={handleSubmit}
              loading={loading}
              handleClose={() => setHistoryVisible(false)}
            />
          </TabPane>

          <TabPane tab="Add Secondary Diagnosis" key="3">
            <DiagnosisForm
              diagnosisType={3}
              data={secondaryDiagnosis}
              diagnosisInput={diagnosisInput}
              setDiagnosisInput={setDiagnosisInput}
              diagnosisList={secondaryDiagnosisList}
              handleAddDiagnosis={handleAddDiagnosis}
              handleUpdateDiagnosis={handleUpdateDiagnosis}
              handleRemoveDiagnosis={handleRemoveDiagnosis}
              handleSubmit={handleSubmit}
              loading={loading}
              handleClose={() => setHistoryVisible(false)}
            />
          </TabPane>
        </Tabs>
      </Drawer>
    </div>
  );
};

export default Diagnosis;

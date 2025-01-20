import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import {
  ProfileOutlined,
  EyeOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { postDoctorNotes } from "../../../actions/Doc-actions/postDoctorNotes";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const PsychologyNotes = ({ treatmentNo }) => {
  const { loading } = useSelector((state) => state.postDoctorNotes);
  const docDetails = useAuth();
  const dispatch = useDispatch(); // Get the dispatch function
  const [isFormVisible, setIsFormVisible] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const patientDetails = location.state?.patientDetails || {};
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const role = useAuth().userData.departmentName;
  console.log("patient details", patientDetails.PatientNo);

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = (state) => {
    setEditorState(state);
    form.setFieldValue(
      "content",
      JSON.stringify(convertToRaw(state.getCurrentContent()))
    );
  };

  const handleOnFinish = () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    const doctorNotes = {
      myAction: "create",
      recId: "",
      treatmentNo: treatmentNo,
      patientNo: patientNo, //could'nt get the patientNo from the props
      notesType: form.getFieldValue("notesType"),
      notes: htmlContent, // Corrected the field name for notes
    };

    console.log("doctor content", doctorNotes);

    dispatch(postDoctorNotes(doctorNotes)); // Corrected to dispatch the action
  };

  const handleNavigateReadNotes = () => {
    if (role === "Nurse") {
      navigate(
        `/Nurse/Consultation/Read-Doctor-Dotes?PatientNo=${
          patientDetails?.patientNo || patientDetails?.PatientNo
        }`
      );
    } else {
      navigate(
        `/Doctor/Consultation/Read-Doctor-Dotes?PatientNo=${
          patientDetails?.patientNo || patientDetails?.PatientNo
        }`
      );
    }
  };

  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const notesTypes = [
    { value: "1", label: "Doctor Notes" },
    { value: "2", label: "Medical Report" },
    { value: "3", label: "History" },
    { value: "4", label: "Treatment Plan" },
    { value: "5", label: "Chief Complaints" },
    { value: "6", label: "Past Medical History" },
    { value: "7", label: "Past Surgical History" },
    { value: "8", label: "Social History" },
    { value: "9", label: "Investigations" },
    { value: "10", label: "Assessment and plan" },
    { value: "11", label: "Psychology Notes" },
  ];

  return (
    <div>
      <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "30px",
          position: "relative",
          paddingTop: "20px",
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
        >
          Psychology Notes
        </Typography.Text>
      </Space>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          paddingBottom: "20px",
        }}
      >
        {/* {role === "Doctor" && (
          <Button
            type="primary"
            style={{ width: "100%" }}
            icon={<PlusOutlined />}
            onClick={handleButtonVisibility}
          >
            Add Doctor Notes
          </Button>
        )} */}
        <Button
          type="primary"
          style={{ width: "100%" }}
          icon={<EyeOutlined />}
          onClick={handleNavigateReadNotes}
        >
          Read Past Psychology Notes
        </Button>
      </div>

     {/*  {isFormVisible && (
        <Form
          layout="vertical"
          style={{ paddingTop: "20px" }}
          form={form}
          onFinish={handleOnFinish}
          initialValues={{
            doctorNotesDate: "", // Set current date as the default value
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="doctorNotesDate"
                rules={[{ required: true, message: "Please enter the date!" }]}
                style={{ width: "100%" }}
              >
                <DatePicker
                  // format="YYYY-MM-DD"
                  value={moment().format("YYYY-MM-DD")} // Set the current date
                  style={{ width: "100%" }}
                  // onChange={(date) => handleFieldChange("dueDate", date)}
                  inputReadOnly // Make the input readonly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Notes Type"
                name="notesType"
                rules={[
                  { required: true, message: "Please select Notes Type!" },
                ]}
                style={{ width: "100%" }}
              >
                <Select
                  options={notesTypes}
                  placeholder="Select Notes Type"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="Doctor Notes"
                name="doctorNotes"
                rules={[
                  {
                    required: true,
                    message: "Please enter Doctor Notes!",
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.length > 2000) {
                        return Promise.reject(
                          new Error(
                            "Doctor Notes cannot exceed 2000 characters!"
                          )
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
                    padding: "5px",
                    minHeight: "200px",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Notes
              </Button>
              <Button
                color="danger"
                variant="outlined"
                onClick={() => setIsFormVisible(false)}
              >
                Cancel
              </Button>
            </Space>
            <Form.Item></Form.Item>
          </Form.Item>
        </Form>
      )} */}
    </div>
  );
};

export default PsychologyNotes;

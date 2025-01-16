import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Tabs,
  Row,
  Col,
  Typography,
  Space,
  message,
} from "antd";
import { FiFileText } from "react-icons/fi";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";

const { TabPane } = Tabs;

const PastMedicalHistory = ({ treatmentNo, patientNo }) => {
  const [currentTab, setCurrentTab] = useState("12");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const docDetails = useAuth();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
const{loading}=useSelector((state)=>state.postPatientHistory)
  const notesType = [
    { value: "20", label: "Medical" },
    { value: "21", label: "Surgical" },
    { value: "22", label: "Obstetric" },
    { value: "23", label: "Gynecology" },
  ];

  const handleTabChange = (key) => {
    setCurrentTab(key);
    form.setFieldsValue({
      notesType: notesType.find((note) => note.value === key)?.label,
    });
    setEditorState(EditorState.createEmpty()); // Reset editor state for the new tab
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    form.setFieldValue("notes", state.getCurrentContent().getPlainText());
  };

  const handleSave = () => {
    const plainTextContent = editorState.getCurrentContent().getPlainText();
    form.validateFields().then((values) => {
      const payload = {
        myAction: "create",
        recId: "",
        treatmentNo: treatmentNo,
        patientNo: patientNo,
        notesType: currentTab,
        notes: plainTextContent,
      };
      const success = dispatch(postPatientHistoryNotes(payload));
      if (success) {
        message.success("Notes saved successfully");
      }
    });
  };

  return (
    <div>
      <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingTop: "30px",
          position: "relative",
        }}
      >
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
          <FiFileText style={{ marginRight: "8px" }} />
          Past Medical History
        </Typography.Title>
      </Space>
      <Tabs activeKey={currentTab} onChange={handleTabChange} type="card">
        {notesType.map((note) => (
          <TabPane tab={note.label} key={note.value} />
        ))}
      </Tabs>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          doctorNotesDate: moment().format("Do MMM YYYY"),
          notesType: notesType.find((note) => note.value === currentTab)?.label,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="doctorNotesDate" label="Date">
              <Input
                disabled
                value={moment().format("Do MMM YYYY")}
                style={{ color: "#0f5689" }}
              />
            </Form.Item>
          </Col>
          {/* <Col span={8}>
            <Form.Item name="Doctor" label="Doctor">
              <Input
                disabled
                value={
                  docDetails.userData.SearchName || docDetails.userData.No ||
                  `${docDetails.userData.FirstName} ${docDetails.userData.LastName}`
                }
              />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item name="notesType" label="Notes Type">
              <Input
                disabled
                style={{ fontWeight: "medium", color: "#0f5689" }}
              />
            </Form.Item>
          </Col>
        </Row>
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
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form>
    </div>
  );
};

export default PastMedicalHistory;

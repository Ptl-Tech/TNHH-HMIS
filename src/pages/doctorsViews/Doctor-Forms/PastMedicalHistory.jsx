import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, Button, Tabs, Space, Typography, message } from "antd";
import { FiFileText } from "react-icons/fi";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";

const { TabPane } = Tabs;
const { TextArea } = Input;

const PastMedicalHistory = ({ treatmentNo, patientNo }) => {
  const [currentTab, setCurrentTab] = useState("20");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const docDetails = useAuth();

  const { data } = useSelector((state) => state.getPatientHistoryNotesReducer);
  const { loading } = useSelector((state) => state.postPatientHistory);

  const notesType = [
    { value: "20", label: "Medical" },
    { value: "21", label: "Surgical" },
    { value: "23", label: "Gynecology" },
  ];

  useEffect(() => {
    if (treatmentNo) {
      dispatch(getPatientHistorySlice(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  const initialValues = useMemo(() => {
    return {
      "20": data.find((item) => item.Notes_Type === "Medical")?.Notes || "",
      "21": data.find((item) => item.Notes_Type === "Surgical")?.Notes || "",
      "23": data.find((item) => item.Notes_Type === "Gynecology")?.Notes || "",
    };
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({
      notes: initialValues[currentTab] || "",
    });
  }, [currentTab, initialValues, form]);

  const handleTabChange = (key) => {
    setCurrentTab(key);
  };

  const handleNext = () => {
    const currentIndex = notesType.findIndex((note) => note.value === currentTab);
    const nextIndex = (currentIndex + 1) % notesType.length;
    setCurrentTab(notesType[nextIndex].value);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        myAction: "create",
        recId: "",
        treatmentNo,
        patientNo,
        notesType: currentTab,
        notes: values.notes,
      };
       dispatch(postPatientHistoryNotes(payload));
      message.success("Notes saved successfully");
    } catch (error) {
      message.error("Failed to save notes");
    }
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
        }}
      >
        <Form.Item
          name="notes"
          label={notesType.find((note) => note.value === currentTab)?.label}
          rules={[{ message: "Please enter notes" }]}
        >
          <TextArea placeholder="Enter notes..." autoSize={{ minRows: 3 }} />
        </Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
          <Button type="default" onClick={handleNext}>
            Next
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default PastMedicalHistory;

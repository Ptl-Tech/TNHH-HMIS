import React, { useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  Button,
  Tabs,
  Space,
  Typography,
  message,
  Spin,
} from "antd";
import { FiFileText } from "react-icons/fi";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";
import AetiologyTable from "../tables/AetiologyTable";
import { useLocation } from "react-router-dom";

const { TabPane } = Tabs;
const { TextArea } = Input;

const FourPsForm = ({ treatmentNo, patientNo }) => {
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const [currentTab, setCurrentTab] = useState("12");
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const role = useAuth().userData.departmentName;

  const { loading:loadingHistory, data } = useSelector((state) => state.getPatientHistoryNotesReducer);
  const { loading } = useSelector((state) => state.postPatientHistory);

  const notesType = [
    { value: "12", label: "Predisposing Factors" },
    { value: "13", label: "Precipitating Factors" },
    { value: "14", label: "Perpetuating Factors" },
    { value: "15", label: "Protective Factors" },
  ];

  useEffect(() => {
    if (treatmentNo) {
      dispatch(getPatientHistorySlice(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  const initialValues = useMemo(() => {
    return {
      12:
        data.find((item) => item.Notes_Type === "Predisposing Factors")
          ?.Notes || "",
      13:
        data.find((item) => item.Notes_Type === "Precipitating Factors")
          ?.Notes || "",
      14:
        data.find((item) => item.Notes_Type === "Perpetuating Factors")
          ?.Notes || "",
      15:
        data.find((item) => item.Notes_Type === "Protective Factors")?.Notes ||
        "",
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
      await dispatch(postPatientHistoryNotes(payload));
      message.success("Notes saved successfully");
      dispatch(getPatientHistorySlice(treatmentNo));
    } catch (error) {
      message.error("Failed to save notes");
    }
  };

  if (!patientDetails) return <Spin />;

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
          Aetiology Notes
        </Typography.Title>
      </Space>
      {(role === "Doctor" || role === "Psychology") &&
        patientDetails?.Status !== "Completed" && (
        <>
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
              rules={[{ required: true, message: "Please enter notes" }]}
            >
              <TextArea
                placeholder="Enter notes..."
                autoSize={{ minRows: 3 }}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form>
        </>
      )}

      <AetiologyTable data={data} loadingHistory={loadingHistory}/>
    </div>
  );
};

export default FourPsForm;

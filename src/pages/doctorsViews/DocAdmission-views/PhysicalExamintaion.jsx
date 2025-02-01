import { useEffect, useMemo, useState } from "react";
import { Form, Input, Button, Tabs, Space, Typography, message } from "antd";
import { FiFileText } from "react-icons/fi";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { postPatientHistoryNotes } from "../../../actions/Doc-actions/posPatientHistoryNotes";
import { getPatientHistorySlice } from "../../../actions/Doc-actions/getPatientHistoryNotes";
import PhysicalExaminationTable from "../tables/Diagnosis/PhysicalExaminationTable";
import PropTypes from "prop-types";

const { TabPane } = Tabs;
const { TextArea } = Input;

const PhysicalExamination = ({ treatmentNo, patientNo }) => {
  const role = useAuth().userData.departmentName;
  const [currentTab, setCurrentTab] = useState("16");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data } = useSelector((state) => state.getPatientHistoryNotesReducer);
  const { loading } = useSelector((state) => state.postPatientHistory);

  const notesType = [
    { value: "16", label: "Central Nervous system" },
    { value: "17", label: "Cardiovascular system" },
    { value: "18", label: "Respiratory system" },
    { value: "19", label: "Per Abdomen" },
  ];

  useEffect(() => {
    if (treatmentNo) {
      dispatch(getPatientHistorySlice(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  const initialValues = useMemo(() => {
    return {
      16:
        data.find((item) => item.Notes_Type === "Central Nervous system")
          ?.Notes || "",
      17:
        data.find((item) => item.Notes_Type === "Cardiovascular system")
          ?.Notes || "",
      18:
        data.find((item) => item.Notes_Type === "Respiratory system")?.Notes ||
        "",
      19: data.find((item) => item.Notes_Type === "Abdomen")?.Notes || "",
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
      message.error(error.message || "Failed to save notes");
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
          Physical Examination
        </Typography.Title>
      </Space>
      {(role === "Doctor" ||
        role === "Psychology") && (
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
                label={
                  notesType.find((note) => note.value === currentTab)?.label
                }
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

      <PhysicalExaminationTable data={data} />
    </div>
  );
};

export default PhysicalExamination;

// props validation
PhysicalExamination.propTypes = {
  treatmentNo: PropTypes.string,
  patientNo: PropTypes.string,
};

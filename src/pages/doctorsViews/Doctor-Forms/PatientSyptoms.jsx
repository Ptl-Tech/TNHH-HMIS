import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Table,
  Modal,
  Popconfirm,
  Typography,
  Col,
  Row,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined, SaveOutlined, FileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSymptomsRequest } from "../../../actions/Doc-actions/qySymptomsSetup";
import { getHMSsetup } from "../../../actions/Doc-actions/qyHMSSystems";
import { postSymptomsRequest } from "../../../actions/Doc-actions/postSyptoms";
import { IoListOutline } from "react-icons/io5";
import { getPatientSyptomLines } from "../../../actions/Doc-actions/getPatientSyptomLines";
import Loading from "../../../partials/nurse-partials/Loading";

const PatientSymptoms = ({ treatmentNo }) => {
      const [showForm, setShowForm] = useState(false); // Toggle between table and form
    
  const [form] = Form.useForm();
  const [isSymptomsModalVisible, setIsSymptomsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const { loading: systemLoading, data: system = [] } = useSelector(
    (state) => state.getHMSsetup
  );
  const { loading: symptomLoading, data: symptoms = [] } = useSelector(
    (state) => state.getSymptoms
  );
  const { loading: symptomLinesLoading, data: symptomsLines = [] } = useSelector(
    (state) => state.getPatientSyptoms
  );
  const {
    loading: postsymptomLoading,
    success: postsymptomSuccess,
    error: postsymptomError,
  } = useSelector((state) => state.saveSyptoms);

  useEffect(() => {
    dispatch(getSymptomsRequest());
    dispatch(getHMSsetup());
  }, [dispatch]);

  useEffect(() => {
    if (postsymptomSuccess) {
      form.resetFields();
      setIsSymptomsModalVisible(false);
    }
  }, [postsymptomSuccess, form]);

  useEffect(() => {
    dispatch(getPatientSyptomLines());
  }, [dispatch]);


  const handleAddSymptom = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        treatmentNo: treatmentNo,
        myAction: "create",
      };
      dispatch(postSymptomsRequest(data));
    } catch (error) {
      // Form validation errors are handled automatically by Ant Design.
    }
  };

  const deleteItem = (key) => {
    // Implement the delete logic if needed
    console.log("Delete item with key:", key);
  };
  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const columnsSymptoms = [
    { title: "Treatment No", dataIndex: "TreatmentNo", key: "TreatmentNo" },
    { title: "System", dataIndex: "System", key: "System" },
    { title: "Symptom Code", dataIndex: "SymptomCode", key: "SymptomCode" },
    { title: "Description", dataIndex: "Description", key: "Description" },
    { title: "Duration", dataIndex: "Duration", key: "Duration" },
    {
      title: "Characteristics",
      dataIndex: "Characteristics",
      key: "Characteristics",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => viewItem(record.key)}
            style={{ marginRight: "8px" }}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => editItem(record.key)}
            style={{ marginRight: "8px" }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => deleteItem(record.key)}
            danger
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

const DataSource = Array.isArray(symptomsLines)
? symptomsLines.filter((item) => item.TreatmentNo === treatmentNo) // Filter by TreatmentNo
: Object.keys(symptomsLines)
    .filter((key) => symptomsLines[key].TreatmentNo === treatmentNo) // Filter based on TreatmentNo
    .map((key) => ({
      ...symptomsLines[key],
      TreatmentNo: key,
    }));
  return (
    <div className="mt-4">
      <Typography.Text
      className="my-4"
        style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
      >
        <FileOutlined />
        Patient Symptoms
      </Typography.Text>
     
{
    symptomLinesLoading ? (
     <Loading/>
    ) : (
<>
{!showForm ? (
        <>
        <div className="d-flex justify-content-end my-2">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleToggleForm}

          style={{
            backgroundColor: "#0f5689",
            borderColor: "#0f5689",
            width: "100%",
            maxWidth: "200px",
          }}
        >
          Add Symptom
        </Button>
        </div>
        <Table columns={columnsSymptoms} dataSource={DataSource}  pagination={{
                  position: ["bottom", "right"],
                  showSizeChanger: true,
                  pageSize: 10,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
       />
        
        </>
      ) : (
        <>
         <Form layout="vertical" form={form} className="mt-4">
        <Row gutter={16}>
            <Col span={12}>
            <Form.Item
            label="System"
            name="system"
            rules={[{ required: true, message: "Please select a system" }]}
          >
            <Select placeholder="Select System" loading={systemLoading}>
              {system.map((sys) => (
                <Select.Option key={sys.Code} value={sys.Code}>
                  {sys.Description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item
            label="Symptom"
            name="symptomCode"
            rules={[{ required: true, message: "Please select a symptom" }]}
          >
            <Select placeholder="Select Symptom" loading={symptomLoading}>
              {symptoms.map((symptom) => (
                <Select.Option
                  key={symptom.SymptomCode}
                  value={symptom.SymptomCode}
                >
                  {symptom.SymptomName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Please enter a duration" }]}
          >
            <Input />
          </Form.Item>
          </Col>
         
          <Col span={12}>
          <Form.Item
            label="Characteristics"
            name="characteristics"
            rules={[
              { required: true, message: "Please enter characteristics" },
            ]}
          >
            <Input />
          </Form.Item>
          </Col>
          <Col span={12}>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea />
          </Form.Item>
          </Col>
            </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item style={{width:"100%"}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={handleAddSymptom}
                  style={{ backgroundColor: "#0f5689", borderColor: "#0f5689", width:"100%" }}
                >
                    <PlusOutlined />
                  Add Symptom
                </Button>
              </Form.Item>
              </Col>
              
              <Col span={12}>
              <Form.Item style={{width:"100%"}}>
                <Button
                  type="primary"
                  onClick={handleToggleForm}
                  style={{ backgroundColor: "#0f5689", borderColor: "#0f5689", width:"100%" }}
                >
                  <IoListOutline />
                  View Symptoms
                </Button>
              </Form.Item>
              </Col>
          </Row>
        </Form>
        </>
      )}
</>    )
}
     
    </div>
  );
};

export default PatientSymptoms;

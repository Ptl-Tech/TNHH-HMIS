import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  Table,
  Form,
  Input,
  Popconfirm,
  message,
  Typography,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined, EditOutlined, FileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSignsSetup } from "../../../actions/Doc-actions/qySignsSetup";
import { getHMSsetup } from "../../../actions/Doc-actions/qyHMSSystems";
import { postSignsRequest } from "../../../actions/Doc-actions/postSigns";
import { getPatientSignsLines } from "../../../actions/Doc-actions/getPatientSignsLines";
import Loading from "../../../partials/nurse-partials/Loading";
import { IoListOutline } from "react-icons/io5";

const PatientSigns = ({ treatmentNo }) => {
  const [editingRecord, setEditingRecord] = useState(null); // Store the record being edited
  const [showForm, setShowForm] = useState(false); // Toggle between table and form
  
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const { loading: systemLoading, data: system = [] } = useSelector(
    (state) => state.getHMSsetup
  );
  const { loading: signsLoading, data: signs = [] } = useSelector(
    (state) => state.getSignsSetup
  );
  const { loading: postsignsLoading, success: postsignsSuccess } = useSelector(
    (state) => state.saveSigns
  );

  const { loading: patientSignsLinesLoading, data: patientSignsLines = [] } =
    useSelector((state) => state.getPatientsSigns);

  useEffect(() => {
    dispatch(getSignsSetup());
    dispatch(getHMSsetup());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPatientSignsLines());
  }, [dispatch]);

  useEffect(() => {
    if (postsignsSuccess) {
      form.resetFields();
      setEditingRecord(null); // Reset editing record after success
    } else {
      form.resetFields();
      setEditingRecord(null);
    }
  }, [postsignsSuccess, form]);

  const handleFinish = (values) => {
    const data = {
      ...values,
      treatmentNo: treatmentNo,
      myAction: editingRecord ? "edit" : "create", // Handle create or update
      treatmentNo: editingRecord ? editingRecord.TreatmentNo : treatmentNo,
    };

    // Dispatch postSignsRequest for both create and update
    dispatch(postSignsRequest(data)).then((data) => {
      if (postsignsSuccess) {
        dispatch(getPatientSignsLines()); // Reload data after successful request
        form.resetFields(); // Reset the form fields
        setEditingRecord(null);
      } else {
        message.error("An error occurred, please try again");
      }
    });
  };

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const columnsSigns = [
    { title: "System", dataIndex: "System", key: "System" },
    { title: "Sign", dataIndex: "SignCode", key: "SignCode" },
    {
      title: "Description",
      dataIndex: "SignDescription",
      key: "SignDescription",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => console.log(`Delete: ${record.key}`)}
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)} // Trigger edit when clicked
          />
        </>
      ),
    },
  ];

  const DataSource = Array.isArray(patientSignsLines)
    ? patientSignsLines.filter((item) => item.TreatmentNo === treatmentNo) // Filter by TreatmentNo
    : Object.keys(patientSignsLines)
        .filter((key) => patientSignsLines[key].TreatmentNo === treatmentNo) // Filter based on TreatmentNo
        .map((key) => ({
          ...patientSignsLines[key],
          TreatmentNo: key,
        }));

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      system: record.System,
      signNo: record.SignCode,
      description: record.SignDescription,
    });
  };

  return (
    <div className="mt-4">
      <Typography.Text
        style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
      >
        <FileOutlined />
        Patient Signs
      </Typography.Text>
      {patientSignsLinesLoading ? (
        <Loading />
      ) : (
        <>
          {!showForm ? (
            <>
              <Table dataSource={DataSource} columns={columnsSigns} />
              <Button
                onClick={handleToggleForm}
                style={{ marginRight: "10px" }}
                type="primary"
                icon={<PlusOutlined />}
              >
                Add Sign
              </Button>
            </>
          ) : (
            <>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
                initialValues={{
                  system: "",
                  signNo: "",
                  description: "",
                }}
              >
              <Row gutter={16}>
                  <Col span={12}>
                  <Form.Item
                  label="System"
                  name="system"
                  rules={[{ required: true, message: "Please select a system" }]}
                >
                  <Select
                    placeholder="Select System"
                    loading={systemLoading}
                    allowClear
                  >
                    {system.map((sys) => (
                      <Select.Option key={sys.SignCode} value={sys.SignCode}>
                        {sys.SignsName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                  </Col>
                
                  <Col span={12}>
                  <Form.Item
                  label="Sign"
                  name="signNo"
                  rules={[{ required: true, message: "Please select a sign" }]}
                >
                  <Select
                    placeholder="Select Sign"
                    loading={signsLoading}
                    allowClear
                  >
                    {signs.map((sign) => (
                      <Select.Option key={sign.SignCode} value={sign.SignCode}>
                        {sign.SignsName}
                      </Select.Option>
                    ))}
                  </Select>
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
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                        <SaveOutlined />
Save
                    </Button>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item>
                    <Button onClick={handleToggleForm} type="primary">
                        <IoListOutline />
                        View Patient Signs
                    </Button>
                  </Form.Item>
                </Col>
               </Row>
              </Form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PatientSigns;

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
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  EditOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getSignsSetup } from "../../../actions/Doc-actions/qySignsSetup";
import { postSignsRequest } from "../../../actions/Doc-actions/postSigns";
import { getPatientSignsLines } from "../../../actions/Doc-actions/getPatientSignsLines";
import Loading from "../../../partials/nurse-partials/Loading";
import { IoListOutline } from "react-icons/io5";
import { render } from "react-dom";

const PatientSigns = ({ treatmentNo }) => {
  const [editingRecord, setEditingRecord] = useState(null); // Store the record being edited
  const [showForm, setShowForm] = useState(false); // Toggle between table and form
  const [selectedSignSystem, setSelectedSignSystem] = useState(""); // Store the selected sign system

  const [form] = Form.useForm();
  const dispatch = useDispatch();

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
    // Find the selected sign's system value from the signs data
    const selectedSign = signs.find((sign) => sign.SignCode === values.signNo);

    // Ensure the sign and system are found before proceeding
    if (!selectedSign) {
      message.error("Selected sign not found.");
      return;
    }

    const data = {
      ...values,
      system: selectedSign.System, // Add the system value from the selected sign
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
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "#0f5689" }}>{text}</span>
      ),
    },
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
        <div className="d-block d-md-flex justify-content-center align-items-center gap-3">
          <Button
            type="primary"
            icon={<EditOutlined />}
            title="Edit"
            onClick={() => handleEdit(record)} // Trigger edit when clicked
          >
            Edit
          </Button>
          <Button
            type="primary"
            icon={<FileOutlined />}
            title="View"
            onClick={() => console.log(`View: ${record.key}`)}
            ghost
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => console.log(`Delete: ${record.key}`)}
          >
            <Button type="primary" icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
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
    // Set the system value when editing
    setSelectedSignSystem(record.System);
  };

  const handleSignChange = (value) => {
    // Find the sign in signs setup and set the system value
    const selectedSign = signs.find((sign) => sign.SignCode === value);
    if (selectedSign) {
      setSelectedSignSystem(selectedSign.System);
    }
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
              <div className="d-flex justify-content-end my-2">
              <Button
                    onClick={handleToggleForm}
                    style={{ marginRight: "10px", justifyContent: "end" }}
                    type="primary"
                    icon={<PlusOutlined />}
                  >
                    Add Sign
                  </Button>
              </div>
              <Table
                dataSource={DataSource}
                columns={columnsSigns}
                pagination={{
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
              <Form
                layout="vertical"
                form={form}
                onFinish={handleFinish}
                initialValues={{
                  system: selectedSignSystem, // Use the selected system value
                  signNo: "",
                  description: "",
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Sign"
                      name="signNo"
                      rules={[
                        { required: true, message: "Please select a sign" },
                      ]}
                    >
                      <Select
                        placeholder="Select Sign"
                        loading={signsLoading}
                        allowClear
                        onChange={handleSignChange} // Trigger system value update on sign change
                      >
                        {signs.map((sign) => (
                          <Select.Option
                            key={sign.SignCode}
                            value={sign.SignCode}
                          >
                            {sign.SignsName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[
                        {
                          required: true,
                          message: "Please enter a description",
                        },
                      ]}
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

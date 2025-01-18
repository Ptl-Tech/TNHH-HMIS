import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Button,
  Typography,
  Select,
  Table,
  message,
  Popconfirm,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLabRequestSetup } from "../../../actions/Doc-actions/qyLabTestsSetup";
import { postLabRequest } from "../../../actions/Doc-actions/postLabRequest";
import {
  getPatientLabTest,
  requestLabTest,
} from "../../../actions/Doc-actions/requestLabTest";
import { useLocation } from "react-router-dom";
import moment from "moment";
import {
  FileTextOutlined,
  SaveOutlined,
  FileOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const LabResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false); // Toggle between table and form

  const { data: labTestSetupData } = useSelector(
    (state) => state.getlabRequestSetup
  );
  const { loading: loadingLabRequestPost } = useSelector(
    (state) => state.postLabRequest
  );
  const { data: patientLabTest } = useSelector((state) => state.patientLabTest);
  const { loading: loadingLabRequest } = useSelector(
    (state) => state.requestLabTest
  );
  const [labRequest, setLabRequest] = useState({
    myAction: "create",
    treatmentNo,
    testPackageCode: "",
    dueDate: "",
  });

  useEffect(() => {
    dispatch(getLabRequestSetup());
    dispatch(getPatientLabTest());
  }, [dispatch]);

  const handleLabRequest = () => {
    dispatch(requestLabTest(treatmentNo));
  };

  const handleFieldChange = (field, value) => {
    setLabRequest((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    dispatch(postLabRequest(labRequest)).then((data) => {
      if (data.status === "success") message.success(data.status);
    });
  };

  const columns = [
    {
      title: "Test Package",
      dataIndex: "LaboratoryTestPackageCode",
      key: "LaboratoryTestPackageCode",
      render: (text) => 
        {
          return (
            <Button type="link">
              {text}
            </Button>
          );
        },
    },
    {
      title: "Test Name",
      dataIndex: "LaboratoryTestPackageName",
      key: "LaboratoryTestPackageName",
    },

    { title: "Due Date", dataIndex: "DateDue", key: "DateDue" },
    { title: "Results", dataIndex: "Results", key: "Results" },
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
            <Button type="default" icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const dataSource = Array.isArray(patientLabTest)
    ? patientLabTest.filter((item) => item.TreatmentNo === treatmentNo)
    : [];

  return (
    <div>
      <Typography.Title
        level={5}
        style={{ color: "#0F5689", marginBottom: "12px" }}
      >
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Laboratory Request 
      </Typography.Title>

      <div className="d-flex justify-content-end my-2">
        <Button
          type="primary"
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
        >
          {!showForm ? " New Request" : "View History"}
        </Button>
      </div>

      {!showForm ? (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            position: ["bottom", "right"],
            showSizeChanger: true,
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      ) : (
        <Form layout="vertical" autoComplete="off">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true }]}
                style={{ width: "100%" }}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  value={moment()} // Set the current date
                  style={{ width: "100%" }}
                  onChange={(date) => handleFieldChange("dueDate", date)}
                  inputReadOnly // Make the input readonly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="testPackageCode"
                label="Test Package Code"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Test Package Code"
                  onChange={(value) =>
                    handleFieldChange("testPackageCode", value)
                  }
                >
                  {labTestSetupData?.map((item) => (
                    <Option key={item.Code} value={item.Code}>
                      {item.Description}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="my-2">
            <Button
              type="primary"
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                marginRight: "16px",
                float: "right",
                width: "150px",
              }}
              icon={<FileTextOutlined />}
              onClick={handleLabRequest}
              loading={loadingLabRequest}
              disabled={loadingLabRequestPost}
            >
              Request Test
            </Button>
            <Button
              type="primary"
              style={{
                marginTop: "16px",
                marginBottom: "16px",
                marginRight: "16px",
                float: "right",
                width: "150px",
              }}
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={loadingLabRequestPost}
            >
              {labRequest.myAction === "create"
                ? "Add Lab Request"
                : "Update Lab Request"}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default LabResults;

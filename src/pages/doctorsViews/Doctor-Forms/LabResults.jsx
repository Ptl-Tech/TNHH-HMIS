import {
  Form,
  Input,
  DatePicker,
  Row,
  Col,
  Button,
  Typography,
  Select,
  Modal,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLabRequestSetup } from "../../../actions/Doc-actions/qyLabTestsSetup";
import { postLabRequest } from "../../../actions/Doc-actions/postLabRequest";
import { getPatientLabTest, requestLabTest } from "../../../actions/Doc-actions/requestLabTest";
import { useLocation } from "react-router-dom";
import moment from "moment";
import {
  FileSearchOutlined,
  SaveOutlined,
  EyeOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const LabResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getlabRequestSetup);
  const { loading: loadingLabRequestPost } = useSelector((state) => state.postLabRequest);
  const { loading: loadingLabRequest } = useSelector(
    (state) => state.requestLabTest
  );
  const { data: patientLabTest } = useSelector((state) => state.patientLabTest);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [labRequest, setLabRequest] = useState({
    myAction: "create",
    treatmentNo,
    lineNo: 0,
    testPackageCode: "",
    dueDate: "",
    results: "",
    description: "",
    characteristics: "",
  });

  useEffect(() => {
    dispatch(getLabRequestSetup());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPatientLabTest());

  }, [dispatch]);

  const handleDateChange = (date, dateString) => {
    setLabRequest((prev) => ({
      ...prev,
      dueDate: dateString,
    }));
  };

  const handleFieldChange = (field, value) => {
    setLabRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleModalVisible = () => {
    setIsModalVisible(true);
  };
  const handleLabRequest = () => {
    dispatch(requestLabTest(treatmentNo));
 };

  const handleSave = () => {
    const action = labRequest.myAction === "create" ? "Create" : "Edit";
    dispatch(postLabRequest(labRequest));
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "DateTaken",
      key: "DateTaken",
    },
    {
      title: "Test Package",
      dataIndex: "LaboratoryTestPackageName",
      key: "LaboratoryTestPackageName",
    },
    {
      title: "Results",
      dataIndex: "Results",
      key: "Results",
    },

    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];
  const DataSource = Array.isArray(patientLabTest)
  ? patientLabTest.filter(item => item.TreatmentNo === treatmentNo) // Filter by TreatmentNo
  : Object.keys(patientLabTest)
      .filter((TreatmentNo) => patientLabTest[TreatmentNo].TreatmentNo === treatmentNo) // Filter based on TreatmentNo
      .map((TreatmentNo) => ({
        ...patientLabTest[TreatmentNo],
        TreatmentNo,
      }));



  return (
    <div>
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
        <FileTextOutlined style={{ marginRight: "8px" }} />
        Laboratory Request
      </Typography.Title>
      <div className="d-flex justify-content-end my-2">
        <Button
          type="dashed"
          style={{ marginRight: "10px" }}
          icon={<EyeOutlined />}
          onClick={handleModalVisible}
        >
          View Results
        </Button>
        <Button
          type="dashed"
          style={{ marginRight: "10px" }}
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={loadingLabRequestPost}
        >
          View History
        </Button>
      </div>
      <Form
        layout="vertical"
        initialValues={{
          treatmentNo: treatmentNo || "",
          testPackageCode: labRequest.testPackageCode || "",
        }}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="treatmentNo"
              label="Treatment Number"
              rules={[{ required: true }]}
            >
              <Input
                value={labRequest.treatmentNo}
                disabled
                placeholder="Treatment Number"
                style={{ width: "100%", color: "green", fontWeight: "bold" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="testPackageCode"
              label="Test Package Code"
              rules={[
                { required: true, message: "Please Select Test Package Code!" },
              ]}
              hasFeedback
            >
              <Select
                value={labRequest.testPackageCode}
                placeholder="Select Test Package Code"
                onChange={(value) =>
                  handleFieldChange("testPackageCode", value)
                }
                icon={<FileSearchOutlined />}
              >
                {data?.map((item) => (
                  <Option key={item.Code} value={item.Code}>
                    {item.Description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true }]}
            >
              <DatePicker
                placeholder="Select Due Date"
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                onChange={handleDateChange}
                value={
                  labRequest.dueDate
                    ? moment(labRequest.dueDate, "YYYY-MM-DD")
                    : null
                }
                icon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

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

      <Modal
        title="Lab Results"
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={DataSource}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default LabResults;

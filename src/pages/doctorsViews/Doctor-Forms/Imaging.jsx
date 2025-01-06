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
} from "antd";
import moment from "moment"; // Import moment to handle date formatting
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SendOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SaveOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { getRadiologySetup } from "../../../actions/Doc-actions/qyRadiologyTestSetups";
import { postRadiologyRequest } from "../../../actions/Doc-actions/postRadiolgyRequest";
import {
  getPatientRadiologyTest,
  requestRadiologyTest,
} from "../../../actions/Doc-actions/requestRadiologyTest";

const { Option } = Select;

const Imaging = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(true); // Toggle between table and form

  const { data: radiologySetupData } = useSelector(
    (state) => state.getRadiologySetup
  );
  const { loading: savingRequest } = useSelector(
    (state) => state.postRadiologyRequest
  );
  const { loading: requestingTest } = useSelector(
    (state) => state.requestRadiologyTest
  );
  const { data: radiologyData } = useSelector(
    (state) => state.patientRadiologyTest
  );

  useEffect(() => {
    dispatch(getRadiologySetup());
    if (treatmentNo) {
      dispatch(getPatientRadiologyTest(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

  const handleSave = (values) => {
    const { testPackageCode, dueDate, treatmentNo: formTreatmentNo } = values;

    if (!testPackageCode || !dueDate) {
      console.error("Missing required fields:", { testPackageCode, dueDate });
      return;
    }

    const formattedDueDate = {
      year: dueDate.year(),
      month: dueDate.month() + 1, // Moment months are 0-indexed
      day: dueDate.date(),
    };

    const radiologyRequest = {
      myAction: "create",
      treatmentNo: treatmentNo || formTreatmentNo,
      testPackageCode,
      dueDate: formattedDueDate,
    };

    console.log("Submitting radiologyRequest:", radiologyRequest);
    dispatch(postRadiologyRequest(radiologyRequest));
  };

  const handleRadiologyRequest = () => {
    dispatch(requestRadiologyTest(treatmentNo));
  };

  const columns = [
    {
      title: "Test Package",
      dataIndex: "RadiologyTypeCode",
      key: "RadiologyTypeCode",
render: (text) => 
        {
          return (
            <Button type="link">
              {text}
            </Button>
          );
        },    },
    {
      title: "Radiology Test Name",
      dataIndex: "RadiologyTypeName",
      key: "RequiredInvestigation",
    },
    { title: "Date", dataIndex: "DateDue", key: "DateDue" },
    
    { title: "Status", dataIndex: "Status", key: "Status", align: "center" , render: (text) => <span style={{ color: text === "Completed" ? "green" : "red" }}>{text}</span>},
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="link" onClick={() => handleRadiologyRequest(record)}>
          Request
        </Button>
      ),
    }
  ];

  const DataSource =[
    {
      key: 1,
    
      RadiologyTypeCode: radiologyData.RadiologyTypeCode,
      RadiologyTypeName: radiologyData.RadiologyTypeName,
      DateDue: radiologyData.DateDue,
      Status: radiologyData.Status
    }
  ]
   

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
        Radiology Request
      </Typography.Title>

      <div className="d-flex justify-content-end my-2">
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => setShowForm(!showForm)}
          icon={showForm ? <FileSearchOutlined /> : <EyeOutlined />}
        >
          {showForm ?  "New Request":"View Results" }
        </Button>
      </div>

      {showForm ? (
                <Table dataSource={DataSource} columns={columns} rowKey="id" />
      
      ) : (
        <Form
        layout="vertical"
        initialValues={{
          treatmentNo: treatmentNo || "",
          testPackageCode: "",
          dueDate: moment(),
        }}
        autoComplete="off"
        onFinish={handleSave}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="treatmentNo"
              label="Treatment Number"
              rules={[
                {
                  required: true,
                  message: "Please enter the treatment number.",
                },
              ]}
            >
              <Input
                placeholder="Treatment Number"
                style={{ width: "100%", color: "green", fontWeight: "bold" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[
                { required: true, message: "Please select a due date!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
         
        </Row>

        <Row gutter={24}>
           <Col span={12}>
            <Form.Item
              name="testPackageCode"
              label="Radiology Code"
              rules={[
                {
                  required: true,
                  message: "Please select a radiology code.",
                },
              ]}
            >
              <Select placeholder="Select Radiology Code">
                {radiologySetupData?.map((item) => (
                  <Option key={item.Code} value={item.Code}>
                    {item.Description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="HospitalPartners"
              label="Hospital Partners"
              rules={[
                {
                  required: true,
                  message: "Please select Hospital Partner.",
                },
              ]}
            >
              <Select placeholder="Select Hospital Partners">
                <Select.Option value="Option 1">Option 1</Select.Option>
                <Select.Option value="Option 2">Option 2</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="my-2">
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={handleRadiologyRequest}
            loading={requestingTest}
            style={{ marginRight: "16px", width: "150px" }}
          >
            Request Test
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={savingRequest}
            style={{ width: "150px" }}
          >
            Send to Lab
          </Button>
        </div>
      </Form>
      )}
    </div>
  );
};

export default Imaging;

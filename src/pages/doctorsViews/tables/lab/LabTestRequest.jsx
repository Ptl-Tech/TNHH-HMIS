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
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { postLabRequest } from "../../../../actions/Doc-actions/postLabRequest";
  import { getPatientLabTest,requestLabTest } from "../../../../actions/Doc-actions/requestLabTest";
  import { useLocation } from "react-router-dom";
  import moment from "moment";
  import { FileTextOutlined, SaveOutlined, CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import { getLabRequestSetup } from "../../../../actions/Doc-actions/qyLabTestsSetup";
import TextArea from "antd/es/input/TextArea";
  
  const { Option } = Select;
  
  const LabTestRequest = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const treatmentNo = queryParams.get("TreatmentNo");
  
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false); // Toggle between table and form
  
    const { data: labTestSetupData } = useSelector((state) => state.getlabRequestSetup);
    const { loading: loadingLabRequestPost } = useSelector((state) => state.postLabRequest);
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
  
    const handleDateChange = (date, dateString) => {
      setLabRequest((prev) => ({ ...prev, dueDate: dateString }));
    };
    const handleLabRequest = () => {
      dispatch(requestLabTest(treatmentNo));
  
   };
  
    const handleFieldChange = (field, value) => {
      setLabRequest((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleSave = () => {
      dispatch(postLabRequest(labRequest)).then((data) => {
        if(data.status==='success') message.success(data.status);
      });
    };
  
    const columns = [
      { title: "Date", dataIndex: "DateTaken", key: "DateTaken" },
      { title: "Test Package", dataIndex: "LaboratoryTestPackageName", key: "LaboratoryTestPackageName" },
      { title: "Results", dataIndex: "Results", key: "Results" },
      { title: "Status", dataIndex: "Status", key: "Status" },
    ];
  
    const dataSource = Array.isArray(patientLabTest)
      ? patientLabTest.filter((item) => item.TreatmentNo === treatmentNo)
      : [];
  
    return (
      <div>
        <Typography.Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
          <FileTextOutlined style={{ marginRight: "8px" }} />
          Laboratory Request
        </Typography.Title>
  
        <div className="d-flex justify-content-end my-2">
          <Button
            type="primary"
            onClick={() => setShowForm(!showForm)}
            icon={showForm ? <FileTextOutlined /> : <PlusOutlined />}
          >
            {!showForm ? " New Request": "View History" }
          </Button>
        </div>
  
        {!showForm ? (
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        ) : (
          <Form layout="vertical" autoComplete="off">
            <Row gutter={24}>
            <Col span={12}>
                <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]} style={{ width: "100%" }}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    onChange={handleDateChange}
                    value={labRequest.dueDate ? moment(labRequest.dueDate, "YYYY-MM-DD") : null}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="testPackageCode" label="Test Package Code" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Test Package Code"
                    onChange={(value) => handleFieldChange("testPackageCode", value)}
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

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="requiredInvestigation" label="Required Investigation" rules={[{ required: true }]}>
                  <TextArea
                    value={labRequest.requiredInvestigation}
                    onChange={(e) => handleFieldChange("requiredInvestigation", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="briefHistory" label="Brief History" rules={[{ required: true }]}>
                  <TextArea
                    value={labRequest.briefHistory}
                    onChange={(e) => handleFieldChange("briefHistory", e.target.value)}
                  />
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
            onClick={handleLabRequest}
            loading={loadingLabRequest}
            disabled={loadingLabRequestPost}
          >
            <SaveOutlined />
           Save Lab Request
          </Button>
          {/* <Button
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
          </Button> */}
        </div>
          </Form>
        )}
      </div>
    );
  };
  
  export default LabTestRequest;
  
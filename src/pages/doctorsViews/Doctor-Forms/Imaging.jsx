import {
    Form,
    Input,
    DatePicker,
    Row,
    Col,
    Button,
    Typography,
    Select,
  } from "antd";
  import moment from "moment"; // Import moment to handle date formatting
  import React, { useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import {
    SendOutlined,
    FileSearchOutlined,
    CalendarOutlined,
    FileTextOutlined,
  } from "@ant-design/icons";
  import { useLocation } from "react-router-dom";
  import { getRadiologySetup } from "../../../actions/Doc-actions/qyRadiologyTestSetups";
  import { postRadiologyRequest } from "../../../actions/Doc-actions/postRadiolgyRequest";
  import { requestRadiologyTest } from "../../../actions/Doc-actions/requestRadiologyTest";
  
  const { Option } = Select;
  
  const Imaging = () => {
    // Extract the treatment number from URL params
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const treatmentNo = queryParams.get("TreatmentNo");
  
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.getRadiologySetup);
    const { loading } = useSelector((state) => state.postRadiologyRequest);
    const { loading: loadingRadiologyRequest } = useSelector(state => state.requestRadiologyTest);
  
    useEffect(() => {
      dispatch(getRadiologySetup());
    }, [dispatch]);
  
    const handleRadiologyRequest = () => {
      dispatch(requestRadiologyTest(treatmentNo));
    };
  
    // Handle form submission
    const handleSave = (values) => {
      const { testPackageCode, dueDate } = values;
  
      // Format dueDate to match the expected structure { year, month, day }
      const formattedDueDate = {
        year: dueDate.year(),
        month: dueDate.month() + 1, // Moment months are 0-indexed, so we add 1
        day: dueDate.date(),
      };
  
      const radiologyRequest = {
        myAction: "create",
        treatmentNo: treatmentNo || values.treatmentNo, // Use treatmentNo from query or input
        radiologyCode: testPackageCode, // Radiology code selected by the user
        dueDate: formattedDueDate, // Date when the request is due
      };
  
      dispatch(postRadiologyRequest(radiologyRequest));
      console.log("Radiology request submitted:", radiologyRequest);
    };
  
    return (
      <div>
        <div className="div">
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
  
          <Form
            layout="vertical"
            initialValues={{
              treatmentNo: treatmentNo || "",
              testPackageCode: "",
              dueDate: moment(),
            }}
            autoComplete="off"
            onFinish={handleSave} // Call handleSave on form submit
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
                  name="testPackageCode"
                  label="Radiology Code"
                >
                  <Select
                    placeholder="Select Radiology Code"
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
                  rules={[{ required: true, message: "Please select a due date!" }]}
                >
                  <DatePicker
                    placeholder="Select Due Date"
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    icon={<CalendarOutlined />}
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
                icon={<FileTextOutlined />}
                onClick={handleRadiologyRequest} // Trigger the lab test request
                loading={loadingRadiologyRequest} // Show loading spinner when the request is in progress
              >
                Request Test
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  marginTop: "16px",
                  marginBottom: "16px",
                  marginRight: "16px",
                  float: "right",
                  width: "150px",
                }}
                icon={<SendOutlined />}
                loading={loading} // Show loading spinner for submitting the form
              >
                Send to Lab
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  };
  
  export default Imaging;
  
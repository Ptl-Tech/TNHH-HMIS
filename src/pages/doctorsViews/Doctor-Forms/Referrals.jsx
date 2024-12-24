import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Button,
  Typography,
  Modal,
  Select,
  Skeleton,
} from "antd";
import {
  FileTextOutlined,
  PrinterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeesList,
  getEmployeeByNumber,
} from "../../../actions/DropdownListActions";
import { postRefferalDetails, requestRefferal } from "../../../actions/Doc-actions/postRefferalDetails";
import { useLocation } from "react-router-dom";
import moment from "moment";

const Referrals = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.getEmployees);
  const { data: employeeData, loading: employeeLoading } = useSelector(
    (state) => state.getEmployeeDetails
  );
  const { loading: saveLoading } = useSelector(
    (state) => state.saveRefferalDetails
  );
  const { loading: requestLoading } = useSelector(
    (state) => state.requestRefferal
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaffNo, setSelectedStaffNo] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [form] = Form.useForm(); // Use Ant Design form hook

  useEffect(() => {
    dispatch(getEmployeesList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStaffNo) {
      setLoadingProfile(true);
      dispatch(getEmployeeByNumber(selectedStaffNo));
    }
  }, [selectedStaffNo, dispatch]);

  const handleModalVisible = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleReferralRequest = () => {
    dispatch(requestRefferal(treatmentNo));
  };

  // Form submission handler
  const handleSubmitReferral = async (values) => {
    const {
      treatmentNo,
      dateReferred,
      hospitalNo,
      contactPerson,
      referralReason,
      referralRemarks,
    } = values;
  
    const referralData = {
      myAction: "create", // Replace with appropriate action
      treatmentNo: treatmentNo,
      dateReferred: new Date(dateReferred).toISOString().split("T")[0], // Format date as YYYY-MM-DD
      hospitalNo: hospitalNo,
      contactPerson: contactPerson,
      referralReason: referralReason,
      referralRemarks: referralRemarks,
    };
  
    try {
      // Dispatch the action to send referral details
      await dispatch(postRefferalDetails(referralData));
      alert("Referral details submitted successfully!");
    } catch (error) {
      console.error("Failed to submit referral:", error);
    }
  };
  

  const handlePrintTransfer = () => {
    window.print();
  };

  return (
    <div>
      {/* Button Section */}
      <div style={{ marginBottom: "20px" }}>
        <Typography.Title level={4} style={{ color: "#0F5689" }}>
          <FileTextOutlined style={{ marginRight: "8px" }} />
          Referral Details
        </Typography.Title>
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="default"
            icon={<PrinterOutlined />}
            onClick={handlePrintTransfer}
          >
            Print Transfer
          </Button>
          <Button
            type="primary"
            icon={<MailOutlined />}
            onClick={handleReferralRequest}
          >
            Send to Referral
          </Button>
          <Button type="default" onClick={handleModalVisible}>
            Show Referral Details
          </Button>
        </div>
      </div>

      {/* Referral Form Card */}
      <Card style={{ margin: "20px 10px" }}>
        <Form form={form} layout="vertical" onFinish={handleSubmitReferral} initialValues={{
          treatmentNo: treatmentNo,
          dateReferred: moment().format("YYYY-MM-DD"), // Default to current date
          hospitalNo: "",
          contactPerson: "",
          referralReason: "",
          referralRemarks: "",

        }}>
          <Row gutter={16}>
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
            <Form.Item label="Date Referred" name="dateReferred">
        <Input name="dateReferred" placeholder="YYYY-MM-DD" value={moment().format("YYYY-MM-DD")} disabled />
      </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Hospital Number" name="hospitalNo">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Contact Person" name="contactPerson">
                <Select
                  placeholder="Select Contact Person"
                  onChange={setSelectedStaffNo}
                >
                  {data?.map((item) => (
                    <Select.Option key={item.No} value={item.No}>
                      {item.FirstName} {item.LastName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Referral Reason" name="referralReason">
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Referral Remarks" name="referralRemarks">
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Button type="primary" htmlType="submit" loading={saveLoading}>
                Submit Referral
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Profile Information for Contact Person */}
      {employeeLoading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        employeeData && (
          <Card title="Contact Person Profile" style={{ margin: "20px 10px" }}>
            <Row gutter={16}>
              <Col span={12}>
                <Typography.Text strong>Name:</Typography.Text>
                <Typography.Text>
                  {employeeData.FirstName} {employeeData.LastName}
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text strong>Gender:</Typography.Text>
                <Typography.Text>{employeeData.Gender}</Typography.Text>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Typography.Text strong>Staff No:</Typography.Text>
                <Typography.Text>{employeeData.No}</Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text strong>Profession:</Typography.Text>
                <Typography.Text>
                  {employeeData.Shortcut_Dimension_2_Code || "N/A"}
                </Typography.Text>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Typography.Text strong>Contact:</Typography.Text>
                <Typography.Text>
                  {employeeData.WorkPhoneNumber}
                </Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text strong>Branch:</Typography.Text>
                <Typography.Text>
                  {employeeData.Shortcut_Dimension_1_Code}
                </Typography.Text>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Typography.Text strong>Email:</Typography.Text>
                <Typography.Text>{employeeData.CompanyEMail}</Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text strong>Designation:</Typography.Text>
                <Typography.Text>
                  {employeeData.Shortcut_Dimension_4_Code}
                </Typography.Text>
              </Col>
            </Row>
          </Card>
        )
      )}

      {/* Modal for Referral Details */}
      <Modal
        title="Referral Details"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={
          <Button type="primary" onClick={handleModalClose}>
            Close
          </Button>
        }
        width={800}
      >
        <Typography.Paragraph>
          Here you can view the details of the referral and any related
          information.
        </Typography.Paragraph>
      </Modal>
    </div>
  );
};

export default Referrals;

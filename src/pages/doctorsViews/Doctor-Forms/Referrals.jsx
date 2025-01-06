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
  Skeleton,
  List,
  Select,
  Table,
} from "antd";
import {
  FileTextOutlined,
  PrinterOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  AppstoreAddOutlined,
  SaveOutlined,
} from "@ant-design/icons"; // Add relevant icons here
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeesList,
  getEmployeeByNumber,
} from "../../../actions/DropdownListActions";
import {
  postRefferalDetails,
  requestRefferal,
} from "../../../actions/Doc-actions/postRefferalDetails";
import { useLocation } from "react-router-dom";
import moment from "moment";
import useAuth from "../../../hooks/useAuth";
import { getHospitalNumber } from "../../../actions/Doc-actions/getHospitalNumber";
import { getReferralLines } from "../../../actions/Doc-actions/getReferralLines";

const Referrals = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");
  const employeeData = useAuth();
  const dispatch = useDispatch();
  const { loading: saveLoading } = useSelector(
    (state) => state.saveRefferalDetails
  );
  const { loading: requestLoading } = useSelector(
    (state) => state.requestRefferal
  );

  const { loading: referralLinesLoading, data: referralLines } = useSelector(
    (state) => state.getReferralLines
  );
  
  const { data } = useSelector((state) => state.getHosNumber);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStaffNo, setSelectedStaffNo] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getEmployeesList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getHospitalNumber());
  }, [dispatch]);

  useEffect(() => {
    if(treatmentNo){
      dispatch(getReferralLines(treatmentNo));
    }
  }, [dispatch, treatmentNo]);

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
      myAction: "create",
      treatmentNo: treatmentNo,
      dateReferred: new Date(dateReferred).toISOString().split("T")[0],
      hospitalNo: hospitalNo,
      contactPerson: contactPerson,
      referralReason: referralReason,
      referralRemarks: referralRemarks,
    };

    try {
      await dispatch(postRefferalDetails(referralData));
    } catch (error) {
      console.error("Failed to submit referral:", error);
    }
  };

  const handlePrintTransfer = () => {
    window.print();
  };

  const referralLinesCols = [
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Description",
      dataIndex: "ReferralReason",
      key: "ReferralReason",
    },
    {
      title: "Clinical Notes",
      dataIndex: "ClinicalHistoryTreatment",
      key: "ClinicalHistoryTreatment",
    },
    {
      title: "Date Referred",
      dataIndex: "DateReferred",
      key: "DateReferred",
    },
    {
      title: "Hospital",
      dataIndex: "HospitalName",
      key: "HospitalName",
    },
    {
      title: "Contact Person",
      dataIndex: "ContactPerson",
      key: "ContactPerson",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      // render different status colors  for approved new and cancelled
      render: (text) => {
        let color = "black";
        if (text === "Approved") {
          color = "green";
        } else if (text === "New") {
          color = "blue";
        } else if (text === "Cancelled") {
          color = "red";
        }
        return (
          <Typography.Text style={{ color: color, fontWeight: "bold" }}>
            {text}
          </Typography.Text>
        );
      },
    }
  ];

  const dataSource=[
    {
      key:referralLines?.TreatmentNo,
      TreatmentNo: referralLines?.TreatmentNo,
      ReferralReason: referralLines?.ReferralReason,
      ClinicalHistoryTreatment: referralLines?.ClinicalHistoryTreatment,
      DateReferred: referralLines?.DateReferred,
      HospitalName: referralLines?.HospitalName,
      ContactPerson: referralLines?.ContactPerson,
      Status: referralLines?.Status
    }
  ]

  return (
    <div>
      {/* Button Section */}
      <div style={{ marginBottom: "20px" }}>
        <Typography.Title level={4} style={{ color: "#0F5689" }}>
          <FileTextOutlined style={{ marginRight: "8px" }} />
          Referral Details
        </Typography.Title>
        <div style={{ display: "flex", gap: "10px", alignItems: "right" , justifyContent: "flex-end"}}>
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
            Show Previous Referrals
          </Button>
        </div>
      </div>

      {/* Referral and Employee Info Cards */}
      <Row gutter={16}>
        {/* Referral Form Card */}
        <Col span={14}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitReferral}
            initialValues={{
              treatmentNo: treatmentNo,
              dateReferred: moment().format("YYYY-MM-DD"), // Default to current date
              hospitalNo: "",
              contactPerson: "",
              referralReason: "",
              referralRemarks: "",
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
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
                    style={{
                      width: "100%",
                      color: "green",
                      fontWeight: "bold",
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Date Referred" name="dateReferred">
                  <Input
                    name="dateReferred"
                    placeholder="YYYY-MM-DD"
                    value={moment().format("YYYY-MM-DD")}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Hospital" name="hospitalNo">
                  <Select
                    placeholder="Select Hospital"
                    style={{ width: "100%" }}
                    showSearch
                  >
                    {data?.map((item) => {
                      <Option key={item[0]?.No} value={item.No}>
                        {item[0]?.Name}
                      </Option>;
                    })}
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={saveLoading}
                  disabled={saveLoading}
                  style={{ width: "100%" }}
                >
                  <SaveOutlined />
                  Save
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>

        {/* Employee Info Card */}
        <Col span={10}>
          {loadingProfile ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            employeeData && (
              <Card
                title="Contact Person Profile"
                style={{ margin: "20px 10px", backgroundColor: "#f4f8fb" }}
              >
                <List
                  itemLayout="horizontal"
                  style={{ width: "100%", padding: "10px" }}
                  dataSource={[
                    {
                      title: "Name",
                      content:
                        `${employeeData.userData.firstName} ${employeeData.userData.lastName}` ||
                        "N/A",
                      icon: <UserOutlined style={{ fontSize: "20px" }} />,
                    },
                    {
                      title: "Gender",
                      content: employeeData.userData.Gender,
                      icon: (
                        <AppstoreAddOutlined style={{ fontSize: "20px" }} />
                      ),
                    },
                    {
                      title: "Title",
                      content: employeeData.userData.title,
                      icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
                    },
                    {
                      title: "Staff No",
                      content: employeeData.userData.no,
                      icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
                    },
                    {
                      title: "Profession",
                      content:
                        employeeData.userData.Shortcut_Dimension_2_Code ||
                        "N/A",
                      icon: (
                        <AppstoreAddOutlined style={{ fontSize: "20px" }} />
                      ),
                    },
                    {
                      title: "Contact",
                      content: employeeData.userData.workPhoneNumber,
                      icon: <PhoneOutlined style={{ fontSize: "20px" }} />,
                    },
                    {
                      title: "Branch",
                      content: employeeData.userData.shortcut_Dimension_1_Code,
                      icon: (
                        <EnvironmentOutlined style={{ fontSize: "20px" }} />
                      ),
                    },
                    {
                      title: "Email",
                      content: employeeData.userData.companyEMail,
                      icon: <MailOutlined style={{ fontSize: "20px" }} />,
                    },
                    {
                      title: "Designation",
                      content: employeeData.userData.shortcut_Dimension_4_Code,
                      icon: <IdcardOutlined style={{ fontSize: "20px" }} />,
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        style={{ width: "100%", flexWrap: "row" }}
                        avatar={item.icon}
                        title={
                          <Typography.Text strong>
                            {item.title}:
                          </Typography.Text>
                        }
                        description={
                          <Typography.Text>{item.content}</Typography.Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )
          )}
        </Col>
      </Row>

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
        width={900}
      >
        <Table
          columns={referralLinesCols}
          dataSource={dataSource}
          pagination={false}
          loading={referralLinesLoading}
        />
      </Modal>
    </div>
  );
};

export default Referrals;

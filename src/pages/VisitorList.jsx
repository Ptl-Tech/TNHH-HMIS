import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  Input,
  Tag,
  Row,
  Col,
  Card,
  Typography,
  message,
} from "antd";
import { TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../actions/visitorsActions";
import { useNavigate } from "react-router-dom";
import { convertPatient } from "../actions/patientActions";

const VisitorList = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [statusForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    IdNumber: "",
    VisitorName: "",
    VisitorPhone: "",
  });
  const [showTable, setShowTable] = useState(false);
  const currentDate = dayjs().format("DD/MM/YYYY");

  const { loading, error, visitors } = useSelector(
    (state) => state.visitorsList
  );
  const {
    loading: patientsLoading,
    error: patientsError,
    patients,
  } = useSelector((state) => state.patientList);

  const { loading: convertLoading, error: convertError } = useSelector(
    (state) => state.convertPatient
  );

  const [filteredVisitors, setFilteredVisitors] = useState([]);

  const { userInfo } = useSelector((state) => state.otpVerify);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVisitorsList());
  }, [dispatch]);

  useEffect(() => {
    filterVisitors();
  }, [visitors]);
  useEffect(() => {
    if (visitors) {
      // Filter visitors by current date
      const todayVisitors = visitors.filter((visitor) =>
        dayjs(visitor.CreatedDate).isSame(currentDate, "day")
      );
      setFilteredVisitors(todayVisitors);
    }
  }, [visitors, currentDate]);

  const handleUpdateStatus = () => {
    statusForm.validateFields().then((values) => {
      setFilteredVisitors((prevVisitors) =>
        prevVisitors.map((visitor) =>
          visitor.key === editingVisitor.key
            ? {
                ...visitor,
                ...values,
                timeIn: values.timeIn?.format("HH:mm"),
                timeOut: values.timeOut?.format("HH:mm"),
              }
            : visitor
        )
      );
      setModalVisible(false);
      setEditingVisitor(null);
    });
  };

  const handleEditStatus = (visitor) => {
    setEditingVisitor(visitor);
    statusForm.setFieldsValue({
      status: visitor.Status,
      timeIn: visitor.timeIn ? dayjs(visitor.timeIn, "HH:mm") : null,
      timeOut: visitor.timeOut ? dayjs(visitor.timeOut, "HH:mm") : null,
    });
    setModalVisible(true);
  };
  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    const updatedSearchParams = {
      ...searchParams,
      [field]: value,
    };
    setSearchParams(updatedSearchParams);

    // Filter visitors and decide whether to show the table
    const isAnyFieldFilled =
      updatedSearchParams.IdNumber ||
      updatedSearchParams.VisitorName ||
      updatedSearchParams.VisitorPhone;

    if (isAnyFieldFilled) {
      setShowTable(true);
      filterVisitors(updatedSearchParams);
    } else {
      setShowTable(false);
      setFilteredVisitors([]); // Clear the filtered visitors when no search
    }
  };

  const filterVisitors = (searchCriteria) => {
    const filtered = visitors.filter((visitor) => {
      return (
        (!searchCriteria?.VisitorName ||
          visitor.VisitorName?.toLowerCase().includes(
            searchCriteria.VisitorName.toLowerCase()
          )) &&
        (!searchCriteria?.IdNumber ||
          visitor.IDNumber?.includes(searchCriteria.IdNumber)) &&
        (!searchCriteria?.VisitorPhone ||
          visitor.PhoneNumber?.includes(searchCriteria.VisitorPhone))
      );
    });
    setFilteredVisitors(filtered);
  };

  const handleConvertToPatient = async (visitor) => {
    try {
      const visitorNo = visitor.No;
      console.log("Visitor No:", visitorNo);

      // Dispatch the conversion action to fetch the patient number
      const patientNo = await dispatch(convertPatient(visitorNo));

      if (patientNo) {
        const existingPatient = patients.find(
          (patient) => patient.PatientNo === patientNo
        );

        if (existingPatient) {
          // Patient found; navigate to the patient details page
          message.success("Patient converted successfully.", 5);
          navigate(`/reception/Add-Appointment/${patientNo}`, {
            state: { existingPatient },
          });
          console.log(
            "Navigating to Patient Details Page with Patient Data:",
            existingPatient
          );
        } else {
          // Patient not found; navigate to the registration page
          message.warning(
            "Patient not found. Please register the patient first.",
            5
          );
          navigate("/reception/Patient-Registration", {
            state: { visitorData: visitor, patientNumber: patientNo }, // Passing the visitor info to the registration page
          });
          console.log(
            "Navigating to Patient Registration Page with Visitor Data:",
            visitor
          );
        }
      } else {
        // No patient number returned from the action
        message.warning("Unable to retrieve patient number.", 5);
      }
    } catch (error) {
      console.error("Error converting visitor to patient:", error);
      message.error("An error occurred while processing the request.", 5);
    }
  };

  const columns = [
    { title: "No", dataIndex: "No", key: "No" },
    // {
    //   title: "Visitor Number",
    //   dataIndex: "VisitorNumber",
    //   key: "visitorNumber",
    // },
    { title: "Visitor Name", dataIndex: "VisitorName", key: "visitorName" },
    {
      title: "Purpose of Visit",
      dataIndex: "PurposeofVisit",
      key: "PurposeofVisit",
    },
    { title: "Phone Number", dataIndex: "PhoneNumber", key: "phoneNumber" },
    {
      title: "Date of Visit",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (CreatedDate) => dayjs(CreatedDate).format("DD/MM/YYYY"),
    },
    {
      title: "Time In",
      dataIndex: "CreatedTime",
      key: "CreatedTime",
      render: (CreatedTime) => dayjs(CreatedTime).format("HH:mm"),
    },
    // {
    //   title: "Time Out",
    //   dataIndex: "timeOut",
    //   key: "timeOut",
    //   render: (timeOut) => dayjs(timeOut).format("HH:mm"),
    // },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
      render: (status) => {
        const statusColors = {
          Arrived: "orange",
          Entered: "red",
          Received: "blue",
          Cleared: "green",
        };
        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    { title: "Person to See", dataIndex: "PersonToSee", key: "personToSee" },
    {
      title: "Visitor Category",
      dataIndex: "VisitorCategory",
      key: "visitorCategory",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {userInfo.userData?.departmentName === "Security" ? (
            <Button
              type="primary"
              onClick={() => handleEditStatus(record)}
              ghost
            >
              Update Status
            </Button>
          ) : userInfo.userData?.departmentName === "Reception" ? (
            <Button
              type="primary"
              onClick={() => handleConvertToPatient(record)} // Opens modal for Reception with 'Convert to Patient' functionality
              ghost
            >
              Convert to Patient
            </Button>
          ) : null}
        </>
      ),
    },
  ];

  const mappedVisitors = filteredVisitors.map((visitor, index) => ({
    key: visitor.No,
    No: visitor.No,
    // VisitorNumber: visitor.VisitorNumber,
    VisitorName: visitor.VisitorName,
    PurposeofVisit: visitor.PurposeofVisit,
    PhoneNumber: visitor.PhoneNumber,
    CreatedDate: visitor.CreatedDate,
    Status: visitor.Status,
    PersonToSee: visitor.PersonToSee,
    VisitorCategory: visitor.VisitorCategory,
    timeIn: visitor.CreatedTime,
    timeOut: visitor.ClearedTime,
  }));

  return (
    <div className="card mt-4">
      <div className="">
        <h5
          // className="card-title"
          style={{ color: "#ac8342", textAlign: "center", padding: "10px" }}
        >
          {/* <TeamOutlined style={{ marginRight: 8, fontSize: "40px" }} /> */}
          Visitor List
        </h5>
      </div>
      <Card className="card-header mb-4  p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Visitor Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={8}>
            <Input
              placeholder="Id Number"
              value={searchParams.IdNumber}
              onChange={(e) => handleSearchChange(e, "IdNumber")}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="Visitor Name"
              value={searchParams.VisitorName}
              onChange={(e) => handleSearchChange(e, "VisitorName")}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Input
              placeholder="Phone Number"
              value={searchParams.VisitorPhone}
              onChange={(e) => handleSearchChange(e, "VisitorPhone")}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Show the table only if there are filtered visitors or search was performed */}
     {showTable && filteredVisitors.length > 0 ? (
  <Table
    columns={columns}
    dataSource={filteredVisitors}
    pagination={{ pageSize: 10 }}
    style={{ marginTop: "16px" }}
    bordered
    size="small"
  />
) : showTable && filteredVisitors.length === 0 ? (
  <div style={{ marginTop: "16px", textAlign: "center" }}>
    <Typography.Text type="secondary">
      No visitors found matching your search criteria.
    </Typography.Text>
  </div>
) : null}

      <Modal
        title="Edit Status"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={statusForm} onFinish={handleUpdateStatus} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Select.Option value="Arrived">Arrived</Select.Option>
              <Select.Option value="Entered">Entered</Select.Option>
              <Select.Option value="Received">Received</Select.Option>
              <Select.Option value="Cleared">Cleared</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="timeIn" label="Time In">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="timeOut" label="Time Out">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorList;

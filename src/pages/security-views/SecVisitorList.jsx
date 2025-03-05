import React, { useEffect, useMemo, useState } from "react";
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
import { ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../../actions/visitorsActions";
import { useNavigate } from "react-router-dom";
import { convertPatient, listPatients } from "../../actions/patientActions";
import Loading from "../../partials/nurse-partials/Loading";

const SecVisitorList = () => {
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [statusForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    IdNumber: "",
    VisitorName: "",
    VisitorPhone: "",
  });

  const currentDate = dayjs().format("YYYY-MM-DD");

  const {
    loading: visitorLoading,
    error,
    visitors,
  } = useSelector((state) => state.visitorsList);
 

  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const { userInfo } = useSelector((state) => state.otpVerify);
  const [showTable, setShowTable] = useState(
    userInfo.userData.departmentName === "Reception" ? true : false
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVisitorsList());
    
  }, [dispatch]);

  // Use useMemo to filter visitors based on search parameters
  useEffect(() => {
    const filteredVisitorsMemo = () => {
      return visitors.filter((visitor) => {
        // Apply filtering conditions
        const matchesSearchParams =
          (!searchParams.VisitorName ||
            visitor.VisitorName?.toLowerCase().includes(searchParams.VisitorName.toLowerCase())) &&
          (!searchParams.IdNumber || visitor.IDNumber?.includes(searchParams.IdNumber)) &&
          (!searchParams.VisitorPhone || visitor.PhoneNumber?.includes(searchParams.VisitorPhone));
  
     //   const isValidStatus = visitor.Status === "Entered" && visitor.Status !== "Cleared";
  
        const isCreatedToday = dayjs(visitor.InitiatedDate).isSame(currentDate, "day");
  
        // Return true if all conditions are met (only today's visitors)
        return isCreatedToday  && matchesSearchParams;
      });
    };
  
    if (visitors.length > 0) {
      setFilteredVisitors(filteredVisitorsMemo());
    }
  }, [visitors, searchParams, currentDate]);
  
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

    const isAnyFieldFilled =
      updatedSearchParams.IdNumber ||
      updatedSearchParams.VisitorName ||
      updatedSearchParams.VisitorPhone;

    // If any field is filled, show table and filter visitors
    if (isAnyFieldFilled) {
      setShowTable(true);
      setFilteredVisitors(filteredVisitors); // Update the table with filtered visitors
    } else if (!isAnyFieldFilled) {
      setFilteredVisitors(filteredVisitors);
      setShowTable(false); // Hide table if no search is applied
    }
  };

  // Define globally accessible function to determine button text

  const handleClearVisitor = async (visitor) => {
    try {
      // Set the visitor details to be edited in the modal
      setEditingVisitor(visitor);

      // Show the modal with the visitor's details
      setModalVisible(true);
    } catch (error) {
      message.error("Failed to clear visitor.", 5);
    }
  };


  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    { title: "Visitor No", dataIndex: "No", key: "No" },
    { title: "Visitor Name", dataIndex: "VisitorName", key: "VisitorName" },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Purpose of Visit",
      dataIndex: "PurposeofVisit",
      key: "PurposeofVisit",
    },
    { title: "Phone Number", dataIndex: "PhoneNumber", key: "PhoneNumber" },
    {
      title: "Date of Visit",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Time In",
      dataIndex: "InitiatedByTime",
      key: "InitiatedByTime",
      render: (time) => {
        if (!time) return "Invalid Time";
        const validTime = new Date(`1970-01-01T${time}`);
        return validTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
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
    {
      title: "Action",
      key: "action",
      render: (_, visitor) => {
        return (
          <Button
            onClick={() =>
              visitor.Status === "Cleared"
                ? handleCheckInVisitor(visitor) // Function to check in visitor
                : handleClearVisitor(visitor) // Function to clear visitor
            }
            type="primary"
          >
            {visitor.Status === "Cleared" ? "Check In Visitor" : "Clear Visitor"}
          </Button>
        );
      },
    }
    
  ];

  return (
    <div className="card mt-4">
      <div className="d-flex justify-content-between align-items-center w-100">
        <h5
          style={{
            color: "#ac8342",
            textAlign: "center",
            padding: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TeamOutlined style={{ marginRight: 8 }} /> Visitor List
        </h5>
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          onClick={() => dispatch(getVisitorsList(filteredVisitors))}
          style={{ marginRight: 16 }}
        >
          Refresh
        </Button>
      </div>
      <Card className="card-header mb-4 p-4">
        <Typography.Text
          style={{ color: "#003F6D", fontWeight: "bold", marginBottom: "16px" }}
        >
          Find Visitor Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={6}>
            <Input
              placeholder="Id Number"
              value={searchParams.IdNumber}
              onChange={(e) => handleSearchChange(e, "IdNumber")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Visitor Name"
              value={searchParams.VisitorName}
              onChange={(e) => handleSearchChange(e, "VisitorName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Visitor Phone"
              value={searchParams.VisitorPhone}
              onChange={(e) => handleSearchChange(e, "VisitorPhone")}
              allowClear
            />
          </Col>
        </Row>
      </Card>
      {
        showTable && (
          <Table
            columns={columns}
            dataSource={filteredVisitors}
            pagination={{ pageSize: 10 }}
            style={{ marginTop: "16px" }}
          />
        )
      }
      {/* // Modal Form with Visitor Details */}
      <Modal
      visible={modalVisible}
      title="Visitor Details"
      onCancel={() => setModalVisible(false)}
      footer={[
        <Button key="cancel" onClick={() => setModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
         // loading={loading}
          onClick={handleUpdateStatus}
        >
          Save Changes
        </Button>,
      ]}
      style={{ top: 20 }}
    >
      <Form
        form={statusForm}
        name="visitorDetails"
        layout="vertical"
        initialValues={{
          status: editingVisitor?.Status,
          timeIn: editingVisitor?.CreatedTime
            ? dayjs(editingVisitor.CreatedTime, "HH:mm:ss.SS") // Parse only the time part
            : null,
          timeOut: editingVisitor?.timeOut
            ? dayjs(editingVisitor.timeOut, "HH:mm")
            : null,
        }}
        onFinish={handleUpdateStatus}
      >
        {/* Visitor Details */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Visitor Name">
              <Input value={editingVisitor?.VisitorName} readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone Number">
              <Input value={editingVisitor?.PhoneNumber} readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Purpose of Visit">
              <Input value={editingVisitor?.PurposeofVisit} readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="Arrived">Arrived</Select.Option>
                <Select.Option value="Entered">Entered</Select.Option>
                <Select.Option value="Cleared">Cleared</Select.Option>
                <Select.Option value="Received">Received</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="timeIn" label="Time In">
              <TimePicker
                format="HH:mm"
                style={{ width: "100%" }}
                value={dayjs(editingVisitor?.CreatedTime, "HH:mm:ss.SS")} // Parse time correctly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="timeOut" label="Time Out">
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
    </div>
  );
};

export default SecVisitorList;

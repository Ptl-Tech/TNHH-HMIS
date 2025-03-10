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
import { clearVisitor, getVisitorsList } from "../../actions/visitorsActions";
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
  const {
    loading: clearVisitorLoading,
    error:clearVisitorError,
    data,
  } = useSelector((state) => state.clearVisitor);
 
  


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
  
    if (visitors?.length > 0) {
      setFilteredVisitors(filteredVisitorsMemo());
    }
  }, [visitors, searchParams, currentDate]);
  

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
     // Set the visitor details to be edited in the modal
     setEditingVisitor(visitor);

     // Show the modal with the visitor's details
     setModalVisible(true);
  };

  const confirmClearVisitor = async () => {
    if (!editingVisitor) return;
  
     await dispatch(clearVisitor(editingVisitor.No)); // Dispatch clear action
      message.success("Visitor cleared successfully", 5);
      setModalVisible(false);
      dispatch(getVisitorsList()); // Refresh visitor list
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
              handleClearVisitor(visitor)
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
      <Modal
  title="Confirm Visitor Clearance"
  visible={modalVisible}
  onOk={confirmClearVisitor} // Call function when confirmed
  onCancel={() => setModalVisible(false)}
  okText="Yes, Clear"
  cancelText="Cancel"
  loading={clearVisitorLoading}
>
  <p>Are you sure you want to clear visitor <strong>{editingVisitor?.VisitorName}</strong>?</p>
</Modal>

    </div>
  );
};

export default SecVisitorList;

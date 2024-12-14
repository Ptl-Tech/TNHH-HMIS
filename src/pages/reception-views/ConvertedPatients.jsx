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
  List,
} from "antd";
import { ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsList } from "../../actions/visitorsActions";
import { useNavigate } from "react-router-dom";
import { convertPatient, listPatients } from "../../actions/patientActions";

const ConvertedPatients = () => {
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
  const { loading: patientsLoading, patients } = useSelector(
    (state) => state.patientList
  );
  const { loading, patients:visitPatients } = useSelector((state) => state.appmntList);


  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const { userInfo } = useSelector((state) => state.otpVerify);
  const [showTable, setShowTable] = useState(
    userInfo.userData.departmentName === "Reception" ? true : false
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getVisitorsList());
    dispatch(convertPatient());
    dispatch(listPatients());
  }, [dispatch]);

  // Use useMemo to filter visitors based on search parameters
  const filteredVisitorsMemo = useMemo(() => {
    // Filter out dispatched visitors
    const filtered = visitors.filter((visitor) => {
      const patient = visitPatients.find(
        (patient) => patient.PatientNo === visitor.Patient_No_
      );
  
      // If a patient is found and has been dispatched, don't include them
      if (patient && patient.Status === "Dispatched") {
        return false;
      }
  
      return (
        dayjs(visitor.CreatedDate).isSame(currentDate, "day") &&
        visitor.Status === "Converted to Patient" &&
        (!searchParams.VisitorName ||
          visitor.VisitorName?.toLowerCase().includes(
            searchParams.VisitorName.toLowerCase()
          )) &&
        (!searchParams.IdNumber ||
          visitor.IDNumber?.includes(searchParams.IdNumber)) &&
        (!searchParams.VisitorPhone ||
          visitor.PhoneNumber?.includes(searchParams.VisitorPhone))
      );
    });
    return filtered;
  }, [visitors, searchParams, currentDate, visitPatients]);
  
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
      setFilteredVisitors(filteredVisitorsMemo); // Update the table with filtered visitors
    } else if(allowClear) {
      setShowTable(false); // Hide table if no search is applied
      setFilteredVisitors(filteredVisitorsMemo)
    }
  };

  // Define globally accessible function to determine button text
  const getButtonText = (visitor) => {
  const patient = visitPatients.find(
    (patient) => patient.PatientNo === visitor.Patient_No_ && patient.Status !== "Dispatched" 
  );
  return patient ? "Dispatch Patient" : "Create New Appointment";
};


  const handleConvertToPatient = async (visitor) => {
    try {
      const patientNo = await dispatch(convertPatient(visitor.No));

      if (patientNo) {
        const existingPatient = patients.find(
          (patient) => patient.PatientNo === patientNo
        );
        if (existingPatient) {
          message.success("Create new Appointment.", 5);
          navigate(`/reception/Add-Appointment/${patientNo}`, {
            state: { existingPatient },
          });
        } else {
          message.warning(
            "Patient not found. Please register the patient first.",
            5
          );
          navigate("/reception/Patient-Registration", {
            state: { visitorData: visitor, patientNumber: patientNo },
          });
        }
      } else {
        message.warning("Unable to retrieve patient number.", 5);
      }
    } catch (error) {
      message.error("An error occurred while processing the request.", 5);
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
        // Get the button text
        const buttonText = getButtonText(visitor);

        // Dynamically set button style based on whether the visitor has an appointment (or is converted)
        const isCreatedVisit = buttonText === "Create New Visit";

        // Set the ghost variable
        const ghost = isCreatedVisit;

        return (
          <Button
            ghost={ghost} // Use the ghost variable
            //  loading={convertLoading}
            onClick={() => handleConvertToPatient(visitor)}
            type="primary"
          >
            {buttonText}
          </Button>
        );
      },
    },
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
          <TeamOutlined style={{ marginRight: 8 }} />{" "}
          {/* Icon before the text */}
          Converted Patient List
        </h5>
        <Button
          icon={<ReloadOutlined />}
          type="primary"
          onClick={() => dispatch(getVisitorsList(filteredVisitorsMemo))}
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
      {showTable && filteredVisitorsMemo.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredVisitorsMemo}
          pagination={{ pageSize: 10 }}
          style={{ marginTop: "16px" }}
          bordered
          size="small"
        />
      ) : (
        <div style={{ textAlign: "center", padding: "20px" }}>
          No visitors found for the selected search criteria.
        </div>
      )}

      <Modal
        title="Update Visitor Status"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleUpdateStatus}
        okText="Update Status"
        cancelText="Cancel"
        width={500}
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item
            name="status"
            label="Status"
            initialValue={editingVisitor?.Status}
          >
            <Select>
              <Select.Option value="Entered">Entered</Select.Option>
              <Select.Option value="Exited">Exited</Select.Option>
              <Select.Option value="Cleared">Cleared</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="timeIn" label="Time In">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="timeOut" label="Time Out">
            <TimePicker format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConvertedPatients;

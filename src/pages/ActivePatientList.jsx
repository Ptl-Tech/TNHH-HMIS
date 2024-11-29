import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activePatients,
  createTriageVisit,
  listPatients,
} from "../actions/patientActions";
import {
  Table,
  Button,
  Input,
  Pagination,
  Modal,
  Tooltip,
  Card,
  Row,
  Col,
  Typography,
  Form,
  Select,
  DatePicker,
  Avatar,
  Tag,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EyeOutlined,
  SendOutlined,
  FileAddOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { listInsuranceOptions } from "../actions/DropdownListActions";

const { Search } = Input;

const ActivePatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, patients } = useSelector(
    (state) => state.activePatients
  );

  const [searchParams, setSearchParams] = useState({
    firstName: "",
    lastName: "",
    patientId: "",
    patientNo: "",
  });

  const [showList, setShowList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [dobError, setDobError] = useState(""); // State for DOB error message
  const [appointmentId, setAppointmentId] = useState(null);
  const [age, setAge] = useState(null); // State to hold calculated age
  const [isRowVisible, setIsRowVisible] = useState(true);

  const {
    loading: insuranceLoading,
    error: insuranceError,
    success: insuranceSuccess,
    data: insurancePayload,
  } = useSelector((state) => state.getInsurance);

  // Toggle visibility function
  const toggleRowVisibility = () => {
    setIsRowVisible((prev) => !prev);
  };

  useEffect(() => {
    dispatch(activePatients());
    dispatch(listInsuranceOptions());
  }, [dispatch]);

  useEffect(() => {
    if (patients.length) {
      handleFilterPatients();
    }

    console.log("filteredPatients", filteredPatients);
  }, [patients, searchParams]); // Re-run filtering on data or search params change

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowList(true); // Show the list when typing starts
  };

  const handleFilterPatients = () => {
    const filtered = patients.filter((patient) => {
      return (
        patient.Names.toLowerCase().includes(
          searchParams.firstName.toLowerCase()
        ) &&
        // patient.LastName.toLowerCase().includes(
        //   searchParams.lastName.toLowerCase()
        // ) &&
        // patient.IDNumber.includes(searchParams.patientId) &&
        patient.PatientNo.toString().includes(searchParams.patientNo)
      );
    });
    setFilteredPatients(filtered);
  };

  const handleDispatch = (record) => {
    dispatch(createTriageVisit(record.PatientNo));
    setSelectedPatient(record);
  };

  const showModal = (record) => {
    setSelectedPatient(record); // Set selected patient
    setIsModalVisible(true); // Open the modal
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPatient(null);
  };

  const handleselectedPatient = () => {
    navigate("/reception/Patient-Registration");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFilterPatients();
  };

  const handleInputChange = (e) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    handleFilterPatients();
  };

  const handleDisplayDropDown = (e) => {
    const { name, value } = e.target;

    if (name === "insuranceName" && insurancePayload) {
      dispatch(listInsuranceOptions());
    }

    setSearchParams((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    handleFilterPatients();
  };

  const handleSelectChange = (name, value) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (date, dateString) => {
    if (!dateString) {
      setDobError("Date of birth is required.");
      setAge(null);
      return;
    }

    const today = moment();
    const dob = moment(dateString, "YYYY-MM-DD");
    const years = today.diff(dob, "years");
    const months = today.diff(dob, "months") % 12; // Remaining months after full years

    if (years < 2) {
      setDobError("Patient must be at least 2 years old.");
      dispatch(listClinics());

      setAge(null);
    } else {
      setDobError("");
      setAge({ years, months }); // Store years and months in the state
      setSelectedPatient((prev) => ({ ...prev, dob: dateString }));
    }
  };
  const handleTriageDispatch = async () => {
    try {
      // Dispatch the action with the appointmentId (which should be passed correctly)
      const result = await dispatch(postTriageVisit(appointmentId));

      if (result) {
        message.success("Triage visit updated successfully!");
        console.log("Triage visit updated with Appointment ID:", appointmentId);
      } else {
        message.error(
          "Failed to dispatch triage visit update. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during triage dispatch:", error);
      message.error("Failed to dispatch triage visit. Please try again.");
    }
  };

  const totalPatients = filteredPatients.length;
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalPatients);
  const patientsToDisplay = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const rowClassName = (record) => {
    const turnaroundTime = record["Turn around Time"];
    if (turnaroundTime > 60) {
      return "danger-row"; // Red for critical
    } else if (turnaroundTime > 45) {
      return "warning-row"; // Yellow for warning
    }
    return "";
  };

  const columns = [
    {
      title: "AppointmentNo",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
      sorter: (a, b) => a.AppointmentNo - b.AppointmentNo,
    },

    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo - b.PatientNo,
    },
    {
      title: "Patient Name",
      dataIndex: "Names",
      key: "Names",
      sorter: (a, b) => a.Names.localeCompare(b.Names),
    },
    //  { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },

    { title: "Gender", dataIndex: "Gender", key: "Gender" },
    { title: "Patient Type", dataIndex: "PatientType", key: "PatientType" },
    {
      title: "SpecialClinics",
      dataIndex: "SpecialClinics",
      key: "SpecialClinics",
    },
    {
      title: "AppointmentDate",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered),
    },
    { title: "Doctor", dataIndex: "Doctor", key: "Doctor" },
    {
      title: "AppointmentType",
      dataIndex: "AppointmentType",
      key: "AppointmentType",
    },
    { title: "DispatchTo", dataIndex: "DispatchTo", key: "DispatchTo" },
    { title: "Time", dataIndex: "Time", key: "Time" },
    { title: "Turn around Time", dataIndex: "Time", key: "Time" },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status) => {
        const statusColors = {
          Rescheduled: "orange",
          Cancelled: "red",
          Dispatched: "blue",
          New: "green",
          Completed: "success",
        };
        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="Create Patient Visit"></Tooltip>
          <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Active Patient List
      </h4>
      <div className="d-flex justify-content-between">
        <Button
          type="primary"
          onClick={handleselectedPatient}
          style={{ marginBottom: "20px" }}
        >
          Register New Patient
        </Button>
        {/* <Button style={{ marginBottom: "20px" }} type="primary">
          <FileAddOutlined />
          Admit Patient
        </Button> */}
      </div>
      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Patient Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={6}>
            <Input
              placeholder="First Name"
              value={searchParams.firstName}
              onChange={(e) => handleSearchChange(e, "firstName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Last Name"
              value={searchParams.lastName}
              onChange={(e) => handleSearchChange(e, "lastName")}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Search
              placeholder="Patient ID"
              value={searchParams.patientId}
              onChange={(e) => handleSearchChange(e, "patientId")}
              allowClear
              onSearch={handleFilterPatients} // Ensure Enter triggers filtering
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Patient No"
              value={searchParams.patientNo}
              onChange={(e) => handleSearchChange(e, "patientNo")}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {showList && (
        <>
          <p>
            Showing {startRecord} to {endRecord} of {totalPatients} records
          </p>
          <Table
            columns={columns}
            dataSource={patientsToDisplay}
            loading={loading}
            pagination={false}
            rowKey={(record) => record.id || Math.random()}
            rowClassName={rowClassName}
            locale={{
              emptyText: "No data available",
            }}
          />
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalPatients}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: "right", marginTop: "16px" }}
          />
        </>
      )}

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        title={
          <Typography.Title
            level={4}
            style={{ color: "#FF5733", marginBottom: 14 }} // Customize color and margin
          >
            Patient No: {selectedPatient?.PatientNo || "N/A"}
          </Typography.Title>
        }
        footer={
          <>
            <Button onClick={handleOk}>Close</Button>
          </>
        }
        width={1440}
        style={{ top: 20 }}
      >
        {selectedPatient && (
          <div className="">
            <Row gutter={[20, 20]} className="equal-height-cards">
              <Col xs={24} md={7}>
                <Card bordered={true} className="card-header">
                  <div className="mb-3">
                    <Typography.Title level={5} style={{ color: "#003F6D" }}>
                      Patient Information
                    </Typography.Title>
                    {/* <p>
                      <strong>Patient No:</strong> {selectedPatient.PatientNo}
                    </p> */}
                    <p className="d-flex align-items-center gap-2">
                      <strong>Patient Name:</strong>{" "}
                      {selectedPatient.SearchName}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Date of Birth:</strong>{" "}
                      {selectedPatient.DateOfBirth}
                    </p>
                    <p className="d-flex align-items-center gap-2">
                      <strong>Age:</strong>
                      {selectedPatient.DateOfBirth
                        ? `${moment().diff(
                            moment(selectedPatient.DateOfBirth),
                            "years"
                          )} years, ${
                            moment().diff(
                              moment(selectedPatient.DateOfBirth),
                              "months"
                            ) % 12
                          } months`
                        : "N/A"}
                    </p>

                    <p className="d-flex align-items-center gap-2">
                      <strong>Gender:</strong> {selectedPatient.Gender}
                    </p>
                    <p className="d-flex align-items-center gap-2">
                      <strong>Nationality:</strong>{" "}
                      {selectedPatient.Nationality}
                    </p>

                    <p className="d-flex align-items-center gap-4">
                      <strong>ID Number:</strong> {selectedPatient.IDNumber}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Typography.Title level={5} style={{ color: "#003F6D" }}>
                      Contact Details
                    </Typography.Title>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Phone Number(Home):</strong>{" "}
                      {selectedPatient.TelephoneNo1}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Spouse Name:</strong> {selectedPatient.SpouseName}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong> Spouse Phone Number:</strong>{" "}
                      {selectedPatient.SpouseTelephoneNo1}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Correspondence Address:</strong>{" "}
                      {selectedPatient.CorrespondenceAddress1}
                    </p>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={11}>
                <Card bordered={false} className="card-header">
                  <div className="">
                    <Typography.Title level={5} style={{ color: "#003F6D" }}>
                      Genral Information
                    </Typography.Title>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Visit Type:</strong>{" "}
                      {selectedPatient.PatientType2}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong>File Number:</strong> {selectedPatient.FileNo}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong> Referral Case:</strong>{" "}
                      {selectedPatient.PatientRefNo}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Reffered By:</strong>{" "}
                      {selectedPatient.CountyWardName}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Date of Registration :</strong>{" "}
                      {selectedPatient.DateRegistered}
                    </p>
                  </div>
                </Card>
                <Card bordered={false} className="card-header mt-4">
                  <div className="">
                    <Typography.Title level={5} style={{ color: "#003F6D" }}>
                      Consultation Details
                    </Typography.Title>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Clinic:</strong> {selectedPatient.SpecialClinics}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong>Doctor:</strong>{" "}
                      {selectedPatient.ExaminingOfficer}
                    </p>
                    <p className="d-flex align-items-center gap-4">
                      <strong> Referral Case:</strong>{" "}
                      {selectedPatient.PatientRefNo}
                    </p>

                    <p className="d-flex align-items-center gap-4">
                      <strong>Last Visit Date :</strong>{" "}
                      {selectedPatient.LastBillingDate}
                    </p>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={6}>
                <Card style={{ width: "100%" }} className="card-header">
                  <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                    Patient Info
                  </Typography.Title>
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    {/* Display Avatar with Initials */}
                    <Avatar
                      size={100}
                      style={{
                        backgroundColor: "#87d068",
                        fontSize: "2rem",
                      }}
                    >
                      {(() => {
                        const nameParts =
                          selectedPatient.SearchName?.split(" ") || [];
                        if (nameParts.length >= 3) {
                          return `${nameParts[0].charAt(
                            0
                          )}${nameParts[1].charAt(0)}`.toUpperCase();
                        } else if (nameParts.length >= 1) {
                          return `${nameParts[0].charAt(0)}`.toUpperCase();
                        }
                        return ""; // Default if no name is present
                      })()}
                    </Avatar>
                  </div>

                  {/* Display Patient Details */}
                  <div className="d-flex flex-column align-items-start mb-3 text-muted">
                    <div className="d-flex flex-row justify-content-between w-100">
                      <Typography.Text
                        style={{ fontSize: "0.9rem", fontWeight: "medium" }}
                      >
                        Consultation Date:
                      </Typography.Text>
                      <Typography.Text
                        style={{ fontSize: "0.9rem" }}
                        className="text-muted"
                      >
                        {moment().format("DD/MM/YYYY")}
                      </Typography.Text>
                    </div>
                  </div>
                  <div className="d-block mt-4 justify-content-between">
                    {/* Payment Type Field */}
                    <Form.Item
                      label="Payment Type:"
                      rules={[
                        {
                          required: true,
                          message: "Please select Payment Type",
                        },
                      ]}
                      style={{ width: "100%" }}
                    >
                      <Select
                        placeholder="Select Payment Mode"
                        className="w-100"
                        value={selectedPatient.PatientType}
                        onChange={(value) =>
                          setSelectedPatient({
                            ...selectedPatient,
                            PatientType: value,
                          })
                        }
                        disabled={false} // Always enabled for editing
                      >
                        <Select.Option value="1">Cash</Select.Option>
                        <Select.Option value="2">Corporate</Select.Option>
                      </Select>
                    </Form.Item>

                    {/* Conditionally render insurance fields based on PatientType */}
                    <div className="mt-4">
                      {/* Insurance Name */}
                      <Form.Item
                        label="Insurance Name:"
                        name="insuranceNo"
                        rules={[
                          {
                            required: selectedPatient.PatientType === "2",
                            message: "Please select Insurance Name",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Select
                          placeholder="Select Insurance "
                          className="w-100 "
                          value={selectedPatient.insuranceName}
                          onChange={(value) =>
                            handleSelectChange("insuranceName", value)
                          }
                          // variant="borderless"
                          name="insuranceName"
                          onFocus={handleDisplayDropDown} // Trigger dropdown display when focused
                          disabled={selectedPatient.PatientType !== "2"}
                        >
                          <Select.Option value="">
                            --Select Insurance--
                          </Select.Option>
                          {insurancePayload && insurancePayload.length > 0 ? (
                            insurancePayload.map((insurance) => (
                              <Select.Option
                                key={insurance.No}
                                value={insurance.No}
                              >
                                {insurance.Name}
                              </Select.Option>
                            ))
                          ) : (
                            <Select.Option value="" disabled>
                              No data available
                            </Select.Option>
                          )}
                        </Select>{" "}
                      </Form.Item>

                      {/* Principal Member Name and Membership Number */}
                      <div className="row g-3 align-items-center justify-content-center">
                        <div className="col-12 col-md-6 text-primary">
                          <Form.Item
                            label="Principal  Name:"
                            name="insurancePrinicipalMemberName"
                            rules={[
                              {
                                required: selectedPatient.PatientType === "2",
                                message: "Please enter Principal Member Name",
                              },
                            ]}
                            style={{ width: "100%" }}
                          >
                            <Input
                              placeholder="Enter Principal Member Name"
                              name="insurancePrinicipalMemberName"
                              value={
                                selectedPatient.insurancePrinicipalMemberName
                              }
                              onChange={handleInputChange}
                              disabled={
                                selectedPatient.PatientType !== "2" ||
                                selectedPatient.insurancePrinicipalMemberName
                              } // Disable if not Corporate or auto-populating
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12 col-md-6 text-primary">
                          <Form.Item
                            label="Membership No:"
                            name="membershipNo"
                            rules={[
                              {
                                required: selectedPatient.PatientType === "2",
                                message: "Please enter Membership Number",
                              },
                            ]}
                            style={{ width: "100%" }}
                          >
                            <Input
                              placeholder="Enter Membership Number"
                              name="membershipNo"
                              value={selectedPatient.membershipNo}
                              onChange={handleInputChange}
                              disabled={selectedPatient.PatientType !== "2"} // Disable if not Corporate
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap flex-md-nowrap gap-2 flex-row align-items-center">
                    <Button
                      type="primary"
                      style={{ width: "100%", marginBottom: "18px" }}
                      // onClick={handleCreateVisit}
                      ghost
                    >
                      Edit Patient Details
                    </Button>
                    <Button
                      type="primary"
                      style={{ width: "100%", marginBottom: "18px" }}
                      onClick={handleTriageDispatch}
                    >
                      Dispatch to Triage
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
            <div>
              <Row gutter={[16, 16]} className="mt-4" align="middle">
                <Col xs={24} md={18}>
                  <Card
                    className="card-header"
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        {/* Card Header Left Section */}
                        <Typography.Title
                          level={5}
                          style={{ margin: 0, color: "#ED1C24" }}
                        >
                          Patient History
                        </Typography.Title>

                        {/* Toggle Button in Header */}
                        <div
                          onClick={toggleRowVisibility}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            color: "#ED1C24",
                          }}
                        >
                          <span style={{ marginRight: 8 }}>
                            {isRowVisible ? "Close" : "View Details"}
                          </span>
                          {isRowVisible ? (
                            <UpOutlined style={{ fontSize: "16px" }} />
                          ) : (
                            <DownOutlined style={{ fontSize: "16px" }} />
                          )}
                        </div>
                      </div>
                    }
                    style={{ width: "100%", maxHeight: "400px", overflowY: "auto", scrollbarWidth: "thin" }}

                  >
                    {isRowVisible && (
                      <div className="d-flex flex-column align-items-center justify-content-center">
                      {/* Display Avatar with Initials */}
                      <Table
                        columns={columns}
                        dataSource={patientsToDisplay}
                        loading={loading}
                        pagination={false}
                        rowKey={(record) => record.id || Math.random()}
                        locale={{
                          emptyText: "No data available",
                        }}
                      />
                    </div>
                    )}
                  </Card>
                </Col>
                <Col xs={24} md={6}>
                  <Card style={{ width: "100%" }} className="card-header mt-4">
                    <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                      Patient Billing Details
                    </Typography.Title>
                    <div className="d-flex gap-2 flex-column">
                      <div>
                        {/* Mode of Payment Section */}
                        <Typography.Text className="fw-medium">
                          Mode of Payment:
                          <Typography.Text className="text-muted px-2">
                            {selectedPatient.PatientType === "1"
                              ? "Cash"
                              : selectedPatient.PatientType === "2"
                              ? "Corporate"
                              : "N/A"}
                          </Typography.Text>
                        </Typography.Text>

                        {/* Insurance Name Section (only if PatientType is Corporate) */}
                        {selectedPatient.PatientType === "2" && (
                          <div className="mt-2">
                            <Typography.Text className="fw-medium">
                              Insurance Name:
                              <Typography.Text className="text-muted px-2">
                                {selectedPatient.InsuranceName || "N/A"}
                              </Typography.Text>
                            </Typography.Text>
                          </div>
                        )}
                      </div>

                      {/* <Typography.Text className="fw-medium">
                        Visit Type:
                        <Typography.Text className="text-muted">
                          {selectedPatient.paymentMode === "1"
                            ? "Cash"
                            : selectedPatient.paymentMode === "2"
                            ? "Insurance"
                            : "N/A"}
                        </Typography.Text>
                      </Typography.Text> */}
                      <Typography.Text className="fw-medium">
                        Billing:
                        <Typography.Text className="text-muted">
                          {selectedPatient.patientType}
                        </Typography.Text>
                      </Typography.Text>
                      <Typography.Text className="fw-medium">
                        Total Amount:
                        <Typography.Text className="text-muted  ">
                          {selectedPatient.TotalBilled
                            ? selectedPatient.TotalBilled
                            : "0"}
                        </Typography.Text>
                      </Typography.Text>
                    </div>
                    <div className="d-flex my-2 flex-row align-items-center">
                      <Button
                        type="primary"
                        style={{ width: "100%" }}
                        // onClick={handleUploadClick}
                      >
                        Bill Patient
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
            <Button
              icon={<CheckSquareOutlined />}
              onClick={() => handleDispatch(record)}
              type="primary"
              style={{ marginTop: "18px" }}
            >
              Create Visit
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActivePatientList;

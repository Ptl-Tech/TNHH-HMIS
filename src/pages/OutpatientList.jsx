import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTriageVisit, listPatients } from "../actions/patientActions";
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
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  PlusOutlined,
  EyeOutlined,
  SendOutlined,
  FileAddOutlined,
  TeamOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Search } = Input;

const OutpatientList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, patients } = useSelector(
    (state) => state.patientList
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

  useEffect(() => {
    dispatch(listPatients());
  }, [dispatch]);

  useEffect(() => {
    if (patients.length) {
      handleFilterPatients();
    }
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
        patient.LastName.toLowerCase().includes(
          searchParams.lastName.toLowerCase()
        ) &&
        patient.IDNumber.includes(searchParams.patientId) &&
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
  };

  const handleDisplayDropDown=(e) => {
    setSearchParams((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    handleFilterPatients();
  }
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

  const totalPatients = filteredPatients.length;
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalPatients);
  const patientsToDisplay = filteredPatients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      sorter: (a, b) => a.PatientNo - b.PatientNo,
    },
    {
      title: "First Name",
      dataIndex: "Names",
      key: "Names",
      sorter: (a, b) => a.Names.localeCompare(b.Names),
    },
    {
      title: "Last Name",
      dataIndex: "LastName",
      key: "LastName",
      sorter: (a, b) => a.LastName.localeCompare(b.LastName),
    },
    { title: "Gender", dataIndex: "Gender", key: "Gender" },
    { title: "Patient Type", dataIndex: "PatientType", key: "PatientType" },
    { title: "ID Number", dataIndex: "IDNumber", key: "IDNumber" },
    {
      title: "Date Registered",
      dataIndex: "DateRegistered",
      key: "DateRegistered",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.DateRegistered) - new Date(b.DateRegistered),
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
    <div className="container">
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Patient List
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
        title="Patient Details"
        footer={
          <>
            <Button onClick={handleOk}>Close</Button>
          </>
        }
        width={1200}
        style={{ top: 20 }}
      >
        {selectedPatient && (
          <div className="container">
            <Row gutter={16}>
              <Col xs={24} md={7}>
                {/* <Typography.Title
          level={3}
          style={{ color: "#E89641", padding: "8px" }}
        >
          Patient Registration
        </Typography.Title> */}
               <Card bordered={false} className="card-header">
                  <div>
                    <p>
                      <strong>Patient No:</strong> {selectedPatient.PatientNo}
                    </p>
                    <p>
                      <strong>Names:</strong> {selectedPatient.SearchName}
                    </p>
                    <p>
                      <strong>Gender:</strong> {selectedPatient.Gender}
                    </p>
                    <p>
                      <strong>Patient Type:</strong>{" "}
                      {selectedPatient.PatientType}
                    </p>
                    <p>
                      <strong>ID Number:</strong> {selectedPatient.IDNumber}
                    </p>
                    <p>
                      <strong>Date Registered:</strong>{" "}
                      {new Date(
                        selectedPatient.DateRegistered
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </Card>  

                
              </Col>
              <Col xs={24} md={11}>
                  <Card bordered={false} className="card-header">
                    <Typography.Title level={5} style={{ color: "#003F6D" }}>
                      Contact Information
                    </Typography.Title>
                    <Form layout="vertical" onFinish={handleSubmit}>
                      <Form.Item
                        label="Phone Number:"
                        name="phoneNumber"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your phone number",
                          },
                          {
                            validator: (_, value) => {
                              // Validate length based on whether the input starts with '254'
                              if (
                                value.startsWith("254") &&
                                value.length === 12
                              ) {
                                return Promise.resolve();
                              } else if (
                                !value.startsWith("254") &&
                                value.length === 10
                              ) {
                                return Promise.resolve();
                              }

                              return Promise.reject(
                                new Error(
                                  "Phone number must be 10 or 12 digits long"
                                )
                              );
                            },
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input
                          placeholder="Enter phone number "
                          name="phoneNumber"
                          value={selectedPatient.TelephoneNo1}
                          onChange={(e) =>
                            setSelectedPatient((prev) => ({
                              ...prev,
                              phoneNumber: e.target.value,
                            }))
                          }
                              
                              />
                      </Form.Item>

                      <div className="d-flex gap-2 justify-content-between">
                        <Form.Item
                          name="gender"
                          label="Gender"
                          style={{ width: "100%" }}
                          rules={[
                            {
                              required: true,
                              message: "Please select your gender!",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select Nationality"
                            className="w-100"
                            value={selectedPatient.Nationality}
                            onChange={(e) =>
                              setSelectedPatient((prev) => ({
                                ...prev,
                                Nationality: e,
                              }))
                            }
                          >
                           
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name="dob"
                          label="Date of Birth"
                          rules={[
                            {
                              required: true,
                              message: "Please input your date of birth!",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <DatePicker
                            format="YYYY-MM-DD"
                            style={{ width: "100%" }}
                            placeholder="Select Date of Birth"
                            name="dob"
                            defaultValue={moment()} // Set default date to current date
                            value={
                              selectedPatient.dob ? moment(selectedPatient.dob) : null
                            }
                            onChange={(date, dateString) =>
                              handleDateChange(date, dateString)
                            }
                          />
                          {dobError && (
                            <span style={{ color: "red" }}>{dobError}</span>
                          )}

                          {age !== null && (
                            <div className="text-success">
                              Age: {age.years} years {age.months} months
                            </div>
                          )}
                        </Form.Item>
                      </div>
                      <div className="d-flex gap-2 justify-content-between">
                        <Form.Item
                          name="idNumber"
                          label="ID/Passport/Birth No:"
                          style={{ width: "100%" }}
                          rules={[
                            {
                              required: true,
                              message:
                                "Please input your ID/Passport/Birth No!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value) {
                                  return Promise.resolve();
                                }
                                const isRegistered = patientListPayload?.some(
                                  (patient) => patient.IDNumber === value
                                );
                                if (isRegistered) {
                                  return Promise.reject(
                                    new Error(
                                      "This ID/Passport/Birth No is already registered."
                                    )
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <Input
                            placeholder="ID/Passport/Birth No:"
                            name="idNumber"
                            value={selectedPatient.idNumber}
                            onChange={handleInputChange}
                          />
                        </Form.Item>

                        <Form.Item
                          name="nationality"
                          label="Nationality"
                          rules={[
                            {
                              required: true,
                              message: "Please input your nationality!",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Select
                            placeholder="Select Nationality"
                            className="w-100 "
                            value={selectedPatient.nationality}
                            onChange={(value) =>
                              handleSelectChange("nationality", value)
                            }
                            // variant="borderless"
                            name="nationality"
                            onFocus={handleDisplayDropDown} // Trigger dropdown display when focused
                          >
                           
                          </Select>{" "}
                        </Form.Item>
                      </div>
                      <div className="d-flex gap-2 justify-content-between">
                        <Form.Item
                          label="County:"
                          name="county"
                          rules={[
                            {
                              required: true,
                              message: "Please select County",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Select
                            placeholder="Select County"
                            className="w-100 "
                            value={selectedPatient.county}
                            onChange={(value) =>
                              handleSelectChange("county", value)
                            }
                            onFocus={handleDisplayDropDown}
                          >
                           
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="Sub County:"
                          name="subCounty"
                          rules={[
                            {
                              required: true,
                              message: "Please select nationality",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Select
                            placeholder="Select Sub County"
                            className="w-100"
                            value={selectedPatient.nationality}
                            onChange={(value) =>
                              handleSelectChange("county", value)
                            }
                            onFocus={handleDisplayDropDown}
                          >
                           
                          </Select>
                        </Form.Item>
                      </div>
                      <div className="d-flex gap-2 justify-content-between">
                        <Form.Item
                          label="Residence:"
                          name="residence"
                          rules={[
                            {
                              required: true,
                              message: "Enter your residence",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            placeholder="Enter Residence"
                            name="residence"
                            value={selectedPatient.residence}
                            onChange={(e) => handleInputChange("residence", e)}
                            className=" "
                          />
                        </Form.Item>
                        <Form.Item
                          name="address"
                          label="Address"
                          rules={[
                            {
                              required: true,
                              message: "Please input your address!",
                            },
                          ]}
                          style={{ width: "100%" }}
                        >
                          <Input
                            placeholder="Address"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </div>
                    </Form>
                  </Card>
                </Col>
                
            </Row>
            <Button
                  icon={<CheckSquareOutlined />}
                  onClick={() => handleDispatch(record)}
                  type="primary"
                >
                  Create Visit
                </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OutpatientList;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTriageVisit, listPatients, postTriageVisit } from "../actions/patientActions";
import {
  listClinics,
  listDoctors,
  listInsuranceOptions,
} from "../actions/DropdownListActions";
import {
  PlusOutlined,
  EyeOutlined,
  TeamOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Tooltip,
  Typography,
  Modal,
  Form,
  Select,
  message,
} from "antd";
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
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  const [isVisitCreated, setIsVisitCreated] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [newVisit, setNewVisit] = useState({
    patientNo: "",
    clinic: "",
    doctor: "",
  });

  const {
    loading: clinicsLoading,
    error: clinicsError,
    success: clinicsSuccess,
    clinics: clinicsPayload,
  } = useSelector((state) => state.clinics);

  const {
    loading: doctorsLoading,
    error: doctorsError,
    success: doctorsSuccess,
    data: doctorsPayload,
  } = useSelector((state) => state.getDoctorsList);

  const [form] = Form.useForm();
 

  useEffect(() => {
    if (patients.length) {
      handleFilterPatients();
    }
  }, [patients, searchParams]);

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setShowList(true);
  };

  const handleDisplayDropDown = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    handleFilterPatients();

    if (
      name === "clinic" &&
      clinicsPayload &&
      name === "doctor" &&
      doctorsPayload
    ) {
      dispatch(listClinics());
      dispatch(listDoctors());
    }
  };

  const handleCreateVisit = async() => {
    // Logic for creating a visit
    console.log("Visit created!", newVisit);
    const visitData = {
      patientNo: selectedPatient.PatientNo,
      clinic: newVisit.clinic,
      doctor: newVisit.doctor,
    };
    const appointmentId = await dispatch(createTriageVisit(visitData));

    if(appointmentId) {
      setAppointmentId(appointmentId);
      message.success("Visit created successfully.");
    }
    console.log("Appointment ID:", appointmentId);

    setIsVisitCreated(true);
  };

  const handleDispatchToTriage = () => {
    // Logic for dispatching to triage
    console.log("Dispatched to triage!", appointmentId);
    setIsVisitCreated(false); // Reset state if needed

    dispatch(postTriageVisit(appointmentId));

    if(appointmentId) {
      message.success("Patient dispatched to triage.");
    }
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

  const showModal = (patient) => {
    setSelectedPatient(patient);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setSelectedPatient(null);
  };
  const toggleEditMode = () => setIsEditing((prev) => !prev);

  useEffect(() => {
    dispatch(listClinics());
    dispatch(listDoctors());
  }, [dispatch]);


  useEffect(() => {
    const branchCode = localStorage.getItem("branchCode"); // Fetch branch code from localStorage
  
    if (branchCode && doctorsPayload) {
      // Determine the clinic to filter by
      const clinicToFilterBy = selectedPatient?.SpecialClinics || newVisit.clinic; 
  
      // Filter doctors based on specialization and branch
      const filtered = doctorsPayload.filter(
        (doctor) =>
          doctor.Specialization === clinicToFilterBy && // Match specialization with the clinic
          doctor.GlobalDimension1Code === branchCode // Match branch code
      );
  
      setFilteredDoctors(filtered); // Update the filtered doctors list
    }
  }, [
    doctorsPayload,
    selectedPatient?.SpecialClinics,
    newVisit.clinic, // Include the new visit clinic in dependency
    filteredDoctors,
  ]);
  
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
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
              View Details
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleselectedPatient = () => {
    navigate("/reception/Patient-Registration");
  };

  return (
   
   <div>
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
              onSearch={handleFilterPatients}
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
        <div className="mt-4">
          <Table
            columns={columns}
            dataSource={filteredPatients}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
      {/* Modal for Patient Details */}
      <Modal
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Title level={5} style={{ color: "#0f5689" }}>
              Patient Details
            </Typography.Title>
            <Button
              type="primary"
              onClick={toggleEditMode}
              style={{
                marginBottom: "10px",
                float: "right",
                marginRight: "10px",
              }}
              icon={
                isEditing ? (
                  <CloseOutlined style={{ color: "red" }} />
                ) : (
                  <EditOutlined style={{ color: "green" }} />
                )
              }
              ghost
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          <div className="d-flex justify-content-end align-items-center mt-4">
            {!isEditing && !isVisitCreated && (
              <Button
                type="primary"
                onClick={handleCreateVisit}
                style={{ float: "right", marginRight: "10px" }}
              >
                Create Visit
              </Button>
            )}
            {isEditing && (
              <Button
                type="primary"
                // onClick={handleSave} Add logic for saving edited patient details
                style={{ float: "right", marginRight: "10px" }}
              >
                Save
              </Button>
            )}
            {isVisitCreated && (
              <Button
                type="primary"
                onClick={handleDispatchToTriage}
                style={{ float: "right", marginRight: "10px" }}
              >
                Dispatch to Triage
              </Button>
            )}
            <Button
              type="primary"
              onClick={handleCancel}
              style={{ float: "right" }}
            >
              Close
            </Button>
          </div>
        }
        width={1200}
        style={{ top: 20, height: "auto" }}
      >
        {selectedPatient && (
          <div>
            <div className="row">
              <div className="col-12 col-md-3">
                <Card className="card-header h-100 ">
                  <Form layout="vertical">
                    <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                      General Information
                    </Typography.Title>
                    <Form.Item label="Patient No" style={{ width: "100%" }}>
                      <Input
                        value={selectedPatient.PatientNo}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Patient Name">
                      <Input
                        value={selectedPatient.SearchName}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Gender">
                      <Input
                        value={selectedPatient.Gender}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="ID Number">
                      <Input
                        value={selectedPatient.IDNumber}
                        disabled={!isEditing}
                      />
                    </Form.Item>

                    <Form.Item label="Date of Birth">
                      <Input
                        value={moment(selectedPatient.DateOfBirth).format(
                          "YYYY-MM-DD"
                        )}
                        disabled={!isEditing}
                      />
                      <span style={{ color: "green" }}>
                        {`Age: ${moment().diff(
                          moment(selectedPatient.DateOfBirth),
                          "years"
                        )} years and ${
                          moment().diff(
                            moment(selectedPatient.DateOfBirth),
                            "months"
                          ) % 12
                        } months`}
                      </span>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
              <div className="col-12 col-md-6">
                <Card className="card-header">
                  <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                    Contact Information
                  </Typography.Title>
                  <Form layout="vertical">
                    <Form.Item label="Phone Number">
                      <Input
                        value={selectedPatient.TelephoneNo1}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Sub County">
                      <Input
                        value={selectedPatient.SubCountyName}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Form>
                </Card>
                <Card className="card-header mt-3 " style={{ height: "480px" }}>
                  <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                    Emergency Contact
                  </Typography.Title>
                  <Form layout="vertical">
                    <Form.Item label=" Next of Kin Name">
                      <Input
                        value={selectedPatient.NextOfkinFullName}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Relationship">
                      <Input
                        value={selectedPatient.NextofkinRelationship}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Phone Number">
                      <Input
                        value={selectedPatient.NextOfkinAddress1}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Form>
                </Card>
              </div>
              <div className="col-12 col-md-3">
                <Card className="card-header">
                  <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                    Consultation Details
                  </Typography.Title>
                  <Form layout="vertical">
                    <Form.Item label="Patient Type">
                      <Input
                        value={selectedPatient.PatientType}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Clinic" name="clinic">
                      {isVisitCreated ? (
                        <Input
                          value={selectedPatient.SpecialClinics}
                          disabled={!isEditing}
                        />
                      ) : (
                        <Select
                          value={selectedPatient.SpecialClinics || ""}
                          name="clinic"
                          onChange={(value) =>
                            setNewVisit((prev) => ({
                              ...prev,
                              clinic: value,
                            }))
                          }
                          style={{ width: "100%" }}
                          onFocus={handleDisplayDropDown}
                          // disabled={!isEditing}
                        >
                          <Select.Option value="">Select Clinic</Select.Option>
                          {clinicsPayload.map((clinic) => (
                            <Select.Option key={clinic.No} value={clinic.No}>
                              {clinic.Description}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="Doctor" name="doctor">
                      <Select
                        value={selectedPatient.doctor || ""} // Use empty string as default if no doctor is selected
                        onChange={(value) =>
                          setNewVisit((prev) => ({
                            ...prev,
                            doctor: value,
                          }))
                        }
                        style={{ width: "100%" }}
                        onFocus={handleDisplayDropDown}
                      >
                       <Select.Option value="">--Select Doctor--</Select.Option>
                    {filteredDoctors &&
                      filteredDoctors.map((doc) => (
                        <Select.Option key={doc.DoctorID} value={doc.DoctorID}>
                          {doc.DoctorsName}
                        </Select.Option>
                      ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </Card>
                <Card className="card-header mt-3">
                  <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                    Billing Information
                  </Typography.Title>
                  <Form layout="vertical">
                    <Form.Item label="Patient Type">
                      {selectedPatient.PatientType === "Cash" ? (
                        <Input value="Cash" disabled={!isEditing} />
                      ) : (
                        <Input value="Insurance" disabled={!isEditing} />
                      )}
                    </Form.Item>
                    {selectedPatient.PatientType === "Cash" ? (
                      <Form.Item label="Cash Amount">
                        <Input
                          value={selectedPatient.TotalBilled}
                          disabled={!isEditing}
                        />
                      </Form.Item>
                    ) : (
                      <>
                        <Form.Item label="Insurance Name">
                          <Input
                            value={selectedPatient.InsuranceName}
                            disabled={!isEditing}
                          />
                        </Form.Item>
                        <Form.Item label="Insurance Number">
                          <Input
                            value={selectedPatient.SchemeName}
                            disabled={!isEditing}
                          />
                        </Form.Item>
                        <Form.Item label="Debtor Amount">
                          <Input
                            value={selectedPatient.DebtorAccount}
                            disabled={!isEditing}
                          />
                        </Form.Item>
                        <Form.Item label="Total Amount">
                          <Input
                            value={selectedPatient.TotalBilled}
                            disabled={!isEditing}
                          />
                        </Form.Item>
                      </>
                    )}
                  </Form>
                </Card>
              </div>
            </div>
            {/* <div className="row mt-4">
              <div className="col-12 col-md-9">
                <Card className="card-header">
                  <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                    Insurance Information
                  </Typography.Title>
                  <Form layout="vertical">
                    <Form.Item label="Insurance Name">
                      <Input
                        value={selectedPatient.InsuranceName}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                    <Form.Item label="Insurance Number">
                      <Input
                        value={selectedPatient.InsuranceNo}
                        disabled={!isEditing}
                      />
                    </Form.Item>
                  </Form>
                </Card>
              </div>
              <div className="col-12 col-md-3">
               
              </div>
            </div> */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OutpatientList;

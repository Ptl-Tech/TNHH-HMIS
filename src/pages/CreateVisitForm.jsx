import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Select,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  listDoctors,
  listInsuranceOptions,
  listClinics,
} from "../actions/DropdownListActions";
import { createTriageVisit, postTriageVisit } from "../actions/patientActions";

const CreateVisitForm = () => {
  const { state } = useLocation(); // Access the state passed via navigate
  const { patientData, existingPatient } = state || {}; // Destructure patient data if available
  const dispatch = useDispatch();
const navigate=useNavigate();
  const {
    loading: insuranceLoading,
    error: insuranceError,
    success: insuranceSuccess,
    data: insurancePayload,
  } = useSelector((state) => state.getInsurance);

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
  const {
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
    payload: visitPayload,
  } = useSelector((state) => state.createTriageVisit);

  const {
    loading: postTriageVisitLoading,
    error: postTriageVisitError,
    success: postTriageVisitSuccess,
    payload: postTriageVisitPayload,
  } = useSelector((state) => state.postTriageVisit);

  const [newVisit, setNewVisit] = useState({
    clinic: "",
    doctor: "",
    settlementType: "",
    insuranceName: "",
    membershipNo: "",
    patientType: "",
    appointmentType: "",
  });

  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    dispatch(listInsuranceOptions());
    dispatch(listClinics()); // Ensure clinics are loaded
    dispatch(listDoctors()); // Ensure doctors are loaded
  }, [dispatch]);

  useEffect(() => {
    console.log("State:", state);
    console.log("Patient Data:", patientData);
    console.log("Existing Patient Data:", existingPatient);
  }, [state, patientData, existingPatient]);

  useEffect(() => {
    const branchCode = localStorage.getItem("branchCode"); // Fetch branch code from localStorage
    if (branchCode && doctorsPayload) {
      const filtered = doctorsPayload.filter(
        (doctor) =>
          doctor.Specialization === newVisit.clinic && // Match specialization with selected clinic
          doctor.GlobalDimension1Code === branchCode // Match branch code
      );
      setFilteredDoctors(filtered); // Update the filtered doctors list
    }
  }, [doctorsPayload, newVisit.clinic]);

  const dispatchPatient = async (value) => {
    const visitData = {
      patientNo: patientData?.patientNo || existingPatient?.PatientNo,
      clinic: newVisit.clinic,
      doctor: newVisit.doctor,
    };
  
    try {
      // Create Triage Visit
      const appointmentId = await dispatch(createTriageVisit(visitData));
  
      if (!appointmentId) {
        message.error("Patient registration failed!");
        return;
      }
  
      // Post Triage Visit
  
      if (appointmentId) {
        await dispatch(postTriageVisit(appointmentId));

        message.success("Visit created successfully!");
         navigate("/reception/visitors-list");

        console.log("Triage visit created for Patient ID:", appointmentId);
      } else {
        message.error("Failed to post to triage!");
      }
    } catch (error) {
      console.error("Error dispatching patient:", error);
      message.error("An unexpected error occurred. Please try again.");
    }

    
  };
  

  const dispatchMenu = (
    <Menu onClick={(e) => dispatchPatient(e.key)}>
      <Menu.Item key="triage">Triage</Menu.Item>
      {/* <Menu.Item key="pharmacy">Pharmacy</Menu.Item> */}
     {/* <Menu.Item key="doctor">Doctor</Menu.Item> */}
    </Menu>
  );

  const handleInputChange = (field, value) => {
    if (field === "doctor") {
      setNewVisit((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewVisit((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Use the selected DoctorID to find the doctor for display
  const selectedDoctor = filteredDoctors.find(
    (doc) => doc.DoctorID === newVisit.doctor
  );

  return (
    <div>
      {patientData || existingPatient ? (
        <div>
          <div className="d-flex align-items-center pb-3 justify-content-between  w-100">
            <div className="div">
              <h4
                className="text-start px-3 "
                style={{ color: "#E89641" }}
                id="appointment-card"
              >
                Appointment Card
              </h4>
            </div>
            <div>
              <Dropdown overlay={dispatchMenu} trigger={["click"]}>
                <Button type="primary" size="large" className="pr-3 mr-3">
                  Dispatch Patient
                </Button>
              </Dropdown>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-8">
              <Card title="Patient Information" style={{ width: "100%" }}>
                <Form>
                  <div className="row px-3 py-2 align-items-center justify-content-between">
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Patient No:<span className="text-danger px-1">*</span>
                      </label>
                      <Input
                        label="Patient No"
                        value={
                          patientData?.patientNo || existingPatient?.PatientNo
                        }
                        disabled
                        className="text-success fw-bold"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        First Name:<span className="text-danger px-1">*</span>
                      </label>
                      <Input
                        label="First Name"
                        value={
                          patientData?.firstName ||
                          (typeof existingPatient?.SearchName === "string"
                            ? existingPatient.SearchName.split(" ")[0]
                            : "")
                        }
                        disabled
                        className="text-dark fw-medium"
                      />
                    </div>
                  </div>

                  <div className="row px-3 py-2 align-items-center justify-content-between">
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Last Name:<span className="text-danger px-1">*</span>
                      </label>
                      <Input
                        label="Last Name"
                        value={
                          patientData?.lastName || existingPatient?.LastName
                        }
                        disabled
                        className="text-dark fw-medium"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Patient Type:<span className="text-danger px-1">*</span>
                      </label>
                      <Input
                        label="Patient Type"
                        value={
                          patientData?.patientType ||
                          existingPatient?.PatientType
                        }
                        disabled
                        className="text-dark fw-medium"
                      />
                    </div>
                  </div>

                  <div className="row px-3 py-2 align-items-center justify-content-between">
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Settlement Type:
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Select
                        placeholder="Select Settlement Type"
                        className="w-100"
                        value={newVisit.settlementType}
                        onChange={(value) =>
                          handleInputChange("settlementType", value)
                        }
                      >
                        <Select.Option value="">--Select--</Select.Option>
                        <Select.Option value="2">Cash</Select.Option>
                        <Select.Option value="1">Insurance</Select.Option>
                      </Select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Insurance Name:
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Select
                        placeholder="Select Insurance"
                        className="w-100"
                        value={newVisit.insuranceName}
                        onChange={(value) =>
                          handleInputChange("insuranceName", value)
                        }
                        disabled={newVisit.settlementType !== "1"}
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
                      </Select>
                    </div>
                  </div>

                  <div className="row px-3 py-2 align-items-center justify-content-between">
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Membership No:
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Input
                        label="Membership No"
                        value={newVisit.membershipNo}
                        onChange={(e) =>
                          handleInputChange("membershipNo", e.target.value)
                        }
                        disabled={newVisit.settlementType !== "1"}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Clinic :<span className="text-danger px-1">*</span>
                      </label>
                      <Select
                        placeholder="Select Clinic"
                        className="w-100"
                        value={newVisit.clinic}
                        onChange={(value) => handleInputChange("clinic", value)}
                      >
                        <Select.Option value="">
                          --Select Clinic--
                        </Select.Option>
                        {clinicsPayload &&
                          clinicsPayload.map((clinic) => (
                            <Select.Option key={clinic.No} value={clinic.No}>
                              {clinic.Description}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                  </div>

                  <div className="row px-3 py-2 mb-2 align-items-center justify-content-between">
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Doctor:<span className="text-danger px-1">*</span>
                      </label>
                      <Select
                        placeholder="Select Doctor"
                        className="w-100"
                        value={newVisit.doctor} // This will hold the DoctorID
                        onChange={(value) => handleInputChange("doctor", value)} // Update DoctorID
                      >
                        <Select.Option value="">
                          --Select Doctor--
                        </Select.Option>
                        {filteredDoctors &&
                          filteredDoctors.map((doc) => (
                            <Select.Option
                              key={doc.DoctorID}
                              value={doc.DoctorID}
                            >
                              {doc.DoctorsName}
                            </Select.Option>
                          ))}
                      </Select>
                    </div>
                    {/* <div className="col-12 col-md-6">
                      <label className="py-1">
                        Appointment Type:
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Select
                        placeholder="Select Appointment Type"
                        className="w-100"
                        value={newVisit.appointmentType}
                        onChange={(value) =>
                          handleInputChange("appointmentType", value)
                        }
                      >
                        <Select.Option value="">--Select--</Select.Option>
                        <Select.Option value="NORMAL">Normal</Select.Option>
                        <Select.Option value="REVIEW">Review</Select.Option>
                        <Select.Option value="REVISIT">Revisit</Select.Option>
                      </Select>
                    </div> */}
                  </div>
                </Form>
              </Card>
            </div>
            <div className="col-12 col-md-4">
              <Card title="Billing Details" style={{ width: "100%" }}>
                <Form
                  name="basic"
                  initialValues={{ remember: true }}
                  autoComplete="off"
                >
                  <div className="row px-3 py-2 g-3 align-items-center">
                    <div className="d-flex my-4 align-items-center justify-content-center">
                      <Avatar
                        size={100}
                        style={{
                          backgroundColor: "#87d068",
                          fontSize: "2rem",
                          fontWeight: "bold",
                        }}
                      >
                        {`${
                          patientData?.firstName?.charAt(0) ||
                          existingPatient?.LastName?.charAt(0) ||
                          ""
                        }${
                          patientData?.lastName?.charAt(0) ||
                          existingPatient?.LastName?.charAt(1).toUpperCase() ||
                          ""
                        }`}
                      </Avatar>
                    </div>
                    {/* Add dynamic data fields for patientType, settlementType, clinic, doctor */}
                    <div className="col-12 mb-4">
                      <p>
                        <strong>Patient Type:</strong>{" "}
                        {patientData?.patientType ||
                          existingPatient?.PatientType ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Settlement Type:</strong>{" "}
                        {newVisit.settlementType === "1" ? "Insurance" : "Cash"}
                      </p>
                      <p>
                        <strong>Clinic:</strong> {newVisit.clinic || "N/A"}
                      </p>
                      <p>
                        <strong>Doctor:</strong>{" "}
                        {selectedDoctor ? selectedDoctor.DoctorsName : "N/A"}
                      </p>

                      <p>
                        <strong>Total Billed:</strong>{" "}
                        {newVisit.totalBilled || "0.00"}
                      </p>
                    </div>
                  </div>
                </Form>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <p>Patient data not available</p>
      )}
    </div>
  );
};

export default CreateVisitForm;

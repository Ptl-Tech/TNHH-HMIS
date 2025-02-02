import {
    Avatar,
    Button,
    Card,
    DatePicker,
    Form,
    Input,
    message,
    Select,
    Switch,
  } from "antd";
  import moment from "moment";
  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import {
    listCounties,
    listCountries,
    listInsuranceOptions,
    listKinsRelationships,
    listSubCounties,
    marketingStrategies,
  } from "../actions/DropdownListActions";
  import { useForm } from "antd/es/form/Form";
  import { createPatient, listPatients } from "../actions/patientActions";
  import { useLocation, useNavigate } from "react-router-dom";
  import { SaveOutlined } from "@ant-design/icons";
  const WalkinRegistration = () => {
   
    const {
      loading: patientListLoading,
      error: patientListError,
      success: patientListSuccess,
      patients: patientListPayload,
    } = useSelector((state) => state.patientList);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();

  
    const { state } = useLocation(); // Access the state passed via navigate
    const { visitorData, patientNumber, patientDet } = state || {}; // Destructure patient data if available
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [age, setAge] = useState(null); // State to hold calculated age
    const [dobError, setDobError] = useState(""); // State for DOB error message
    const [errors, setErrors] = useState({});
    const [newPatient, setNewPatient] = useState({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      dob: "",
      idNumber: "",
      phoneNumber: "",
      paymentMode: "",
      patientStatus: 0,
    });
    useEffect(() => {
      dispatch(listPatients());
    }, [dispatch]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewPatient((prev) => ({ ...prev, [name]: value }));
  
      if (name === "idNumber") {
        // Validate the idNumber immediately when it changes
        const isRegistered = patientListPayload?.some(
          (existingPatient) => existingPatient.IDNumber === value
        );
  
        // Update the errors state based on the ID number validation
        if (isRegistered) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            idNumber: "This Patient is already registered.",
          }));
        } else {
          setErrors((prevErrors) => {
            const { idNumber, ...rest } = prevErrors; // Remove the previous error
            return rest; // Return the remaining errors
          });
        }
      }
    };
  
    // Handle select and date changes
    const handleSelectChange = (name, value) => {
      // If the field is 'dob', format the value as 'YYYY-MM-DD'
      if (name === "dob") {
        // Format the date as 'YYYY-MM-DD'
        value = value ? moment(value).format("YYYY-MM-DD") : "";
      }
      setNewPatient((prev) => ({ ...prev, [name]: value }));
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
  
        setAge(null);
      } else {
        setDobError("");
        setAge({ years, months }); // Store years and months in the state
        setNewPatient((prev) => ({ ...prev, dob: dateString }));
      }
    };
  
    useEffect(() => {
      if (patientDet) {
        setNewPatient({
          idNumber: patientDet?.IDNumber || "",
          firstName: patientDet?.FirstName || "",
          middleName: patientDet?.MiddleName || "",
          lastName: patientDet?.LastName || "",
          gender: patientDet?.Gender==="Male" ? "1" : "2",
          dob: patientDet?.DateOfBirth || null,
          phoneNumber: patientDet?.TelephoneNo1 || "",
          email: patientDet?.Email || "",
          nationality: patientDet?.Nationality || "",
          county: patientDet?.CountyWardName || "",
          subCounty: patientDet?.SubCountyName || "",
          residence: patientDet?.Residence || "",
          nextOfKinFullName: patientDet?.NextOfkinFullName || "",
          nextOfKinRelationShip: patientDet?.NextofkinRelationship || "",
        });
      }
    }, [patientDet]);
    
    const handleSavePatient = async (e) => {
      e.preventDefault();
  
      // Determine the action (create or edit) based on the patientNumber
      const isEditAction = !!patientNumber && patientNumber.trim() !== "";
  
      // Prepare patient data
      const patientData = {
        firstName:
          newPatient.firstName ||
          visitorData.VisitorName?.split(" ")[0] ||
          visitorData?.firstName,
        lastName:
          newPatient.lastName ||
          visitorData.VisitorName?.split(" ")[2] ||
          visitorData?.lastName,
        middleName:
          newPatient.middleName ||
          visitorData.VisitorName?.split(" ")[1] ||
          visitorData?.middleName,
        idNumber: newPatient.idNumber || visitorData?.IDNumber,
        phoneNumber:
          newPatient.phoneNumber ||
          visitorData?.PhoneNumber ||
          patientDet?.TelephoneNo1,
        email: newPatient.email || patientDet?.Email,
        gender: newPatient.gender || patientDet.Gender,
        dob: newPatient.dob || patientDet.DateOfBirth,    
        myAction: isEditAction ? "edit" : "create",
        patientNo: patientNumber, // Include patientNo only if editing
      };
  
      // Validate the entire form
      const errors = validateForm(newPatient);
      setErrors(errors);
  
      // // If there are any validation errors, show a warning
      // if (Object.keys(errors).length > 0) {
      //   message.warning("Please fill in all required fields.");
      //   return;
      // }
  
      try {
        // Dispatch the patient creation or update action
        const responsedata = await dispatch(createPatient(patientData));
        const patientId = responsedata?.patientNo;
  
        if (patientId) {
          message.success("Patient Saved Successfully");
          // Navigate to Add Appointment page and pass patientId
          navigate(`/reception/Add-Appointment/${patientId}`, {
            state: { patientData: patientData },
          });
        } else {
          message.error("Failed to save patient data. Please try again.");
        }
  
        console.log(patientId);
      } catch (error) {
        console.error("Error saving patient data:", error);
        message.error("An unexpected error occurred. Please try again.");
      }
    };
  
    // Define the validateForm function
    const validateForm = (patient, visitorData, patientDet) => {
      const errors = {};
  
      // Nationality Validation
      if (!patient.nationality || patient.nationality.trim() === "") {
        errors.nationality = "Nationality is required.";
      }
  
      // Email Validation
      const email = patient.email || visitorData?.Email || newPatient.email;
      if (!email || email.trim() === "") {
        errors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Email must be a valid email address.";
      }
  
      // ID Number Validation
      if (patient.idNumber || visitorData?.IDNumber || patientDet?.IDNumber) {
        const isRegistered = patientListPayload?.some(
          (existingPatient) =>
            existingPatient.IDNumber === patient.idNumber ||
            visitorData?.IDNumber === patient.idNumber
        );
        if (isRegistered) {
          errors.idNumber = "This ID/Passport/Birth No is already registered.";
        }
      }
  
      return errors;
    };
  
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h4 style={{ textAlign: "center", color: "#E89641" }}>
            Walk-in Patient Registration {patientNumber || patientDet?.PatientNo}
          </h4>
          {/* if patientdet exists show edit button */}
          {patientDet && (
            <Button
              type="primary"
              style={{ margin: "20px" }}
              onClick={() => handleEditPatient(patientDet)}
            >
              Edit
            </Button>
          )}
        </div>
        <div className="row">
          <div className="col-12 col-md-8">
            <Card title="Patient Information" style={{ width: "100%" }}>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
                form={form}
              >
                <div className="row px-3 py-2  align-items-center justify-content-between">
                  <div className="col-12 col-md-4 ">
                    <label className="py-1">
                      ID/Passport/Birth No:
                      <span className="text-danger px-1 fs-6">*</span>
                    </label>
  
                    <Input
                      name="idNumber"
                      placeholder="ID Number"
                      style={{ width: "100%" }}
                      value={
                        newPatient.idNumber ||
                        visitorData?.IDNumber ||
                        patientDet?.IDNumber
                      }
                      onChange={handleInputChange}
                      className="text-center fw-bold"
                    />
                    {errors.idNumber && (
                      <span style={{ color: "red", fontSize: "0.875rem" }}>
                        {errors.idNumber}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="py-1">
                      First Name:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      name="firstName"
                      placeholder="First Name"
                      style={{ width: "100%" }}
                      value={
                        newPatient.firstName ||
                        visitorData?.VisitorName?.split(" ")[0] ||
                        patientDet?.SearchName?.split(" ")[0] ||
                        patientDet?.FirstName?.split(" ")[0]
                      }
                      onChange={handleInputChange}
                      className="text-center fw-bold"
                    />
                    {errors.firstName && (
                      <span style={{ color: "red", fontSize: "0.875rem" }}>
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="py-1">
                      Middle Name:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      name="middleName"
                      placeholder="Middle Name"
                      style={{ width: "100%" }}
                      value={
                        newPatient.middleName ||
                        visitorData?.VisitorName?.split(" ")[1] ||
                        patientDet?.SearchName?.split(" ")[1]
                      }
                      onChange={handleInputChange}
                      className="text-center fw-bold"
                    />
                    {errors.middleName && (
                      <span style={{ color: "red", fontSize: "0.875rem" }}>
                        {errors.middleName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="row px-3 py-2  align-items-center justify-content-between">
                  <div className="col-12 col-md-4">
                    <label className="py-1">
                      Last Name:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      style={{ width: "100%" }}
                      value={
                        newPatient.lastName ||
                        visitorData?.VisitorName?.split(" ")[2] ||
                        patientDet?.SearchName?.split(" ")[2]
                      }
                      onChange={handleInputChange}
                      className="text-center fw-bold"
                    />
                  </div>
                  <div className="col-12 col-md-4 ">
                    <label className="py-1">
                      Gender:
                      <span className="text-danger px-1 fs-6">*</span>
                    </label>
                    <Select
                      placeholder="--Select Gender--"
                      className="w-100 text-center fw-bold"
                      value={
                        newPatient.gender ||
                        visitorData?.Gender ||
                        patientDet?.Gender
                      }
                      onChange={(value) => handleSelectChange("gender", value)}
                    >
                      <Select.Option value="">--Select Gender-- </Select.Option>
                      <Select.Option key={1} value={1}>
                        Male
                      </Select.Option>
                      <Select.Option key={2} value={2}>
                        Female
                      </Select.Option>
                    </Select>{" "}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="py-1">
                      Date of Birth:<span className="text-danger px-1">*</span>
                    </label>
                    <DatePicker
                      format="YYYY-MM-DD"
                      style={{ width: "100%" }}
                      placeholder="Select Date of Birth"
                      //defaultValue={moment()} // Set default date to current date
                      value={
                        newPatient.dob
                          ? moment(newPatient.dob) ||
                            visitorData?.dateOfBirth ||
                            patientDet?.DateOfBirth
                          : null
                      }
                      onChange={(date, dateString) =>
                        handleDateChange(date, dateString)
                      }
                      className="text-center fw-bold"
                    />
                    {dobError && <span style={{ color: "red" }}>{dobError}</span>}
                    {age !== null && (
                      <div className="text-success">
                        Age: {age.years} years {age.months} months
                      </div>
                    )}{" "}
                  </div>
                </div>
                <div className="row px-3 py-2 align-items-center justify-content-between">
                  <div className="col-12 col-md-4">
                    <label className="py-1">
                      Phone Number:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      placeholder="Enter phone number"
                      name="phoneNumber"
                      value={
                        newPatient.phoneNumber ||
                        visitorData?.PhoneNumber ||
                        patientDet?.TelephoneNo1
                      }
                      onChange={handleInputChange}
                      className="text-center fw-bold"
                    />
                    {errors.phoneNumber && (
                      <span style={{ color: "red", fontSize: "0.875rem" }}>
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </Form>

              <div className="d-flex align-items-center mt-3 mb-4">

                <Button
                type="primary"
                className="mx-2"
                onClick={handleSavePatient}
                icon={<SaveOutlined />}
                // loading={savingPatient}
                >
                Save Walk-in Patient
                </Button>
                <Button
                            onClick={() =>
                              navigate(-1
                                           )
                            }
                          >
                            Back
                          </Button>
            </div>

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
                  <div className="d-flex my-3 align-items-center justify-content-center">
                    <Avatar
                      size={100}
                      style={{
                        backgroundColor: "#87d068",
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {`${
                        newPatient.firstName?.charAt(0).toUpperCase() ||
                        visitorData?.VisitorName?.split(" ")[0]
                          ?.charAt(0)
                          .toUpperCase() ||
                        ""
                      }${
                        newPatient.lastName?.charAt(0).toUpperCase() ||
                        visitorData?.VisitorName?.split(" ")[1]
                          ?.charAt(0)
                          .toUpperCase() ||
                        "" ||
                        visitorData?.VisitorName?.split(" ")[2]
                          ?.charAt(0)
                          .toUpperCase() ||
                        ""
                      }`}
                    </Avatar>
                  </div>
                  <div className="col-12">
                    <label className="py-1">
                      Patient Type:<span className="text-danger px-1">*</span>
                    </label>
                    <Select
                    style={{ marginBottom: "20px" }}
                      placeholder="Select Payment Mode"
                      className="w-100"
                      value={newPatient.paymentMode || patientDet?.PatientType}
                      onChange={(value) =>
                        handleSelectChange("paymentMode", value)
                      }
                    >
                      <Select.Option value="">--Select--</Select.Option>
                      <Select.Option value="2">Cash</Select.Option>
                    </Select>
                  </div>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      </div>
    );
  };
  
  export default WalkinRegistration;
  
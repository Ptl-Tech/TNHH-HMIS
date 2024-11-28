import {
  Button,
  DatePicker,
  Input,
  Select,
  Form,
  message,
  Spin,
  Switch,
  Row,
  Col,
  Card,
  Typography,
  Avatar,
} from "antd";
import {
  relationshipOptions,
  PatientypeOptions,
  InsuranceOptions,
} from "../constants/DropDownConstants";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPatient,
  createTriageVisit,
  listPatients,
  postTriageVisit,
} from "../actions/patientActions";
import {
  listClinics,
  listCounties,
  listCountries,
  listDoctors,
  listInsuranceOptions,
  listKinsRelationships,
  listSubCounties,
} from "../actions/DropdownListActions";

import moment from "moment"; // Ensure you import moment
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";

const PatientRegistration = () => {
  const dispatch = useDispatch();
  const createPatientState = useSelector((state) => state.createPatient);
  const { loading, error, success } = createPatientState;
  const navigate = useNavigate();
  const form = useForm();
  const createTriageVisitState = useSelector(
    (state) => state.createTriageVisit
  );

  const {
    loading: postTriageVisitLoading,
    error: postTriageVisitError,
    success: postTriageVisitSuccess,
  } = useSelector((state) => state.postTriageVisit);
  const {
    loading: countriesLoading,
    error: countriesError,
    success: countriesSuccess,
    countries: countriesPayload,
  } = useSelector((state) => state.countriesList);

  const {
    loading: relationshipOptionsLoading,
    error: relationshipOptionsError,
    success: relationshipOptionsSuccess,
    data: relationshipOptionsPayload,
  } = useSelector((state) => state.kinsRelations);

  const {
    loading: countiesLoading,
    error: countiesError,
    success: countiesSuccess,
    counties: countiesPayload,
  } = useSelector((state) => state.countiesList);

  const {
    loading: subCountiesLoading,
    error: subCountiesError,
    success: subCountiesSuccess,
    subCounties: subCountiesPayload,
  } = useSelector((state) => state.subCounties);

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
    doctors: doctorsPayload,
  } = useSelector((state) => state.getDoctorsList);

  const {
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
    payload: visitPayload,
  } = createTriageVisitState;

  const {
    loading: patientListLoading,
    error: patientListError,
    success: patientListSuccess,
    patients: patientListPayload,
  } = useSelector((state) => state.patientList);

  const {
    loading: insuranceLoading,
    error: insuranceError,
    success: insuranceSuccess,
    data: insurancePayload,
  } = useSelector((state) => state.getInsurance);

  const [age, setAge] = useState(null); // State to hold calculated age
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [newPatient, setNewPatient] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    idNumber: "",
    gender: 0,
    dob: "",
    phoneNumber: "",
    paymentMode: 0,
    nextOfKinFullName: "",
    nextOfKinRelationship: "",
    nextOfKinPhoneNo: "",
    patientType: "",
    insuranceNo: "",
    insuranceName: "",
    insurancePrinicipalMemberName: "",
    isPrincipleMember: false,
    membershipNo: "",
    nationality: "",
    county: "",
    schemeName: "",
    howYouKnewABoutUs: "",
    doctor: "",
    clinic: "",
    subCounty: "",
    residence: "",
    patientStatus: 0,
  });

  const [patientId, setPatientId] = useState(null);
  const [dobError, setDobError] = useState(""); // State for DOB error message
  const [appointmentId, setAppointmentId] = useState(null);

  // Handle dropdown display for fetching country list
  const handleDisplayDropDown = (e) => {
    const { name, value } = e.target;

    // Fetch country list if nationality dropdown is selected
    if (
      name === "nationality" &&
      countriesPayload &&
      name === "county" &&
      countiesPayload &&
      name === "subCounty" &&
      subCountiesPayload &&
      name === "clinic" &&
      clinicsPayload &&
      name === "nextOfKinRelationship" &&
      relationshipOptionsPayload &&
      name === "insuranceName" &&
      insurancePayload &&
      name === "doctor" &&
      doctorsPayload
    ) {
      dispatch(listCountries());
      dispatch(listCounties());
      dispatch(listSubCounties());
      dispatch(listClinics());
      dispatch(listKinsRelationships());
      dispatch(listInsuranceOptions());
      dispatch(listDoctors());
    }
  };
  // Handle input changes for controlled inputs

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewPatient((prev) => {
      const updatedPatient = { ...prev };

      if (name === "phoneNumber") {
        // Remove any non-numeric characters
        let formattedValue = value.replace(/\D/g, "");

        // Check if the number starts with '0'
        if (formattedValue.startsWith("0")) {
          // Convert '0...' to '254...'
          formattedValue = "254" + formattedValue.slice(1);
        }
        // Ensure the number starts with '254' if not already prefixed
        else if (
          !formattedValue.startsWith("254") &&
          formattedValue.length === 10
        ) {
          formattedValue = "254" + formattedValue;
        }
        // Trim to a maximum of 12 digits
        if (formattedValue.length > 12) {
          formattedValue = formattedValue.slice(0, 12);
        }

        updatedPatient[name] = formattedValue;
      } else {
        updatedPatient[name] = value;

        // Update Principal Member Name if switch is checked
        if (
          prev.isPrincipleMember &&
          (name === "firstName" || name === "middleName" || name === "lastName")
        ) {
          updatedPatient.insurancePrinicipalMemberName = `${
            updatedPatient.firstName
          } ${updatedPatient.middleName || ""} ${
            updatedPatient.lastName
          }`.trim();
        }
      }

      return updatedPatient;
    });
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
      dispatch(listClinics());

      setAge(null);
    } else {
      setDobError("");
      setAge({ years, months }); // Store years and months in the state
      setNewPatient((prev) => ({ ...prev, dob: dateString }));
    }
  };

  const handleSwitchChange = (name, value) => {
    setNewPatient((prev) => {
      const updatedPatient = { ...prev, [name]: value };

      if (name === "isPrincipleMember" && value) {
        updatedPatient.insurancePrinicipalMemberName = `${prev.firstName} ${
          prev.middleName || ""
        } ${prev.lastName}`.trim();
      } else if (name === "isPrincipleMember" && !value) {
        updatedPatient.insurancePrinicipalMemberName = ""; // Clear the name if unchecked
      }

      return updatedPatient;
    });
  };

  const handleSubmit = async () => {
    try {
      // Prepare the new patient data
      const patientData = {
        ...newPatient,
        myAction: "create", // Set action as 'create'
        patientNo: "", // Set patientNo as empty for new patient creation
      };

      // Dispatch `createPatient` and get the returned patient ID
      const patientId = await dispatch(createPatient(patientData));

      if (patientId) {
        setPatientId(patientId); // Store patient ID in state
        console.log("Patient ID:", patientId);

        // Dispatch the action to create a triage visit
        const appointmentId = await dispatch(createTriageVisit(patientId));

        if (appointmentId) {
          setAppointmentId(appointmentId);
        }

        // Check for success and payload in the response
        if (visitSuccess && appointmentId) {
          message.success("Patient registered successfully!");
          console.log("Triage visit created for Patient ID:", appointmentId);
        }
      } else {
        message.error("Patient registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during patient registration:", error);
      message.error("Failed to register patient. Please try again.");
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

  // const handleCreateVisit = async (patientId) => {
  //   try {
  //     // Dispatch the action to create a triage visit
  //     await dispatch(createTriageVisit(patientId));

  //     // Check for success and payload in the response
  //     if (visitSuccess && visitPayload) {
  //       message.success("Patient registered successfully!");
  //       console.log("Patient ID:", patientId);

  //       // Navigate to the visit creation page with the visit payload
  //       navigate(`/reception/create-visit/${patientId}`, {
  //         state: { visitPayload: visitPayload },
  //       });
  //       console.log("Navigate to visit creation page with ID:", patientId);
  //     } else {
  //       throw new Error("Visit creation failed.");
  //     }
  //   } catch (error) {
  //     console.error("Error during visit creation:", error);
  //     message.error("Failed to create a visit. Please try again.");
  //   }
  // };

  useEffect(() => {
    if (visitSuccess && visitPayload) {
      message.success("Patient registered successfully!");
      // console.log("Patient ID:", patientId);
      // navigate(`/reception/create-visit/${patientId}`, {
      //   state: { visitPayload },
      // });
      // Navigate to the visit creation page or perform additional actions
      console.log("Navigate to visit creation page with ID:", patientId);
    }
  }, [visitSuccess, visitPayload, message]);

  useEffect(() => {
    if (postTriageVisitSuccess) {
      message.success("Triage visit updated successfully!");
      // console.log("Patient ID:", patientId);
      // navigate(`/reception/create-visit/${patientId}`, {
      //   state: { visitPayload },
      // });
      // Navigate to the visit creation page or perform additional actions
      console.log("Navigate to visit creation page with ID:", patientId);
    }
  }, [postTriageVisitSuccess, message]);

  // // Effect to handle error or success side effects
  // useEffect(() => {
  //   if (error) {
  //     message.error(error);
  //   }
  // }, [error]);

  useEffect(() => {
    //fetch country list
    dispatch(listCountries());
    dispatch(listCounties());
    dispatch(listSubCounties());
    dispatch(listKinsRelationships());
    dispatch(listClinics());
    dispatch(listPatients());
    dispatch(listInsuranceOptions());
    dispatch(listDoctors());

    console.log("country list: ", countriesPayload);
  }, [dispatch]);

  // Fetch branch from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const branchCode = userInfo?.userData?.shortcut_Dimension_1_Code;

    if (branchCode && doctorsPayload) {
      // Filter doctors based on branch and responsibility center
      const filtered = doctorsPayload.filter(
        (doctor) =>
          doctor.shortcut_Dimension_1_Code === branchCode &&
          doctor.ResponsibilityCenter === newPatient.clinic
      );
      setFilteredDoctors(filtered);
    }
  }, [doctorsPayload, newPatient.clinic]);
  return (
    <div className="container">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={7}>
          {/* <Typography.Title
          level={3}
          style={{ color: "#E89641", padding: "8px" }}
        >
          Patient Registration
        </Typography.Title> */}
          <Card bordered={false} className="card-header">
            <Form layout="vertical" onFinish={handleSubmit}>
              <Typography.Title level={5} style={{ color: "#003F6D" }}>
                General Information
              </Typography.Title>
              <Form.Item
                label="First Name:"
                name="firstName"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                {/* <label className="form-label">First Name:</label> */}
                <Input
                  placeholder="Enter First Name"
                  name="firstName"
                  value={newPatient.firstName}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="Middle Name:"
                name="middleName"
                rules={[
                  { required: true, message: "Please enter middle name" },
                ]}
              >
                <Input
                  placeholder="Enter Middle Name"
                  name="middleName"
                  value={newPatient.middleName}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                label="Surname Name:"
                name="lastName"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input
                  placeholder="Enter Surname Name"
                  name="lastName"
                  value={newPatient.lastName}
                  onChange={handleInputChange}
                />
              </Form.Item>
              <Form.Item
                name="registrationDate"
                label="Registration Date"
                rules={[]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                  placeholder="Select Date"
                  defaultValue={moment()} // Set default date to current date
                />{" "}
              </Form.Item>
              <Form.Item
                name="visitType"
                label="Visit Type"
                rules={[
                  {
                    required: true,
                    message: "Please select a visit type!",
                  },
                ]}
              >
                <Select placeholder="Select Visit Type">
                  <Select.Option value="1">Revisit</Select.Option>
                  <Select.Option value="2">New Consultation</Select.Option>
                </Select>
              </Form.Item>
            </Form>
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
                      if (value.startsWith("254") && value.length === 12) {
                        return Promise.resolve();
                      } else if (
                        !value.startsWith("254") &&
                        value.length === 10
                      ) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error("Phone number must be 10 or 12 digits long")
                      );
                    },
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input
                  placeholder="Enter phone number "
                  name="phoneNumber"
                  value={newPatient.phoneNumber}
                  onChange={handleInputChange}
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
                    placeholder="Select Gender"
                    className="w-100"
                    value={newPatient.gender}
                    onChange={(value) => handleSelectChange("gender", value)}
                  >
                    <Select.Option value="1">Male</Select.Option>
                    <Select.Option value="2">Female</Select.Option>
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
                    value={newPatient.dob ? moment(newPatient.dob) : null}
                    onChange={(date, dateString) =>
                      handleDateChange(date, dateString)
                    }
                  />
                  {dobError && <span style={{ color: "red" }}>{dobError}</span>}

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
                      message: "Please input your ID/Passport/Birth No!",
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
                    value={newPatient.idNumber}
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
                    value={newPatient.nationality}
                    onChange={(value) =>
                      handleSelectChange("nationality", value)
                    }
                    // variant="borderless"
                    name="nationality"
                    onFocus={handleDisplayDropDown} // Trigger dropdown display when focused
                  >
                    <Select.Option value="">
                      --Select Nationality--
                    </Select.Option>
                    {countriesPayload && countriesPayload.length > 0 ? (
                      countriesPayload.map((country) => (
                        <Select.Option key={country.Code} value={country.Code}>
                          {country.Name}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="" disabled>
                        No countries available
                      </Select.Option>
                    )}
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
                    value={newPatient.county}
                    onChange={(value) => handleSelectChange("county", value)}
                    onFocus={handleDisplayDropDown}
                  >
                    <Select.Option value="">--Select County--</Select.Option>
                    {countiesPayload && countiesPayload.length > 0 ? (
                      countiesPayload.map((county) => (
                        <Select.Option key={county.Code} value={county.Code}>
                          {county.Description}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="" disabled>
                        No countries available
                      </Select.Option>
                    )}
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
                    value={newPatient.nationality}
                    onChange={(value) => handleSelectChange("county", value)}
                    onFocus={handleDisplayDropDown}
                  >
                    <Select.Option value="">
                      --Select Sub County--
                    </Select.Option>
                    {subCountiesPayload && subCountiesPayload.length > 0 ? (
                      subCountiesPayload.map((subCounty) => (
                        <Select.Option
                          key={subCounty.SubCountyCode}
                          value={subCounty.SubCountyCode}
                        >
                          {subCounty.Name}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="" disabled>
                        No countries available
                      </Select.Option>
                    )}
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
                    value={newPatient.residence}
                    onChange={handleInputChange}
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
                  <Input placeholder="Address" style={{ width: "100%" }} />
                </Form.Item>
              </div>
            </Form>
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
                {`${newPatient.firstName?.charAt(0) || ""}${
                  newPatient.lastName?.charAt(0) || ""
                }`}
              </Avatar>
            </div>
            {/* Display Patient Details */}
            <div className="d-flex flex-column align-items-start mt-3 text-muted">
              <div className="d-flex flex-row justify-content-between w-100">
                <Typography.Text
                  style={{ fontSize: "0.9rem", fontWeight: "medium" }}
                >
                  Date Registered:
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.9rem" }}
                  className="text-muted"
                >
                  {moment().format("DD/MM/YYYY")}
                </Typography.Text>
              </div>
              <div className="d-flex flex-row justify-content-between w-100 mt-2">
                <Typography.Text
                  style={{ fontSize: "0.9rem", fontWeight: "medium" }}
                >
                  Age:
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.9rem" }}
                  className="text-muted"
                >
                  {newPatient.dob
                    ? `${moment().diff(moment(newPatient.dob), "years")} years`
                    : "N/A"}
                </Typography.Text>
              </div>
              <div className="d-flex flex-row justify-content-between w-100 mt-2">
                <Typography.Text
                  style={{ fontSize: "0.9rem", fontWeight: "medium" }}
                >
                  Gender:
                </Typography.Text>
                <Typography.Text
                  style={{ fontSize: "0.9rem" }}
                  className="text-muted"
                >
                  {newPatient.gender === "1"
                    ? "Male"
                    : newPatient.gender === "2"
                    ? "Female"
                    : "N/A"}
                </Typography.Text>
              </div>
            </div>

            <div className="d-flex my-2 flex-row align-items-center">
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={handleTriageDispatch}
              >
                Dispatch to Triage
              </Button>
            </div>
          </Card>

          <Card style={{ width: "100%" }} className="card-header mt-3">
            <Typography.Title level={5} style={{ color: "#ED1C24" }}>
              Consultation Details
            </Typography.Title>
            <div className="row g-3 my-2 align-items-center justify-content-center">
              <div className="col-12 text-primary">
                <Form.Item
                  label="Clinic:"
                  name="clinic"
                  rules={[
                    {
                      required: true,
                      message: "Please select Clinic",
                    },
                  ]}
                  style={{ width: "100%" }}
                >
                  <Select
                    placeholder="Select Clinic"
                    className="w-100"
                    value={newPatient.clinic}
                    onChange={(value) => handleSelectChange("clinic", value)}
                    onFocus={handleDisplayDropDown}
                  >
                    <Select.Option value="">--Select Clinic--</Select.Option>
                    {clinicsPayload &&
                      clinicsPayload.map((clinic) => (
                        <Select.Option key={clinic.No} value={clinic.No}>
                          {clinic.Description}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="col-12  text-primary">
                <Form.Item
                  label="Doctor:"
                  name="doctor"
                  required
                  style={{ width: "100%" }}
                >
                  <Input
                    placeholder="Select Doctor"
                    style={{ width: "100%" }}
                    name="doctor"
                    value={newPatient.doctor}
                    onChange={handleInputChange}
                  />
                  {/* <Select
                    placeholder="Select Clinic"
                    className="w-100"
                    value={newPatient.doctor}
                    onChange={(value) => handleSelectChange("doctor", value)}
                    onFocus={handleDisplayDropDown}
                  >
                    <Select.Option value="">--Select Clinic--</Select.Option>
                    {clinicsPayload &&
                      clinicsPayload.map((clinic) => (
                        <Select.Option key={clinic.No} value={clinic.No}>
                          {clinic.Description}
                        </Select.Option>
                      ))}
                  </Select> */}
                </Form.Item>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3" gutter={[16, 16]}>
        <Col xs={24} md={18}>
          <Card style={{ width: "100%" }} className="card-header">
            <Form layout="vertical" onFinish={handleSubmit}>
              <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                Next of Kin
              </Typography.Title>
              <div className="row g-3 align-items-center justify-content-center">
                <div className="col-12 col-md-6 text-primary">
                  <Form.Item
                    label="Next of Kin Name:"
                    name="nextOfKinFullName"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter Next of Kin Name",
                    //   },
                    // ]}
                    style={{ width: "100%" }}
                  >
                    <Input
                      placeholder="Enter Next of Kin Name"
                      name="nextOfKinFullName"
                      value={newPatient.nextOfKinFullName}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </div>
                <div className="col-12 col-md-6 text-primary">
                  <Form.Item
                    label="Next of Kin Relationship:"
                    name="nextOfKinRelationship"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter Next of Kin Name",
                    //   },
                    // ]}
                    style={{ width: "100%" }}
                  >
                    <Select
                      placeholder="Select Relationship"
                      className="w-100 "
                      value={newPatient.nextOfKinRelationship}
                      onChange={(value) =>
                        handleSelectChange("nextOfKinRelationship", value)
                      }
                      // variant="borderless"
                      name="nextOfKinRelationship"
                      onFocus={handleDisplayDropDown} // Trigger dropdown display when focused
                    >
                      <Select.Option value="">
                        --Select Relationship--
                      </Select.Option>
                      {relationshipOptionsPayload &&
                      relationshipOptionsPayload.length > 0 ? (
                        relationshipOptionsPayload.map((relation) => (
                          <Select.Option
                            key={relation.Code}
                            value={relation.Code}
                          >
                            {relation.Description}
                          </Select.Option>
                        ))
                      ) : (
                        <Select.Option value="" disabled>
                          No data available
                        </Select.Option>
                      )}
                    </Select>{" "}
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3 align-items-center justify-content-center">
                <div className="col-12 text-primary">
                  <Form.Item
                    label="Next of Kin Phone:"
                    name="nextOfKinPhoneNo"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                      {
                        validator: (_, value) => {
                          // Validate length based on whether the input starts with '254'
                          if (value.startsWith("254") && value.length === 12) {
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
                      placeholder="Enter Next of Kin Phone"
                      name="nextOfKinPhoneNo"
                      value={newPatient.nextOfKinPhoneNo}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Card>
        </Col>
        <Col className="mt-3" xs={24} md={6}>
          <Card style={{ width: "100%" }} className="card-header mt-3">
            <Typography.Title level={5} style={{ color: "#ED1C24" }}>
              Billing Details
            </Typography.Title>
            {/* patient billing details based on mode of payment if cash show cash and what they are being billed for same for insurance */}
            <div className="d-flex gap-2 flex-column">
              <Typography.Text className="fw-medium">
                Mode of Payment:
                <Typography.Text className="text-muted px-2">
                  {newPatient.paymentMode === "1"
                    ? "Cash"
                    : newPatient.paymentMode === "2"
                    ? "Insurance"
                    : "N/A"}
                </Typography.Text>
              </Typography.Text>
              <Typography.Text className="fw-medium">
                Patient Type:
                <Typography.Text className="text-muted">
                  {newPatient.paymentMode === "1"
                    ? "Cash"
                    : newPatient.paymentMode === "2"
                    ? "Insurance"
                    : "N/A"}
                </Typography.Text>
              </Typography.Text>
              <Typography.Text className="fw-medium">
                Billing:
                <Typography.Text className="text-muted">
                  {newPatient.patientType}
                </Typography.Text>
              </Typography.Text>
              <Typography.Text className="fw-medium">
                Amount:
                <Typography.Text className="text-muted  ">0</Typography.Text>
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
      <Row className="mt-3" gutter={[16, 16]}>
        <Col xs={24} md={18}>
          <Card style={{ width: "100%" }} className="card-header">
            <Form layout="vertical">
              <Typography.Title level={5} style={{ color: "#ED1C24" }}>
                Billing Information
              </Typography.Title>
              <div className="row g-3  align-items-center justify-content-center">
                <div className="col-12  text-primary">
                  <Form.Item
                    label="Payment Mode:"
                    name="paymentMode"
                    rules={[
                      {
                        required: true,
                        message: "Please choose Payment Mode",
                      },
                    ]}
                    style={{ width: "100%" }}
                  >
                    <Select
                      placeholder="Select Payment Mode"
                      className="w-100"
                      value={newPatient.paymentMode}
                      onChange={(value) =>
                        handleSelectChange("paymentMode", value)
                      }
                    >
                      <Select.Option value="1">Cash</Select.Option>
                      <Select.Option value="2">Insurance</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              {newPatient.paymentMode === "2" && (
                <>
                  <div className="row g-3  align-items-center justify-content-center">
                    <div className="col-12 col-md-6 text-primary">
                      {/* <Form.Item
                        label="Insurance Number:"
                        name="insuranceNo"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Insurance Number",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input
                          placeholder="Enter Insurance Number"
                          name="insuranceNo"
                          value={newPatient.insuranceNo}
                          onChange={handleInputChange}
                        />
                      </Form.Item> */}
                    </div>
                    <div className="col-12  text-primary">
                      <Form.Item
                        label="Insurance Name:"
                        name="insuranceName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Insurance Name",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Select
                          placeholder="Select Insurance "
                          className="w-100 "
                          value={newPatient.insuranceName}
                          onChange={(value) =>
                            handleSelectChange("insuranceName", value)
                          }
                          // variant="borderless"
                          name="insuranceName"
                          onFocus={handleDisplayDropDown} // Trigger dropdown display when focused
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
                    </div>
                  </div>
                  <div className="row g-3  align-items-center justify-content-center">
                    <div className="col-12 col-md-6 text-primary">
                      <Form.Item
                        label="Principal Member Name:"
                        name="insurancePrinicipalMemberName"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Principal Member Name",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input
                          placeholder="Enter Principal Member Name"
                          name="insurancePrinicipalMemberName"
                          value={newPatient.insurancePrinicipalMemberName}
                          onChange={handleInputChange}
                          disabled={newPatient.insurancePrinicipalMemberName} // Disable input when auto-populating
                        />
                      </Form.Item>
                    </div>
                    <div className="col-12 col-md-6 text-primary">
                      <Form.Item
                        label="Membership No:"
                        name="membershipNo"
                        rules={[
                          {
                            required: true,
                            message: "Please enter Membership Number",
                          },
                        ]}
                        style={{ width: "100%" }}
                      >
                        <Input
                          placeholder="Enter Membership Number"
                          name="membershipNo"
                          value={newPatient.membershipNo}
                          onChange={handleInputChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row g-3 align-items-center justify-content-center">
                    <div className="col-12  text-primary">
                      <Form.Item
                        label="Is Principal Member ?"
                        name="isPrincipleMember"
                      >
                        <Switch
                          checked={newPatient.isPrincipleMember}
                          onChange={(checked) =>
                            handleSwitchChange("isPrincipleMember", checked)
                          }
                          size="large"
                          style={{ margin: "0 10px" }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </>
              )}
            </Form>

            {/* submit or save patient details */}
            <div className="d-flex my-2 flex-row align-items-center justify-content-end">
              <Button
                type="primary"
                size="large"
                onClick={handleSubmit}
                // style={{ width: "100%" }}
              >
                Create Visit
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientRegistration;

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
import { createPatient, createTriageVisit } from "../actions/patientActions";
import {
  listClinics,
  listCounties,
  listCountries,
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
    loading: countriesLoading,
    error: countriesError,
    success: countriesSuccess,
    countries: countriesPayload,
  } = useSelector((state) => state.countriesList);

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
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
    payload: visitPayload,
  } = createTriageVisitState;

  const [age, setAge] = useState(null); // State to hold calculated age

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
      clinicsPayload
    ) {
      dispatch(listCountries());
      dispatch(listCounties());
      dispatch(listSubCounties());
      dispatch(listClinics());
    }
  };
  // Handle input changes for controlled inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Remove any non-numeric characters
      let formattedValue = value.replace(/\D/g, "");

      // Ensure it starts with '254' or convert '07...' to '2547...'
      if (formattedValue.startsWith("0")) {
        formattedValue = "254" + formattedValue.slice(1);
      } else if (!formattedValue.startsWith("254")) {
        formattedValue = "254" + formattedValue;
      }

      // Limit to a maximum of 12 characters (e.g., 254712345678)
      if (formattedValue.length > 12) {
        formattedValue = formattedValue.slice(0, 12);
      }

      // Update the state with the formatted phone number
      setNewPatient((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setNewPatient((prev) => ({ ...prev, [name]: value }));
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
      dispatch(listClinics());

      setAge(null);
    } else {
      setDobError("");
      setAge({ years, months }); // Store years and months in the state
      setNewPatient((prev) => ({ ...prev, dob: dateString }));
    }
  };

  const handleSwitchChange = (name, value) => {
    setNewPatient((prev) => ({ ...prev, [name]: value }));
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
        console.log("Patient ID:", patientId);
        dispatch(createTriageVisit(patientId));
        if (visitSuccess && visitPayload) {
          message.success("Patient registered successfully!");
          // Navigate to the visit creation page with the visit payload
          navigate(`/reception/create-visit/${patientId}`, {
            state: { patient: visitPayload },
          });
          console.log("Navigate to visit creation page with ID:", visitPayload);
        } else {
          message.error(visitError);
          navigate("/reception/Patient-list");
        }
      }
    } catch (error) {
      console.error("Error during patient registration:", error);
      message.error("Failed to register patient. Please try again.");
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
      console.log("Patient ID:", patientId);
      navigate(`/reception/create-visit/${patientId}`, {
        state: { visitPayload },
      });
      // Navigate to the visit creation page or perform additional actions
      console.log("Navigate to visit creation page with ID:", patientId);
    }
  }, [visitSuccess, visitPayload, navigate]);

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
    console.log("country list: ", countriesPayload);
  }, [dispatch]);
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
                name="firstName"
                label="First Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your first name!",
                  },
                ]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                  },
                ]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
              <Form.Item
                name="middleName"
                label="Middle Name"
                rules={[
                  {
                    required: false,
                    message: "Please input your middle name!",
                  },
                ]}
              >
                <Input placeholder="Middle Name" />
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
                    message: "Please enter a valid phone number",
                  },
                  {
                    pattern: /^2547\d{8}$/,
                    message: "Phone number must be in the format 2547xxxxxxxx",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <Input
                  placeholder="254 0000 00000"
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
                  <Select placeholder="Select Gender">
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
                  ]}
                >
                  <Input placeholder="ID/Passport/Birth No:" />
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
                    //  options={relationshipOptions}
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
                    //  options={relationshipOptions}
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
              Patient Photo
            </Typography.Title>
            <div className="d-flex flex-column align-items-center justify-content-center">
              <Avatar
                size={128}
                src={
                  newPatient.photo
                    ? newPatient.photo
                    : "https://joeschmoe.io/api/v1/random"
                }
              />
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
                    //  options={relationshipOptions}
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
                  rules={[
                    {
                      required: true,
                      message: "Please select Doctor",
                    },
                  ]}
                  style={{ width: "100%" }}
                >
                  <Select
                    placeholder="Select Doctor"
                    className="w-100"
                    //  options={relationshipOptions}
                    value={newPatient.doctor}
                    onChange={(value) => handleSelectChange("doctor", value)}
                   
                  >
                    <Select.Option value="">--Select Doctor--</Select.Option>
                  </Select>
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
                      className="w-100"
                      options={relationshipOptions}
                      value={newPatient.nextOfKinRelationship}
                      onChange={(value) =>
                        handleSelectChange("nextOfKinRelationship", value)
                      }
                    ></Select>
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3 align-items-center justify-content-center">
                <div className="col-12 text-primary">
                  <Form.Item
                    label="Next of Kin Phone:"
                    name="nextOfKinPhone"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: "Please enter Next of Kin Phone",
                    //   },
                    // ]}
                    style={{ width: "100%" }}
                  >
                    <Input
                      placeholder="Enter Next of Kin Phone"
                      name="nextOfKinPhone"
                      value={newPatient.nextOfKinPhone}
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3" gutter={[16, 16]}>
        <Col xs={24} md={18}>
          <Card style={{ width: "100%" }} className="card-header">
            <Form layout="vertical" onFinish={handleSubmit}>
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
                      <Form.Item
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
                      </Form.Item>
                    </div>
                    <div className="col-12 col-md-6 text-primary">
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
                        <Input
                          placeholder="Enter Insurance Name"
                          name="insuranceName"
                          value={newPatient.insuranceName}
                          onChange={handleInputChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="row g-3  align-items-center justify-content-center">
                    <div className="col-12 col-md-6 text-primary">
                      <Form.Item
                        label="Principal Member Name:"
                        name="insurancePrincipalMemberName"
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
                          name="insurancePrincipalMemberName"
                          value={newPatient.insurancePrincipalMemberName}
                          onChange={handleInputChange}
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
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please enter Scheme Name",
                        //   },
                        // ]}
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
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientRegistration;

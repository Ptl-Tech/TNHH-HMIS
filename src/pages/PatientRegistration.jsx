import {
  Button,
  DatePicker,
  Input,
  Select,
  Form,
  message,
  Spin,
  Switch,
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

const PatientRegistration = () => {
  const dispatch = useDispatch();
  const createPatientState = useSelector((state) => state.createPatient);
  const { loading, error, success } = createPatientState;
  const navigate = useNavigate();

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
          navigate('/reception/Patient-list');
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
    <div className="card py-2 px-2">
      <div className="card-header d-flex justify-content-between">
        <h5 className="card-title" style={{ color: "#ac8342" }}>
          Patient Registration
        </h5>
        <a
          href="/Doctor/Patient-list"
          className="btn btn-link ps-0 text-success"
        >
          Patient List
        </a>
      </div>
      <div className="card-body">
        <Form layout="vertical">
          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-primary">
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
                  className="custom-input"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
            <div className="col-12 col-md-6 text-primary">
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
                  className="custom-input"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-primary">
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
                  className="custom-input"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Gender:"
                name="gender"
                rules={[{ required: true, message: "Please select gender" }]}
              >
                <Select
                  placeholder="Select Gender"
                  className="w-100, custom-select"
                  value={newPatient.gender}
                  onChange={(value) => handleSelectChange("gender", value)}
                  variant="borderless"
                  size="large"
                >
                  <Select.Option value="0">--Select Gender--</Select.Option>
                  <Select.Option value="1">Male</Select.Option>
                  <Select.Option value="2">Female</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Date of Birth:"
                name="dob"
                rules={[
                  { required: true, message: "Please select date of birth" },
                ]}
              >
                <DatePicker
                  className="w-100, custom-select"
                  placeholder="Select Date of Birth"
                  value={newPatient.dob ? moment(newPatient.dob) : null}
                  onChange={(date, dateString) =>
                    handleDateChange(date, dateString)
                  }
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
              {dobError && <span style={{ color: "red" }}>{dobError}</span>}

              {age !== null && (
                <div className="text-success">
                  Age: {age.years} years {age.months} months
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="ID/Passport/Birth No:"
                name="idNumber"
                rules={[
                  {
                    required: true,
                    message: "Please enter ID/Passport/Birth No",
                  },
                ]}
              >
                <Input
                  placeholder="Enter ID No"
                  name="idNumber"
                  value={newPatient.idNumber}
                  onChange={handleInputChange}
                  className="custom-input"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>
          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Nationality:"
                name="nationality"
                rules={[
                  { required: true, message: "Please select nationality" },
                ]}
              >
                <Select
                  placeholder="Select Nationality"
                  className="w-100 custom-select"
                  value={newPatient.nationality}
                  onChange={(value) => handleSelectChange("nationality", value)}
                  variant="borderless"
                  size="large"
                  name="nationality"
                  onFocus={handleDisplayDropDown} // Trigger dropdown display when focused
                >
                  <Select.Option value="">--Select Nationality--</Select.Option>
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
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="County:"
                name="county"
                rules={[
                  {
                    required: true,
                    message: "Please select County",
                  },
                ]}
              >
                <Select
                  placeholder="Select County"
                  className="w-100, custom-select"
                  //  options={relationshipOptions}
                  value={newPatient.county}
                  onChange={(value) => handleSelectChange("county", value)}
                  variant="borderless"
                  onFocus={handleDisplayDropDown}
                  size="large"
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
            </div>
          </div>
          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Sub County:"
                name="subCounty"
                rules={[
                  {
                    required: true,
                    message: "Please select nationality",
                  },
                ]}
              >
                <Select
                  placeholder="Select Sub County"
                  className="w-100, custom-select"
                  //  options={relationshipOptions}
                  value={newPatient.nationality}
                  onChange={(value) => handleSelectChange("county", value)}
                  variant="borderless"
                  onFocus={handleDisplayDropDown}
                  size="large"
                >
                  <Select.Option value="">--Select Sub County--</Select.Option>
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
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Residence:"
                name="residence"
                rules={[
                  {
                    required: true,
                    message: "Enter your residence",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Residence"
                  name="residence"
                  value={newPatient.residence}
                  onChange={handleInputChange}
                  className=" custom-select"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>
          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-primary">
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
              >
                <Input
                  placeholder="254 0000 00000"
                  name="phoneNumber"
                  value={newPatient.phoneNumber}
                  onChange={handleInputChange}
                  className="custom-input"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
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
              >
                <Input
                  placeholder="Enter Next of Kin Name"
                  name="nextOfKinFullName"
                  value={newPatient.nextOfKinFullName}
                  onChange={handleInputChange}
                  className="custom-input"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>

          <div className="row g-3 my-2 align-items-center justify-content-center">
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
              >
                <Select
                  placeholder="Select Relationship"
                  className="w-100, custom-select"
                  options={relationshipOptions}
                  value={newPatient.nextOfKinRelationship}
                  onChange={(value) =>
                    handleSelectChange("nextOfKinRelationship", value)
                  }
                  variant="borderless"
                  size="large"
                ></Select>
              </Form.Item>
            </div>
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Next of Kin Phone Number:"
                name="nextOfKinPhoneNo"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter Next of Kin Phone Number",
                //   },
                // ]}
              >
                <Input
                  placeholder="254 0000 00000"
                  name="nextOfKinPhoneNo"
                  value={newPatient.nextOfKinPhoneNo}
                  onChange={handleInputChange}
                  className=" custom-select"
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
            </div>
          </div>
          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Clinic:"
                name="clinic"
                rules={[
                  {
                    required: true,
                    message: "Please select Clinic",
                  },
                ]}
              >
                <Select
                  placeholder="Select Clinic"
                  className="w-100, custom-select"
                  //  options={relationshipOptions}
                  value={newPatient.clinic}
                  onChange={(value) => handleSelectChange("clinic", value)}
                  variant="borderless"
                  onFocus={handleDisplayDropDown}
                  size="large"
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
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Doctor:"
                name="doctor"
                rules={[
                  {
                    required: true,
                    message: "Please select Doctor",
                  },
                ]}
              >
                <Select
                  placeholder="Select Doctor"
                  className="w-100, custom-select"
                  //  options={relationshipOptions}
                  value={newPatient.doctor}
                  onChange={(value) => handleSelectChange("doctor", value)}
                  variant="borderless"
                  size="large"
                >
                  <Select.Option value="">--Select Doctor--</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="row g-3 my-2 align-items-center justify-content-center">
            <div className="col-12 col-md-6  text-primary">
              <Form.Item
                label="Payment Mode:"
                name="paymentMode"
                rules={[
                  {
                    required: true,
                    message: "Please choose Payment Mode",
                  },
                ]}
              >
                <Select
                  placeholder="Select Payment Mode"
                  className="w-100, custom-select"
                  value={newPatient.paymentMode}
                  onChange={(value) => handleSelectChange("paymentMode", value)}
                  variant="borderless"
                  size="large"
                >
                  <Select.Option value="1">Cash</Select.Option>
                  <Select.Option value="2">Insurance</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="Patient Status:"
                name="patientStatus"
                rules={[
                  { required: true, message: "Please select Patient Status" },
                ]}
              >
                <Select
                  placeholder="Select Patient Status"
                  className="w-100, custom-select"
                  value={newPatient.patientStatus}
                  onChange={(value) =>
                    handleSelectChange("patientStatus", value)
                  }
                  variant="borderless"
                  size="large"
                >
                  <Select.Option value="0">Alive</Select.Option>
                  <Select.Option value="1">Dead</Select.Option>
                  <Select.Option value="2">Transfer</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* Conditional rendering of insurance fields */}
          {newPatient.paymentMode === "2" && (
            <>
              <div className="row g-3 my-2 align-items-center justify-content-center">
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
                  >
                    <Input
                      placeholder="Enter Insurance Number"
                      name="insuranceNo"
                      value={newPatient.insuranceNo}
                      onChange={handleInputChange}
                      className="custom-input"
                      variant="borderless"
                      size="large"
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
                  >
                    <Input
                      placeholder="Enter Insurance Name"
                      name="insuranceName"
                      value={newPatient.insuranceName}
                      onChange={handleInputChange}
                      className="custom-input"
                      variant="borderless"
                      size="large"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3 my-2 align-items-center justify-content-center">
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
                  >
                    <Input
                      placeholder="Enter Principal Member Name"
                      name="insurancePrincipalMemberName"
                      value={newPatient.insurancePrincipalMemberName}
                      onChange={handleInputChange}
                      className="custom-input"
                      variant="borderless"
                      size="large"
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
                  >
                    <Input
                      placeholder="Enter Membership Number"
                      name="membershipNo"
                      value={newPatient.membershipNo}
                      onChange={handleInputChange}
                      className="custom-input"
                      variant="borderless"
                      size="large"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="row g-3 my-2 align-items-center justify-content-center">
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

          <div className="d-flex justify-content-center my-5 gap-3">
            {!patientId ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                type="primary"
                size="large"
              >
                {loading ? <Spin /> : "Save Patient Details"}
              </Button>
            ) : (
              <Button
                onClick={handleCreateVisit}
                disabled={visitLoading}
                type="primary"
                size="large"
              >
                {visitLoading ? <Spin /> : "Create Visit"}
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PatientRegistration;

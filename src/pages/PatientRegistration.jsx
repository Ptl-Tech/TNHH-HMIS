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

const PatientRegistration = () => {
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

  const {
    loading: marketingStrategiesLoading,
    error: marketingStrategiesError,
    success: marketingStrategiesSuccess,
    data: marketingStrategiesPayload,
  } = useSelector((state) => state.marketingList);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation(); // Access the state passed via navigate
  const { visitorData, patientNumber } = state || {}; // Destructure patient data if available
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
    nationality: "",
    county: "",
    idNumber: "",
    phoneNumber: "",
    paymentMode: "",
    nextOfKinRelationShip: "",
    nextOfKinFullName: "",
    nextOfKinPhoneNo: "",
    insuranceNo: "",
    insuranceName: "",
    insurancePrinicipalMemberName: "",
    isPrincipleMember: false,
    membershipNo: "",
    schemeName: "",
    howYouKnewABoutUs: "",
    subCounty: "",
    email: "",
    residence: "",
    patientStatus: 0,
  });
  useEffect(() => {
    dispatch(listCountries());
    dispatch(listCounties());
    dispatch(listSubCounties());
    dispatch(listKinsRelationships());
    dispatch(listInsuranceOptions());
    dispatch(marketingStrategies());
    dispatch(listPatients());
  }, [dispatch]);

  useEffect(() => {
    if (countriesPayload) {
      setFilteredCountries(countriesPayload);
    }
  }, [countriesPayload]);

  // Handle search input
  const handleSearch = (value) => {
    setSearchTerm(value);

    // If the search term is empty, show the entire list
    if (!value.trim()) {
      setFilteredCountries(countriesPayload);
      return;
    }

    // Otherwise, filter countries based on the search term
    const filtered = countriesPayload.filter((country) =>
      country.Name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCountries(filtered);
  };
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
  const handleSwitchChange = (name, value) => {
    setNewPatient((prev) => {
      const updatedPatient = { ...prev, [name]: value };

      if (name === "isPrincipleMember" && value) {
        // Set the insurancePrincipalMemberName in uppercase
        updatedPatient.insurancePrinicipalMemberName = `${prev.firstName} ${
          prev.middleName || ""
        } ${prev.lastName}`
          .trim()
          .toUpperCase();
      } else if (name === "isPrincipleMember" && !value) {
        updatedPatient.insurancePrinicipalMemberName = ""; // Clear the name if unchecked
      }

      return updatedPatient;
    });
  };

  const handleDisplayDropDown = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));

    if (
      name === "nationality" &&
      countriesPayload &&
      name === "county" &&
      countiesPayload &&
      name === "subCounty" &&
      subCountiesPayload &&
      name === "nextOfKinRelationship" &&
      relationshipOptionsPayload &&
      name === "insuranceName" &&
      insurancePayload &&
      name === "howYouKnewABoutUs"
    ) {
      dispatch(listCountries());
      dispatch(listCounties());
      dispatch(listSubCounties());
      dispatch(listKinsRelationships());
      dispatch(listInsuranceOptions());
      dispatch(marketingStrategies());
    }
  };
  const handleSavePatient = async (e) => {
    e.preventDefault();

    // Validate the entire form
    const errors = validateForm(newPatient);
    setErrors(errors);

    // If there are any validation errors, show a warning
    if (Object.keys(errors).length > 0) {
      message.warning("Please fill in all the required fields correctly.");
      return; 
    }

    // Determine the action (create or edit) based on the patientNumber
    const isEditAction = !!patientNumber && patientNumber.trim() !== "";

    // Prepare patient data
    const patientData = {
      firstName: newPatient.firstName || visitorData.VisitorName?.split(" ")[0],
      lastName: newPatient.lastName ||visitorData.VisitorName?.split(" ")[2],
      middleName: newPatient.middleName || visitorData.VisitorName?.split(" ")[1],
      idNumber: newPatient.idNumber || visitorData?.IDNumber,
      phoneNumber: newPatient.phoneNumber || visitorData?.PhoneNumber,
      email: newPatient.email,
      gender: newPatient.gender,
      dob: newPatient.dob,
      nationality: newPatient.nationality,
      county: newPatient.county,
      subCounty: newPatient.subCounty,
      residence: newPatient.residence,
      nextOfKinFullName: newPatient.nextOfKinFullName,
      nextOfKinRelationship: newPatient.nextOfKinRelationShip,
      nextOfKinPhoneNo: newPatient.nextOfKinPhoneNo,
      paymentMode: newPatient.paymentMode,
      insuranceNo: newPatient.insuranceNo,
      isPrincipleMember: newPatient.isPrincipleMember,
      membershipNo: newPatient.membershipNo,
      insuranceName: newPatient.insuranceName,
      howYouKnewABoutUs: newPatient.howYouKnewABoutUs,
      myAction: isEditAction ? "edit" : "create", 
      patientNo: patientNumber, // Include patientNo only if editing
    };

    try {
      // Dispatch the patient creation or update action
      const responsedata = await dispatch(createPatient(patientData));
      const patientId = responsedata?.patientNo;

      if (patientId) {
        message.success(
          "Patient Saved Successfully"
        );
        // Navigate to Add Appointment page and pass patientId
        navigate(`/reception/Add-Appointment/${patientId}`, {
          state: { patientData: patientData,  },
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
  const validateForm = (patient) => {
    const errors = {};

    // Example validation rules
    if (!patient.firstName || patient.firstName.trim() === "") {
      errors.firstName = "First name is required.";
    }
    if (!patient.lastName || patient.lastName.trim() === "") {
      errors.lastName = "Last name is required.";
    }
    if (!patient.phoneNumber || patient.phoneNumber.trim() === "") {
      errors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10,12}$/.test(patient.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 to 12 digits long.";
    }
    if (!patient.nationality || patient.nationality.trim() === "") {
      errors.nationality = "Nationality is required.";
    }
    // Validate idNumber if it is provided
    if (patient.idNumber) {
      const isRegistered = patientListPayload?.some(
        (existingPatient) => existingPatient.IDNumber === patient.idNumber
      );
      if (isRegistered) {
        errors.idNumber = "This ID/Passport/Birth No is already registered.";
      }
    }

    // Add more validation rules as necessary
    return errors;
  };

  return (
    <div>
      <h4 style={{ textAlign: "center", color: "#E89641" }}>
        Patient Registration {patientNumber}
      </h4>
      <div className="row">
        <div className="col-12 col-md-8">
          <Card title="Patient Information" style={{ width: "100%" }}>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              autoComplete="off"
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
                    value={newPatient.idNumber || visitorData?.IDNumber}
                    onChange={handleInputChange}
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
                    value={newPatient.firstName || visitorData.VisitorName?.split(" ")[0]}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Middle Name:<span className="text-danger px-1">*</span>
                  </label>
                  <Input
                    name="middleName"
                    placeholder="Middle Name"
                    style={{ width: "100%" }}
                    value={newPatient.middleName || visitorData.VisitorName?.split(" ")[1]}
                    onChange={handleInputChange}
                  />
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
                    value={newPatient.lastName || visitorData.VisitorName?.split(" ")[2]}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12 col-md-4 ">
                  <label className="py-1">
                    Gender:
                    <span className="text-danger px-1 fs-6">*</span>
                  </label>
                  <Select
                    placeholder="--Select Gender--"
                    className="w-100"
                    value={newPatient.gender}
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
                    value={newPatient.phoneNumber || visitorData?.PhoneNumber}
                    onChange={handleInputChange}
                  />
                  {errors.phoneNumber && (
                    <span style={{ color: "red", fontSize: "0.875rem" }}>
                      {errors.phoneNumber}
                    </span>
                  )}
                </div>
                <div className="col-12 col-md-4 ">
                  <label className="py-1">
                    Email:
                    <span className="text-danger px-1 fs-6">*</span>
                  </label>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    style={{ width: "100%" }}
                    value={newPatient.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Nationality:<span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select nationality"
                    name="nationality"
                    className="w-100"
                    value={newPatient.nationality}
                    showSearch
                    onSearch={handleSearch}
                    onChange={(value) =>
                      handleSelectChange("nationality", value)
                    }
                    filterOption={false} // Disables default filtering
                  >
                    <Select.Option value="">
                      --Select Nationality--
                    </Select.Option>
                    {filteredCountries && filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
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
                </div>
              </div>
              <div className="row px-3 py-2 align-items-center ">
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    County:<span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select County"
                    className="w-100 "
                    value={newPatient.county}
                    onChange={(value) => handleSelectChange("county", value)}
                    name="county"
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
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Sub County:<span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select Sub County"
                    className="w-100"
                    value={newPatient.subCounty}
                    name="subCounty"
                    onChange={(value) => handleSelectChange("subCounty", value)}
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
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Residence:<span className="text-danger px-1">*</span>
                  </label>
                  <Input
                    placeholder="Enter residence"
                    name="residence"
                    value={newPatient.residence}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row px-3 py-2  align-items-center ">
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Kin's Name:<span className="text-danger px-1">*</span>
                  </label>
                  <Input
                    placeholder="Kin's Name"
                    name="nextOfKinFullName"
                    value={newPatient.nextOfKinFullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-12 col-md-4 ">
                  <label className="py-1">
                    Kin's Relationship:
                    <span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select Relationship"
                    className="w-100 "
                    value={newPatient.nextOfKinRelationShip}
                    onChange={(value) =>
                      handleSelectChange("nextOfKinRelationShip", value)
                    }
                    // variant="borderless"
                    name="nextOfKinRelationShip"
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
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Kin's Phone Number:
                    <span className="text-danger px-1">*</span>
                  </label>
                  <Input
                    placeholder="Kin's phone number"
                    name="nextOfKinPhoneNo"
                    value={newPatient.nextOfKinPhoneNo}
                    onChange={handleInputChange}
                    type="number"
                  />
                </div>
              </div>
              <div className="row px-3 py-2 mb-4 align-items-center">
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    How did you hear about us:
                    <span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select"
                    className="w-100 "
                    value={newPatient.howYouKnewABoutUs}
                    onChange={(value) =>
                      handleSelectChange("howYouKnewABoutUs", value)
                    }
                    name="howYouKnewABoutUs"
                    onFocus={handleDisplayDropDown}
                  >
                    {marketingStrategiesPayload &&
                    marketingStrategiesPayload.length > 0 ? (
                      marketingStrategiesPayload.map((list) => (
                        <Select.Option key={list.Code} value={list.Code}>
                          {list.Description}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="" disabled>
                        No List available
                      </Select.Option>
                    )}
                  </Select>{" "}
                </div>
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
                      visitorData.VisitorName?.split(" ")[0]
                        ?.charAt(0)
                        .toUpperCase() ||
                      ""
                    }${
                      newPatient.lastName?.charAt(0).toUpperCase() ||
                      visitorData.VisitorName?.split(" ")[1]
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
                    placeholder="Select Payment Mode"
                    className="w-100"
                    value={newPatient.paymentMode}
                    onChange={(value) =>
                      handleSelectChange("paymentMode", value)
                    }
                  >
                    <Select.Option value="">--Select--</Select.Option>
                    <Select.Option value={2}>Cash</Select.Option>
                    <Select.Option value={1}>Insurance</Select.Option>
                  </Select>{" "}
                </div>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="py-1">
                      Insurance Name:<span className="text-danger px-1">*</span>
                    </label>
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
                      disabled={newPatient.paymentMode !== "2"}
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
                  <div className="col-12 col-md-6">
                    <label className="py-1">
                      Membership No:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      placeholder="Enter Membership Number"
                      name="membershipNo"
                      value={newPatient.membershipNo}
                      onChange={handleInputChange}
                      disabled={newPatient.paymentMode !== "2"}
                    />
                  </div>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-12">
                    <label className="py-1">
                      Scheme Name:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      placeholder="Enter Insurance Number"
                      name="schemeName"
                      value={newPatient.schemeName}
                      onChange={handleInputChange}
                      disabled={newPatient.paymentMode !== "2"}
                    />
                  </div>
                  <div className="col-12 ">
                    <label className="py-1">
                      Principal Name:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      placeholder="Enter Principal Name"
                      name="insurancePrinicipalMemberName"
                      value={newPatient.insurancePrinicipalMemberName}
                      onChange={handleInputChange}
                      disabled={
                        newPatient.paymentMode !== "2" &&
                        newPatient.isPrincipleMember
                      }
                      readOnly
                      style={{ cursor: "not-allowed" }}
                    />
                  </div>
                </div>
                <div className="col-12 mb-4">
                  <label className="py-1">
                    Principle Member ?{" "}
                    <span className="text-danger px-1">*</span>
                  </label>
                  <Switch
                    checked={newPatient.isPrincipleMember}
                    onChange={(checked) =>
                      handleSwitchChange("isPrincipleMember", checked)
                    }
                    size="large"
                    style={{ margin: "0 10px" }}
                    disabled={newPatient.paymentMode !== "2"}
                  />
                </div>
              </div>
            </Form>
          </Card>
        </div>

        <div className="d-flex align-items-center justify-content-end mt-3">
          <Button
            type="primary"
            className="mx-2"
            onClick={handleSavePatient}
            // loading={savingPatient}
          >
            Save Patient
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;

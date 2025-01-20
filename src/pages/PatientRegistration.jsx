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
  listSubCountyWards,
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
    loading: subCountyWardsLoading,
    error: subCountyWardsError,
    success: subCountyWardsSuccess,
    subCountyWards: subCountyWardsPayload,
  } = useSelector((state) => state.subCountyWards);
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
  const [form] = Form.useForm();

  const { state } = useLocation(); // Access the state passed via navigate
  const { visitorData, patientNumber, patientDet } = state || {}; // Destructure patient data if available
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredSubCounties, setFilteredSubCounties] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);
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
    countyWard: "",
    email: "",
    residence: "",
    patientStatus: 0,
  });
  useEffect(() => {
    dispatch(listCountries());
    dispatch(listCounties());
    dispatch(listSubCounties());
    dispatch(listSubCountyWards());
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

  useEffect(() => {
    if (countiesPayload) {
      setFilteredCounties(countiesPayload);
    }
  }, [countiesPayload]);





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
  // Filter subcoiunties based on the selected county
  useEffect(() => {
    if (subCountiesPayload) {
      setFilteredSubCounties(subCountiesPayload);
    }
  }, [subCountiesPayload]);
  
  useEffect(() => {
    if (subCountyWardsPayload) {
      setFilteredWards(subCountyWardsPayload);
    }
  }, [subCountyWardsPayload]);


  const FilterSubCounties = (countyCode) => {
    if (!countyCode) {
      setFilteredSubCounties(subCountiesPayload);
      return;
    }

    const filtered = subCountiesPayload.filter(
      (subCounty) => subCounty.CountyCode === countyCode
    );
    setFilteredSubCounties(filtered);
  };

  const FilterSubCountyWards = (subCounty) => {
    if (!subCounty) {
      setFilteredWards(subCountyWardsPayload);
      return;
    }

    const filtered = subCountyWardsPayload.filter(
      (ward) => ward.SubCounty === subCounty  
    );
    setFilteredWards(filtered);
  };



  // console.log('filtered',patientDet);


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
    if (name === 'county') {
      FilterSubCounties(value);
    }
    if (name === 'subCounty') {
      FilterSubCountyWards(value);
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
        updatedPatient.insurancePrinicipalMemberName = `${
          prev.firstName || visitorData?.VisitorName
        } ${prev.middleName || ""} ${prev.lastName}`
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
      name === "CountyWard" &&
      subCountyWardsPayload &&
      name === "nextOfKinRelationship" &&
      relationshipOptionsPayload &&
      name === "insuranceName" &&
      insurancePayload &&
      name === "howYouKnewABoutUs"
    ) {
      dispatch(listCountries());
      dispatch(listCounties());
      dispatch(listSubCounties());
      dispatch(listSubCountyWards());      
      dispatch(listKinsRelationships());
      dispatch(listInsuranceOptions());
      dispatch(marketingStrategies());
    }
  };

  useEffect(() => {
    if (patientDet) {
      setNewPatient({
        idNumber: patientDet?.IDNumber || "",
        firstName: patientDet?.FirstName || "",
        middleName: patientDet?.MiddleName || "",
        lastName: patientDet?.LastName || "",
        gender: patientDet?.Gender==="Male" ? "1" : "2" || "",
        dob: patientDet?.DateOfBirth || null,
        phoneNumber: patientDet?.TelephoneNo1 || "",
        email: patientDet?.Email || "",
        nationality: patientDet?.Nationality || "",
        county: patientDet?.CountyWardName || "",
        subCounty: patientDet?.SubCountyName || "",
        countyWard: patientDet?.CountyWardName || "",
        residence: patientDet?.Residence || "",
        nextOfKinFullName: patientDet?.NextOfkinFullName || "",
        nextOfKinRelationShip: patientDet?.NextofkinRelationship || "",
      });
    }
  }, [patientDet]);

  console.log(patientDet)
  
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
      nationality: newPatient.nationality || patientDet.Nationality,
      county: newPatient.county || patientDet.County,
      subCounty: newPatient.subCounty || patientDet.SubCountyName,
      countyWard: newPatient.countyWard || patientDet.CountyWardName,
      residence: newPatient.residence,
      nextOfKinFullName:
        newPatient.nextOfKinFullName || patientDet?.NextOfkinFullName,
      nextOfKinRelationship:
        newPatient.nextOfKinRelationShip || patientDet?.NextofkinRelationship,
      schemeName: newPatient.schemeName || patientDet?.SchemeName,
      nextOfKinPhoneNo:
        newPatient.nextOfKinPhoneNo || patientDet?.NextofkinPhoneNo,
      paymentMode: newPatient.paymentMode || patientDet?.PatientType,
      insuranceNo: newPatient.insuranceNo || patientDet?.InsuranceNo,
      insurancePrinicipalMemberName:
        newPatient.insurancePrinicipalMemberName || patientDet?.SearchName,
      isPrincipleMember: newPatient.isPrincipleMember || patientDet?.Principal,
      membershipNo: newPatient.membershipNo || patientDet?.MembershipNo,
      insuranceName: newPatient.insuranceName || patientDet?.InsuranceName,
      howYouKnewABoutUs:
        newPatient.howYouKnewABoutUs || patientDet?.HowyouKnewAboutUs,
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
          Patient Registration {patientNumber || patientDet?.PatientNo}
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
                    value={newPatient.email || patientDet?.Email}
                    onChange={handleInputChange}
                    className="text-center fw-bold"
                  />
                  {errors.email && (
                    <span style={{ color: "red", fontSize: "0.875rem" }}>
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Nationality:<span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select nationality"
                    name="nationality"
                    className="w-100 fw-bold text-center"
                    value={newPatient.nationality || patientDet?.Nationality}
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
                    className="w-100 fw-bold text-center"
                    value={newPatient.county || patientDet?.CountyWardName}
                    onChange={(value) => handleSelectChange("county", value)}
                    name="county"
                    showSearch
                    // filterOption = {true}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    // onFocus={handleDisplayDropDown}
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
                    className="w-100 fw-bold text-center"
                    value={newPatient.subCounty || patientDet?.SubCountyName}
                    name="subCounty"
                    onChange={(value) => handleSelectChange("subCounty", value)}
                    onFocus={handleDisplayDropDown}
                    showSearch
                    // filterOption = {true}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="">
                      --Select Sub County--
                    </Select.Option>
                    {filteredSubCounties && filteredSubCounties.length > 0 ? (
                      filteredSubCounties.map((subCounty) => (
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
                    Ward:<span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select Sub County"
                    className="w-100 fw-bold text-center"
                    value={newPatient.CountyWard || patientDet?.CountyWardName}
                    name="countyWard"
                    onChange={(value) => handleSelectChange("countyWard", value)}
                    onFocus={handleDisplayDropDown}
                    showSearch
                    // filterOption = {true}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="">
                      --Select Sub County--
                    </Select.Option>
                    {filteredWards && filteredWards.length > 0 ? (
                      filteredWards.map((ward) => (
                        <Select.Option
                          key={ward.Code}
                          value={ward.Name}
                        >
                          {ward.Name}
                        </Select.Option>
                      ))
                    ) : (
                      <Select.Option value="" disabled>
                        No wards available
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
                    className="text-center fw-bold"
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
                    value={
                      newPatient.nextOfKinFullName ||
                      patientDet?.NextOfkinFullName
                    }
                    onChange={handleInputChange}
                    className="text-center fw-bold"
                  />
                </div>
                <div className="col-12 col-md-4 ">
                  <label className="py-1">
                    Kin's Relationship:
                    <span className="text-danger px-1">*</span>
                  </label>
                  <Select
                    placeholder="Select Relationship"
                    className="w-100 fw-bold text-center"
                    value={
                      newPatient.nextOfKinRelationShip ||
                      patientDet?.NextofkinRelationship
                    }
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
                    value={
                      newPatient.nextOfKinPhoneNo ||
                      patientDet?.NextOfkinAddress1
                    }
                    className="text-center fw-bold"
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
                    placeholder="Select Payment Mode"
                    className="w-100"
                    value={newPatient.paymentMode || patientDet?.PatientType}
                    onChange={(value) =>
                      handleSelectChange("paymentMode", value)
                    }
                  >
                    <Select.Option value="">--Select--</Select.Option>
                    <Select.Option value="2">Cash</Select.Option>
                    <Select.Option value="1">Insurance</Select.Option>
                    <Select.Option value="3">Corporate</Select.Option>
                  </Select>
                </div>

                {/* Insurance Input Fields */}
                {newPatient.paymentMode !== "2"  && (
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Insurance Name:
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Select
                        placeholder="Select Insurance"
                        className="w-100"
                        value={
                          newPatient.insuranceNo || patientDet?.InsuranceNo
                        }
                        onChange={(value) =>
                          handleSelectChange("insuranceNo", value)
                        }
                        name="insuranceNo"
                        onFocus={handleDisplayDropDown}
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
                        Membership No:
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Input
                        placeholder="Enter Membership Number"
                        name="membershipNo"
                        value={
                          newPatient.membershipNo || patientDet?.MembershipNo
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Additional Fields for Insurance */}
                {newPatient.paymentMode !== "2" && (
                  <>
                    <div className="row g-2 mb-3">
                      <div className="col-12">
                        <label className="py-1">
                          Scheme Name:
                          <span className="text-danger px-1">*</span>
                        </label>
                        <Input
                          placeholder="Enter Insurance Number"
                          name="schemeName"
                          value={
                            newPatient.schemeName || patientDet?.SchemeName
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-12">
                        <label className="py-1">
                          Principal Name:
                          <span className="text-danger px-1">*</span>
                        </label>
                        <Input
                          placeholder="Enter Principal Name"
                          name="insurancePrincipalMemberName"
                          value={
                            newPatient.insurancePrincipalMemberName ||
                            patientDet?.InsurancePrincipalMemberName ||
                            ""
                          }
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="col-12 mb-4">
                      <label className="py-1">
                        Principle Member ?
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Switch
                        checked={
                          newPatient.isPrincipleMember || patientDet?.Principal
                        }
                        onChange={(checked) =>
                          handleSwitchChange("isPrincipleMember", checked)
                        }
                        size="large"
                        style={{ margin: "0 10px" }}
                      />
                    </div>
                  </>
                )}
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

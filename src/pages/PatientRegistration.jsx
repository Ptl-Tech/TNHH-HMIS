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
import moment from "moment"; // Ensure you import moment

const PatientRegistration = () => {
  const dispatch = useDispatch();
  const createPatientState = useSelector((state) => state.createPatient);
  const { loading, error, success, payload } = createPatientState;

  const createTriageVisitState = useSelector(
    (state) => state.createTriageVisit
  );
  const {
    loading: visitLoading,
    error: visitError,
    success: visitSuccess,
    payload: visitPayload,
  } = createTriageVisitState;

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
  });

  const [patientId, setPatientId] = useState(null);

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
//patient should not be less than two years of age
    const today = new Date();
    const patientDate = new Date(dateString);
    const ageDiff = today.getFullYear() - patientDate.getFullYear();
    if (ageDiff < 2) {
      message.error("Patient should not be less than two years of age.");
      return;
    }

    setNewPatient((prev) => ({ ...prev, dateOfBirth: dateString }));
  };

  const handleSwitchChange = (name, value) => {
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };
  // Dispatch the create patient action
  const handleSubmit = async () => {
    // Prepare the new patient data
    const patientData = {
      ...newPatient,
      myAction: "create", // Set action as 'create'
      patientNo: "", // Set patientNo as empty for new patient creation
    };
    const patientID = await dispatch(createPatient(patientData)); // Get the patient ID after dispatching
    if (patientID) {
      setPatientId(patientID);
      console.log("Patient ID:", patientID);
    }
  };

  const handleCreateVisit = () => {
    if (!patientId) {
      message.error("Please create a patient before creating a visit.");
      return;
    }
    dispatch(createTriageVisit(patientId));
    if (visitSuccess) {
      setNewPatient({
        ...newPatient,

        firstName: "",
        middleName: "",
        lastName: "",
        idNumber: "",
        gender: "",
        dob: "",
        phoneNumber: "",
        paymentMode: 0,
        nextOfKinFullName: "",
        nextOfKinRelationship: "",
        nextOfKinPhoneNo: "",
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
        clinisc: "",
      });
    }
  };

  // Effect to handle messages based on success or error
  useEffect(() => {
    if (error) {
      message.error(error);
    }
    if (success) {
      message.success("Patient created successfully!");
    }
  }, [error, success]);

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
                {" "}
                <DatePicker
                  className="w-100, custom-select"
                  placeholder="Select Date of Birth"
                  value={newPatient.dob ? moment(newPatient.dob) : null} // Convert to moment if it's in string format
                  onChange={(value) => handleSelectChange("dob", value)}
                  variant="borderless"
                  size="large"
                />
              </Form.Item>
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
                  {
                    required: true,
                    message: "Please select nationality",
                  },
                ]}
              >
                <Select
                  placeholder="Select Nationality"
                  className="w-100, custom-select"
                  //  options={relationshipOptions}
                  value={newPatient.nationality}
                  onChange={(value) => handleSelectChange("nationality", value)}
                  variant="borderless"
                  size="large"
                >
                  <Select.Option value="">--Select Nationality--</Select.Option>
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
                  size="large"
                >
                  <Select.Option value="">--Select County--</Select.Option>
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
                  onChange={(value) => handleSelectChange("subCounty", value)}
                  variant="borderless"
                  size="large"
                >
                  <Select.Option value="">--Select Sub County--</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-md-6 text-primary">
              <Form.Item
                label="County Ward:"
                name="countyWard"
                rules={[
                  {
                    required: true,
                    message: "Please select County Ward",
                  },
                ]}
              >
                <Select
                  placeholder="Select County Ward"
                  className="w-100, custom-select"
                  //  options={relationshipOptions}
                  value={newPatient.countyWard}
                  onChange={(value) => handleSelectChange("countyWard", value)}
                  variant="borderless"
                  size="large"
                >
                  <Select.Option value="">--Select County Ward--</Select.Option>
                </Select>
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
                  size="large"
                >
                  <Select.Option value="">--Select Clinic--</Select.Option>
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
          </div>

          {/* Conditional rendering of insurance fields */}
          {newPatient.paymentMode === "insurance" && (
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
            {
              !patientId? (
                <Button
              onClick={handleSubmit}
              disabled={loading}
              type="primary"
              size="large"
            >
              {loading ? <Spin /> : "Save Patient Details"}
            </Button>
            ):(
            
                <Button
              onClick={handleCreateVisit}
              disabled={visitLoading}
              type="primary"
              size="large"
            >
              {visitLoading ? <Spin /> : "Create Visit"}
            </Button>
              )
            }
            
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PatientRegistration;

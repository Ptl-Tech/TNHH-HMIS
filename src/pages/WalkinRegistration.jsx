// react and react based libraries
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

// external libraries
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
} from 'antd';
import moment from 'moment';
import { SaveOutlined } from '@ant-design/icons';

// internal components
import { listInsuranceOptions } from '../actions/DropdownListActions';
import { createWalkInPatient, listPatients } from '../actions/patientActions';
import { convertKeysToCamelCase } from '../utils/helpers';

// The component
const WalkinRegistration = () => {
  // State
  const { state } = useLocation();
  const { visitorData, patientDet } = state || {};
  const [age, setAge] = useState(null);
  const [errors, setErrors] = useState({});
  const [dobError, setDobError] = useState('');
  const [newPatient, setNewPatient] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dob: '',
    idNumber: '',
    phoneNumber: '',
    paymentMode: '',
    insuranceNo: '',
    insuranceName: '',
    insurancePrinicipalMemberName: '',
    isPrincipleMember: true,
    membershipNo: '',
    schemeName: '',
    howYouKnewABoutUs: '',
    email: '',
    residence: '',
    patientStatus: 0,
  });
  const { patients: patientListPayload } = useSelector(
    (state) => state.patientList,
  );
  const { data: insurancePayload } = useSelector((state) => state.getInsurance);
  // End of state

  console.log({ state });

  // hooks
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(listPatients());
    dispatch(listInsuranceOptions());
  }, [dispatch]);

  useEffect(() => {
    if (patientDet) {
      setNewPatient({
        idNumber: patientDet?.IDNumber || '',
        firstName:
          patientDet?.FirstName || patientDet?.SearchName.split(' ')[0] || '',
        middleName: patientDet?.MiddleName || '',
        lastName: patientDet?.LastName || '',
        gender: patientDet?.Gender === 'Male' ? '1' : '2' || '',
        dob: patientDet?.DateOfBirth || null,
        phoneNumber: patientDet?.TelephoneNo1 || '',
        paymentMode:
          patientDet?.PaymentMode === 'Cash'
            ? '1'
            : patientDet?.PaymentMode === 'Corporate'
            ? '2'
            : '1' || '',
        email: patientDet?.Email || '',
        residence: patientDet?.Residence || '',
      });
    }
  }, [patientDet]);

  // handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));

    if (name === 'idNumber') {
      // Validate the idNumber immediately when it changes
      const isRegistered = patientListPayload?.some(
        (existingPatient) => existingPatient.IDNumber === value,
      );

      // Update the errors state based on the ID number validation
      if (isRegistered) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          idNumber: 'This Patient is already registered.',
        }));
      } else {
        setErrors((prevErrors) => {
          const { idNumber, ...rest } = prevErrors; // Remove the previous error
          return rest; // Return the remaining errors
        });
      }
    }
  };

  const handleSelectChange = (name, value) => {
    // If the field is 'dob', format the value as 'YYYY-MM-DD'
    if (name === 'dob') {
      // Format the date as 'YYYY-MM-DD'
      value = value ? moment(value).format('YYYY-MM-DD') : '';
    }
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, dateString) => {
    if (!dateString) {
      setDobError('Date of birth is required.');
      setAge(null);
      return;
    }

    const today = moment();
    const dob = moment(dateString, 'YYYY-MM-DD');
    const years = today.diff(dob, 'years');
    const months = today.diff(dob, 'months') % 12; // Remaining months after full years

    if (years < 2) {
      setDobError('Patient must be at least 2 years old.');

      setAge(null);
    } else {
      setDobError('');
      setAge({ years, months }); // Store years and months in the state
      setNewPatient((prev) => ({ ...prev, dob: dateString }));
    }
  };

  const handleSwitchChange = (name, value) => {
    setNewPatient((prev) => {
      const updatedPatient = { ...prev, [name]: value };

      if (name === 'isPrincipleMember' && value) {
        // Set the insurancePrincipalMemberName in uppercase
        updatedPatient.insurancePrinicipalMemberName = `${
          prev.firstName || visitorData?.VisitorName
        } ${prev.middleName || ''} ${prev.lastName}`
          .trim()
          .toUpperCase();
      } else if (name === 'isPrincipleMember' && !value) {
        updatedPatient.insurancePrinicipalMemberName = ''; // Clear the name if unchecked
      }
      return updatedPatient;
    });
  };

  const handleDisplayDropDown = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));

    if (
      name === 'nationality' &&
      countriesPayload &&
      name === 'county' &&
      countiesPayload &&
      name === 'subCounty' &&
      subCountiesPayload &&
      name === 'CountyWard' &&
      subCountyWardsPayload &&
      name === 'nextOfKinRelationship' &&
      relationshipOptionsPayload &&
      name === 'insuranceName' &&
      insurancePayload &&
      name === 'howYouKnewABoutUs'
    ) {
      dispatch(listInsuranceOptions());
    }
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();

    // Prepare patient data
    const patientData = {
      firstName:
        newPatient.firstName ||
        visitorData?.FirstName ||
        visitorData?.firstName ||
        patientDet?.FirstName ||
        '',
      lastName:
        newPatient.lastName ||
        visitorData?.MiddleName ||
        visitorData?.lastName ||
        patientDet?.LastName ||
        '',
      middleName:
        newPatient.middleName ||
        visitorData?.LastName ||
        visitorData?.middleName ||
        patientDet?.MiddleName ||
        '',
      idNumber:
        newPatient.idNumber ||
        visitorData?.IDNumber ||
        patientDet?.IDNumber ||
        '',
      phoneNumber:
        newPatient.phoneNumber ||
        visitorData?.PhoneNumber ||
        patientDet?.TelephoneNo1 ||
        '',
      email: newPatient.email || patientDet?.Email || '',
      gender: newPatient.gender || patientDet?.Gender || '',
      dob: newPatient.dob || patientDet?.DateOfBirth || '',
      residence: newPatient.residence || '',
      paymentMode: newPatient.paymentMode || patientDet?.PatientType || '',
      insuranceNo: newPatient.insuranceNo || patientDet?.InsuranceNo || '',
      insurancePrinicipalMemberName:
        newPatient.insurancePrinicipalMemberName ||
        patientDet?.SearchName ||
        '',
      isPrincipleMember: newPatient.isPrincipleMember || patientDet?.Principal,
      membershipNo: newPatient.membershipNo || patientDet?.MembershipNo || '',
      insuranceName:
        newPatient.insuranceName || patientDet?.InsuranceName || '',

      myAction: 'create',
      patientNo: '', // Include patientNo only if editing
    };

    const errors = validateForm(newPatient);
    setErrors(errors);

    try {
      // Await the response from dispatch
      const response = await dispatch(createWalkInPatient(patientData));

      if (response?.patientNo) {
        message.success('Patient saved successfully.');

        // redirect them to dispatch the walk in
        const patientId = response.patientNo;
        navigate(`/Dashboard/visitors-list/Dispatch-Patient/${patientId}`);
      } else {
        message.error('Failed to save patient data. Please try again.');
      }
    } catch (error) {
      console.error('Error saving patient data:', error);
      const errorMessage =
        error.response?.data?.errors?.obj || error.response?.data?.errors;

      console.log({
        errorMessage,
        isArray: Array.isArray(errorMessage),
        message: errorMessage[0],
      });

      message.error(
        Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
      );
    }
  };

  const validateForm = (patient, visitorData, patientDet) => {
    const errors = {};

    // Nationality Validation
    if (!patient.nationality || patient.nationality.trim() === '') {
      errors.nationality = 'Nationality is required.';
    }

    // Email Validation
    const email = patient.email || visitorData?.Email || newPatient.email;
    if (!email || email.trim() === '') {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email must be a valid email address.';
    }

    // ID Number Validation
    if (patient.idNumber || visitorData?.IDNumber || patientDet?.IDNumber) {
      const isRegistered = patientListPayload?.some(
        (existingPatient) =>
          existingPatient.IDNumber === patient.idNumber ||
          visitorData?.IDNumber === patient.idNumber,
      );
      if (isRegistered) {
        errors.idNumber = 'This ID/Passport/Birth No is already registered.';
      }
    }

    return errors;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4 style={{ textAlign: 'center', color: '#E89641' }}>
          Walk-in Patient Registration
        </h4>
        {/* if patientdet exists show edit button */}
        {patientDet && (
          <Button
            type="primary"
            style={{ margin: '20px' }}
            onClick={() => handleEditPatient(patientDet)}
          >
            Edit
          </Button>
        )}
      </div>
      <div className="row">
        <div className="col-12 col-md-8">
          <Card
            title="Patient Information"
            style={{ width: '100%' }}
          >
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
                    style={{ width: '100%' }}
                    value={
                      newPatient.idNumber ||
                      visitorData?.IDNumber ||
                      patientDet?.IDNumber
                    }
                    onChange={handleInputChange}
                    className="text-center fw-bold"
                  />
                  {errors.idNumber && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
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
                    style={{ width: '100%' }}
                    value={
                      newPatient.firstName ||
                      visitorData?.FirstName ||
                      patientDet?.SearchName?.split(' ')[0] ||
                      patientDet?.FirstName?.split(' ')[0]
                    }
                    onChange={handleInputChange}
                    className="text-center fw-bold"
                  />
                  {errors.firstName && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
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
                    style={{ width: '100%' }}
                    value={
                      newPatient.middleName ||
                      visitorData?.MiddleName ||
                      patientDet?.SearchName?.split(' ')[1]
                    }
                    onChange={handleInputChange}
                    className="text-center fw-bold"
                  />
                  {errors.middleName && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
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
                    style={{ width: '100%' }}
                    value={
                      newPatient.lastName ||
                      visitorData?.LastName ||
                      patientDet?.SearchName?.split(' ')[2]
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
                      patientDet?.Gender === '1'
                        ? 'Male'
                        : 'Female'
                    }
                    onChange={(value) => handleSelectChange('gender', value)}
                  >
                    <Select.Option value="">--Select Gender-- </Select.Option>
                    <Select.Option
                      key={1}
                      value={1}
                    >
                      Male
                    </Select.Option>
                    <Select.Option
                      key={2}
                      value={2}
                    >
                      Female
                    </Select.Option>
                  </Select>{' '}
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Date of Birth:<span className="text-danger px-1">*</span>
                  </label>
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
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
                  {dobError && <span style={{ color: 'red' }}>{dobError}</span>}
                  {age !== null && (
                    <div className="text-success">
                      Age: {age.years} years {age.months} months
                    </div>
                  )}{' '}
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
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
                      {errors.phoneNumber}
                    </span>
                  )}
                </div>
                {/* email and residence input fields */}
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Email:<span className="text-danger px-1">*</span>
                  </label>
                  <Input
                    placeholder="Enter Email"
                    name="email"
                    value={newPatient.email || patientDet?.Email}
                    onChange={handleInputChange}
                    className="text-center fw-bold"
                  />
                  {errors.email && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="col-12 col-md-4">
                  <label className="py-1">
                    Residence:<span className="text-danger px-1">*</span>
                  </label>
                  <Input
                    placeholder="Enter Residence"
                    name="residence"
                    value={newPatient.residence || patientDet?.Residence}
                    onChange={handleInputChange}
                    className="text-center fw-bold"
                  />
                  {errors.phoneNumber && (
                    <span style={{ color: 'red', fontSize: '0.875rem' }}>
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
              <Button onClick={() => navigate(-1)}>Back</Button>
            </div>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card
            title="Billing Details"
            style={{ width: '100%' }}
          >
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
                      backgroundColor: '#87d068',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {`${
                      newPatient.firstName?.charAt(0).toUpperCase() ||
                      visitorData?.FirstName?.charAt(0).toUpperCase() ||
                      ''
                    }${
                      newPatient.lastName?.charAt(0).toUpperCase() ||
                      visitorData?.MiddleName?.charAt(0).toUpperCase() ||
                      '' ||
                      visitorData?.LastName?.charAt(0).toUpperCase() ||
                      ''
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
                    name="paymentMode"
                    value={
                      newPatient.paymentMode ||
                      (patientDet?.PatientType === 'Corporate'
                        ? '1'
                        : patientDet?.PatientType === 'Cash'
                        ? '2'
                        : '')
                    }
                    onChange={(value) =>
                      handleSelectChange('paymentMode', value)
                    }
                  >
                    <Select.Option value="">--Select--</Select.Option>
                    <Select.Option value="2">Cash</Select.Option>
                    <Select.Option value="1">Insurance</Select.Option>
                    {/* <Select.Option value="3">Corporate</Select.Option> */}
                  </Select>
                </div>
                {/* Insurance Input Fields */}
                {newPatient.paymentMode !== '2' &&
                  newPatient.paymentMode !== '' && (
                    <div className="row g-2">
                      <div className="col-12 ">
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
                            handleSelectChange('insuranceNo', value)
                          }
                          name="insuranceNo"
                          onFocus={handleDisplayDropDown}
                          showSearch
                          // filterOption = {true}
                          filterOption={(input, option) =>
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
                          }
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
                            <Select.Option
                              value=""
                              disabled
                            >
                              No data available
                            </Select.Option>
                          )}
                        </Select>
                      </div>
                      <div className="col-12 ">
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
                {newPatient.paymentMode !== '2' &&
                  newPatient.paymentMode !== '' && (
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
                              newPatient.insurancePrinicipalMemberName ||
                              patientDet?.InsurancePrincipalMemberName ||
                              ''
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
                            newPatient.isPrincipleMember ||
                            patientDet?.Principal
                          }
                          onChange={(checked) =>
                            handleSwitchChange('isPrincipleMember', checked)
                          }
                          size="large"
                          style={{ margin: '0 10px' }}
                        />
                      </div>
                    </>
                  )}
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WalkinRegistration;

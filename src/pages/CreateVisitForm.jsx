import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  listDoctors,
  listInsuranceOptions,
  listClinics,
} from '../actions/DropdownListActions';
import {
  appmntList,
  createTriageVisit,
  listPatients,
  postTriageVisit,
} from '../actions/patientActions';
import { IoCaretBack, IoCloseOutline } from 'react-icons/io5';

const CreateVisitForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get('PatientNo');
  const { state } = location; // Access the state passed via navigate
  const { patientData, existingPatient, visitData } = state || {}; // Destructure patient data if available
  const { loading, patients: visitPatients } = useSelector(
    (state) => state.appmntList,
  );
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

  const {
    loading: editPatientLoading,
    success: editPatientSuccess,
    error: editPatientError,
    data: editPatientPayload,
  } = useSelector((state) => state.createPatient);
  const [newVisit, setNewVisit] = useState({
    clinic: '',
    doctor: '',
    paymentMode: '',
    insuranceNo: '',
    membershipNo: '',
    patientType: '',
    // appointmentType: "",
    insuranceNo: '',
    gender: '',
    // dob: "",
    insuranceName: '',
    insurancePrincipalMemberName: '',
    isPrincipleMember: false,
    schemeName: '',
  });

  console.log({ patientData });

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null);
  useEffect(() => {
    dispatch(listInsuranceOptions());
    dispatch(listClinics()); // Ensure clinics are loaded
    dispatch(listDoctors()); // Ensure doctors are loaded
    dispatch(listPatients());
    dispatch(appmntList());
  }, [dispatch]);

  useEffect(() => {
    const branchCode = localStorage.getItem('branchCode'); // Fetch branch code from localStorage
    if (doctorsPayload) {
      let filtered;

      if (newVisit.clinic === 'PSYCHOLOGIST') {
        // If clinic is PSYCHOLOGY, do not filter by branch code
        filtered = doctorsPayload.filter(
          (doctor) => doctor.Specialization === newVisit.clinic,
        );
      } else if (newVisit.clinic === 'PSYCHIATRIST') {
        // If clinic is PSYCHIATRY, filter by both specialization and branch code
        filtered = doctorsPayload.filter(
          (doctor) =>
            doctor.Specialization === newVisit.clinic &&
            doctor.GlobalDimension1Code === branchCode,
        );
      } else {
        // Default filtering for other clinics
        filtered = doctorsPayload.filter(
          (doctor) => doctor.Specialization === newVisit.clinic,
          // && doctor.GlobalDimension1Code === branchCode
        );
      }

      setFilteredDoctors(filtered); // Update the filtered doctors list
    }
  }, [doctorsPayload, newVisit.clinic]);

  const savepatientVisit = async () => {
    if (newVisit.clinic === 'PSYCHIATRY' || newVisit.clinic === 'PSYCHOLOGY') {
      if (!newVisit.doctor) {
        message.error('Please select a doctor before saving the visit.');
        return;
      }
    }

    try {
      const visitData = {
        patientNo:
          patientNo ||
          patientData?.patientNo ||
          existingPatient?.PatientNo ||
          patientData?.PatientNo ||
          visitData?.PatientNo,
        clinic: newVisit.clinic,
        doctor: newVisit.doctor,
        paymentMode: newVisit.paymentMode,
        insuranceNo: newVisit.insuranceNo || existingPatient?.InsuranceNo,
        membershipNo: newVisit.membershipNo || existingPatient?.MembershipNo,
        insurancePrincipalMemberName:
          newVisit.insurancePrincipalMemberName || existingPatient?.SearchName,
        isPrincipleMember:
          newVisit.isPrincipleMember || existingPatient?.Principal,
        schemeName: newVisit.schemeName || existingPatient?.SchemeName,
      };

      const response = await dispatch(createTriageVisit(visitData));

      if (response) {
        const newAppointmentId = response;
        console.log('Visit created with ID:', newAppointmentId);
        message.success('Visit created successfully!');

        setAppointmentId(newAppointmentId);

        // Call dispatchPatient after successfully setting the appointment ID
        // dispatchPatient(newAppointmentId);
      } else {
        throw new Error('Failed to retrieve appointment ID');
      }
    } catch (error) {
      console.error('Error creating visit:', error);
      message.error('Failed to create visit!');
    }
  };

  const dispatchPatient = async (appointmentId) => {
    if (!appointmentId) {
      message.error('Appointment ID is required!');
      return;
    }

    if (newVisit.clinic === 'PSYCHIATRY' || newVisit.clinic === 'PSYCHOLOGY') {
      if (!newVisit.doctor) {
        message.error('Please select a doctor before dispatching the patient.');
        return;
      }
    }

    try {
      console.log('Dispatching patient with appointment ID:', appointmentId);

      await dispatch(postTriageVisit({ appointmentNo: appointmentId }));
    } catch (postTriageVisitError) {
      console.error('Error dispatching patient:', error);
      //display error message from postTriageVisitError
      message.error(postTriageVisitError, error);
    }
  };

  const handleSwitchChange = (name, value) => {
    setNewVisit((prev) => {
      const updatedVisitData = { ...prev, [name]: value };

      if (name === 'isPrincipleMember' && value) {
        // Set the insurancePrincipalMemberName in uppercase
        updatedVisitData.insurancePrincipalMemberName =
          existingPatient?.FirstName ||
          existingPatient?.SearchNames ||
          existingPatient?.SearchName ||
          `${patientData?.firstName} ${patientData?.middleName} ${patientData?.lastName} `
            .trim()
            .toUpperCase();
      } else if (name === 'isPrincipleMember' && !value) {
        updatedVisitData.insurancePrincipalMemberName = ''; // Clear the name if unchecked
      }
      return updatedVisitData;
    });
  };

  const handleInputChange = (field, value) => {
    if (field === 'doctor') {
      setNewVisit((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewVisit((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Use the selected DoctorID to find the doctor for display
  const selectedDoctor = filteredDoctors.find(
    (doc) => doc.DoctorID === newVisit.doctor,
  );

  const handleEditPatient = () => {
    if (typeof patientNo !== 'string') {
      console.error('Invalid patientNo:', patientNo);
      return;
    }

    // Fetch patientNo starts with WLK navigate to walk-in registration else navigate to outpatient registration with patient data
    if (patientNo.startsWith('WLK')) {
      navigate(`/reception/Register-walkin?PatientNo=${patientNo}`, {
        state: { patientDet: existingPatient },
      });
    } else {
      navigate(`/reception/Patient-Registration?PatientNo=${patientNo}`, {
        state: { patientDet: existingPatient },
      });
    }
  };

  const fullNameGenerator = (namesArray) => {
    return namesArray
      .flatMap((item) => item)
      .reduce((acc, curr) => {
        if (curr) {
          acc.push(curr);
        }

        console.log({ acc });
        return acc;
      }, [])
      .join(' ');
  };

  return (
    <div>
      <div>
        <div className="d-flex align-items-center pb-3 justify-content-between  w-100">
          <div className="div">
            <h4
              className="text-start px-3"
              style={{ color: '#E89641' }}
              id="appointment-card"
            >
              Create Visit
            </h4>
          </div>
          <div className=" d-flex align-items-center justify-content-end gap-3">
            <Button
              type="primary"
              size="medium"
              className="pr-3 mr-3"
              onClick={savepatientVisit}
            >
              Save Visit
            </Button>
            <Button
              type="primary"
              size="medium"
              className="pr-3 mr-3"
              onClick={() => dispatchPatient(appointmentId)}
            >
              Dispatch to Triage
            </Button>
            <Button onClick={handleEditPatient}>Edit Patient</Button>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-8">
            <Card
              title="Patient Information"
              style={{ width: '100%' }}
            >
              <Form>
                <div className="row px-3 py-2 align-items-center justify-content-between">
                  <div className="col-12 col-md-6">
                    <label className="py-1">
                      Patient No:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      label="Patient No"
                      value={
                        patientNo ||
                        patientData?.patientNo ||
                        existingPatient?.PatientNo ||
                        patientData?.PatientNo ||
                        visitData?.PatientNo
                      }
                      disabled
                      className="text-success fw-bold"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="py-1">
                      Patient Names:<span className="text-danger px-1">*</span>
                    </label>
                    <Input
                      disabled
                      label="Patient Names"
                      className="text-dark fw-medium"
                      value={fullNameGenerator([
                        existingPatient?.SearchNames?.split(' '),
                        existingPatient?.FirstName,
                        existingPatient?.SearchName?.split(' '),
                        patientData?.firstName,
                        patientData?.surname,
                        patientData?.middleName,
                        patientData?.lastName,
                      ])}
                    />
                  </div>
                </div>
                <div className="row px-3 py-2 mb-2 align-items-center justify-content-between">
                  <div className="col-12 col-md-6">
                    <label className="py-1">
                      Clinic :<span className="text-danger px-1">*</span>
                    </label>
                    <Select
                      placeholder="Select Clinic"
                      className="w-100"
                      value={newVisit.clinic}
                      onChange={(value) => handleInputChange('clinic', value)}
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value="">--Select Clinic--</Select.Option>
                      {clinicsPayload &&
                        clinicsPayload.map((clinic) => (
                          <Select.Option
                            key={clinic.No}
                            value={clinic.No}
                          >
                            {clinic.Description}
                          </Select.Option>
                        ))}
                    </Select>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="py-1">
                      Doctor:<span className="text-danger px-1">*</span>
                    </label>
                    <Select
                      placeholder="Select Doctor"
                      className="w-100"
                      value={newVisit.doctor} // This will hold the DoctorID
                      onChange={(value) => handleInputChange('doctor', value)} // Update DoctorID
                      showSearch
                      // filterOption = {true}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      disabled={!newVisit.clinic}
                    >
                      <Select.Option value="">--Select Doctor--</Select.Option>
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
                      value={
                        newVisit.paymentMode === '1'
                          ? 'Insurance'
                          : newVisit.paymentMode === '2'
                          ? 'Cash'
                          : ''
                      }
                      onChange={(value) =>
                        handleInputChange('paymentMode', value)
                      }
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Select.Option value="">--Select--</Select.Option>
                      <Select.Option value="1">Insurance</Select.Option>
                      <Select.Option value="2">Cash</Select.Option>
                    </Select>
                  </div>

                  {newVisit.paymentMode === '1' && (
                    <div className="col-12 col-md-6">
                      <label className="py-1">
                        Insurance Name:
                        <span className="text-danger px-1">*</span>
                      </label>
                      <Select
                        placeholder="Select Insurance"
                        className="w-100"
                        value={
                          newVisit.insuranceNo ||
                          insurancePayload?.find(
                            (insurance) =>
                              insurance.No === existingPatient?.InsuranceNo,
                          )?.No ||
                          ''
                        }
                        onChange={(value) =>
                          handleInputChange('insuranceNo', value)
                        }
                        disabled={newVisit.paymentMode !== '1'}
                        showSearch
                        allowClear
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
                  )}
                </div>

                {newVisit.paymentMode === '1' && (
                  <>
                    <div className="row px-3 py-2 align-items-center justify-content-between">
                      <div className="col-12 col-md-6">
                        <label className="py-1">
                          Membership No:
                          <span className="text-danger px-1">*</span>
                        </label>
                        <Input
                          label="Membership No"
                          value={
                            newVisit.membershipNo ||
                            existingPatient?.MembershipNo
                          }
                          onChange={(e) =>
                            handleInputChange('membershipNo', e.target.value)
                          }
                          disabled={newVisit.paymentMode !== '1'}
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="py-1">
                          Insurance Scheme Name:
                          <span className="text-danger px-1">*</span>
                        </label>
                        <Input
                          label="Insurance Scheme"
                          value={
                            newVisit.schemeName || existingPatient?.SchemeName
                          }
                          onChange={(e) =>
                            handleInputChange('schemeName', e.target.value)
                          }
                          disabled={newVisit.paymentMode !== '1'}
                        />
                      </div>
                    </div>
                    <div className="row px-3 py-2 align-items-center justify-content-between">
                      <div className="col-md-6">
                        <label className="py-1">
                          Principal Name:
                          <span className="text-danger px-1">*</span>
                        </label>
                        <Input
                          label="Principal Name"
                          value={
                            newVisit.insurancePrincipalMemberName ||
                            existingPatient?.SearchName
                          } // Use insurancePrincipalMemberName here
                          onChange={(e) =>
                            handleInputChange(
                              'insurancePrincipalMemberName',
                              e.target.value,
                            )
                          }
                          disabled={
                            newVisit.paymentMode !== '1' ||
                            newVisit.isPrincipleMember
                          } // Disable if the user is the principal member
                          style={{
                            width: '100%',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="py-1">
                          Is Principle Member:
                          <span className="text-danger px-1">*</span>
                        </label>
                        <Switch
                          checked={
                            newVisit.isPrincipleMember ||
                            existingPatient?.Principal
                          }
                          onChange={(checked) =>
                            handleSwitchChange('isPrincipleMember', checked)
                          }
                          disabled={newVisit.paymentMode !== '1'}
                        />
                      </div>
                    </div>
                  </>
                )}
              </Form>
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
                  <div className="d-flex my-4 align-items-center justify-content-center">
                    <Avatar
                      size={100}
                      style={{
                        backgroundColor: '#87d068',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {`${
                        patientData?.firstName?.charAt(0) ||
                        existingPatient?.LastName?.charAt(0) ||
                        ''
                      }${
                        patientData?.lastName?.charAt(0) ||
                        existingPatient?.LastName?.charAt(1).toUpperCase() ||
                        ''
                      }`}
                    </Avatar>
                  </div>
                  {/* Add dynamic data fields for patientType, settlementType, clinic, doctor */}
                  <div className="col-12 mb-4">
                    <p>
                      <strong>Patient Type:</strong>{' '}
                      {patientData?.paymentMode === '1'
                        ? 'Insurance'
                        : patientData?.paymentMode === '2'
                        ? 'Cash'
                        : existingPatient?.PatientType || 'N/A'}
                    </p>

                    <p>
                      <strong>Settlement Type:</strong>{' '}
                      {newVisit.paymentMode === '1'
                        ? 'Insurance'
                        : newVisit.paymentMode === '2'
                        ? 'Cash'
                        : 'N/A'}
                    </p>
                    <p>
                      <strong>Clinic:</strong> {newVisit.clinic || 'N/A'}
                    </p>
                    <p>
                      <strong>Doctor:</strong>{' '}
                      {selectedDoctor ? selectedDoctor.DoctorsName : 'N/A'}
                    </p>

                    {/* <p>
                      <strong>Total Billed:</strong>{" "}
                      {newVisit.totalBilled || "0.00"}
                    </p> */}
                  </div>
                </div>
              </Form>
            </Card>
            <div className="float-end mt-3">
              <Button onClick={() => navigate(-1)}>
                <IoCaretBack />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateVisitForm;

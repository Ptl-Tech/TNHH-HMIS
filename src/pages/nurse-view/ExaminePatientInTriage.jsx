import { Card, Tabs, Button, Modal, message } from 'antd'
import { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientDetails } from '../../actions/triage-actions/getPatientDetailsSlice';
import PatientDetailPage from './PatientDetailPage';
import FormVitals from './forms/triage-forms/Vitals';
import AllergyAndMedication from './forms/triage-forms/AllergyAndMedication';
import Injections from './forms/triage-forms/Injections';
import Dressing from './forms/triage-forms/Dressing';
import VitalsTable from './tables/triage-tables/VitalsTable';
import AllergyAndMedicationTable from './tables/triage-tables/AllergyAndMedicationTable';
import InjectionTable from './tables/triage-tables/Injection';
import DressingTable from './tables/triage-tables/DressingTable';
import { getTriageListDetails } from '../../actions/triage-actions/getTriageListDetailsSlice';
import { postTriageListVitalsSlice } from '../../actions/triage-actions/postTriageListVitalsSlice';
import { getVitalsLinesSlice } from '../../actions/triage-actions/getVitalsLinesSlice';
import useAuth from '../../hooks/useAuth';
import { getAllergiesAndMedicationsSlice } from '../../actions/triage-actions/getAllergiesAndMedicationsSlice';
import { postAllergiesMedicationSlice } from '../../actions/triage-actions/postAllergiesMedicationSlice';


const EvaluatePatientInTriage = () => {
  const [onModalOpen, setOnModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null);
  const dispatch = useDispatch();

  const { patientDetails } = useSelector((state) => state.getPatientDetails);
  const { triageListDetail }  = useSelector((state) => state.getTriageListDetails);
  const {loading} = useSelector((state) => state.postTriageListVitals);
  const {loadingVitalsLines, vitalsLines} = useSelector((state) => state.getVitalsLines);
  const {allergyMedicationLoading, allergiesMedication} = useSelector((state) => state.getAllergiesAndMedications);

  const userDetails = useAuth();

  const staffNo = userDetails?.userData?.firstName
  const observationNo = triageListDetail?.ObservationNo;

 console.log('allergies and medication', allergiesMedication)

  const [ formData, setFormData ] = useState({ });

  //getting the patientNo from the url
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientNo = searchParams.get('Patient_id');


  //dispatch an action to get the patient's details
  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientDetails(patientNo));
      dispatch(getTriageListDetails(patientNo));
      dispatch(getVitalsLinesSlice(patientNo));
    }
  }, [dispatch, patientNo]);

  useEffect(() => {
    if (observationNo) {
      dispatch(getAllergiesAndMedicationsSlice(observationNo));
    }
  }, [dispatch, observationNo]);


  const [activeTab, setActiveTab] = useState('vitals');

  const handleTabChange = (key) => {
    setActiveTab(key);
    setOnModalOpen(false); // Close any open modal when switching tabs
    setModalContent(null); // Reset modal content to avoid stale data
  };


  const handleOpenModal = () => {
    const formFields = getFormFieldsForTab(activeTab); // Dynamically get form fields
    setModalContent(formFields); // Update modal content
    setOnModalOpen(true);
  }

  const getFormFieldsForTab = (tabKey) => {
    switch (tabKey) {
      case 'vitals':
        return (
          <FormVitals handleOnChange={handleOnChange} setFormData={setFormData} 
          triageListDetail={triageListDetail}
          />
        );
      case 'allergy':
        return (
          <AllergyAndMedication handleOnChange={handleOnChange} setFormData={setFormData} handleSelectChange={handleSelectChange} activeTab={activeTab} formData={formData} triageListDetail={triageListDetail} staffNo={staffNo}/>
        );
        case 'injections':
        return (
          <Injections handleOnChange={handleOnChange} setFormData={setFormData} handleDateChange={handleDateChange} handleTimeChange={handleTimeChange} activeTab={activeTab} formData={formData}/>
        );
        case 'dressing':
        return (
          <Dressing handleOnChange={handleOnChange} setFormData={setFormData}/>
        );
      default:
        return null;
    }
  };


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [activeTab]: {
        ...prevState[activeTab],
        [name]: value,
      },
    }));
  };


// DatePicker handler (specific to date fields)
const handleDateChange = (date, dateString, name) => {
  setFormData((prevState) => ({
    ...prevState,
    [activeTab]: {
      ...prevState[activeTab],
      [name]: dateString, // Save formatted date
    },
  }));
};

const handleTimeChange = (time, timeString, name) => {
  setFormData((prevState) => ({
    ...prevState,
    [activeTab]: {
      ...prevState[activeTab],
      [name]: timeString, // Save the formatted time
    },
  }));
};

const handleSelectChange = (value, name) => {
  setFormData((prevState) => ({
    ...prevState,
    [activeTab]: {
      ...prevState[activeTab],
      [name]: value, // Save the selected value
    },
  }));
};

const cleanValue = (value) => {
  if (typeof value === "string") {
    // Remove any non-numeric characters if applicable
    return value.replace(/[^\d.-]/g, "");
  }
  return value;
};

  const handleSaveModalData = () => {
    // switch the active tab and call appropriate save action
    switch(activeTab) {
      case 'vitals':{
        // Save vitals data
       
        const { pulseRate, pain, height, weight, temperature, bloodPreasure, sP02,respirationRate } = formData[activeTab];
        const vitalsData = {
          pulseRate,
          Pain: parseInt(cleanValue(pain)),
          Height: parseFloat(cleanValue(height)),
          Weight: parseFloat(cleanValue(weight)),
          Temperature: parseFloat(cleanValue(temperature)),
          bloodPreasure,
          sP02,
          respirationRate,
          patientNo,
          observationNo,
          type: 0,
          myAction: "create"

        };

        dispatch(postTriageListVitalsSlice(vitalsData)).then((data)=>{
          if(data?.status === "success"){
            message.success(data?.status);
            setFormData({});
            setOnModalOpen(false);
            dispatch(getVitalsLinesSlice(patientNo));
          }else{
            message.error('Error saving vitals data');
            setFormData({});
            setOnModalOpen(false);
          }
        })
        
        break;
      }
      case 'allergy':{
        // Save allergy and medication data
        const { complains, reasonForVisit, foodAllergy, drugAllergy} = formData[activeTab];
        const allergyAndMedicationData = {
          
          complains,
          reasonForVisit: parseInt(cleanValue(reasonForVisit)),
          foodAllergy,
          drugAllergy,
          patientNo,
          staffNo: staffNo,
          observationNo,
          assessedBy: staffNo,
          myAction: "create"

        };

        dispatch(postAllergiesMedicationSlice(allergyAndMedicationData)).then((data)=>{
          console.log('dispatching the data', data);
          if(data?.status === "success"){
            message.success(data?.status);
            setFormData({});
            setOnModalOpen(false);
            dispatch(getAllergiesAndMedicationsSlice(observationNo));
          }else{
            message.error('Error saving vitals data');
            setFormData({});
            setOnModalOpen(false);
          }
        })
        break;
      }
      case 'injections':{
        // Save injections data
        console.log(formData[activeTab]);
        break;
      }
      case 'dressing':{
        // Save dressing data
        console.log(formData[activeTab]);
        break;
      }
      default:
        break;
    }
    // setOnModalOpen(false); // Close modal
  };

  return (
    <>
    <Card style={{ padding: '24px 10px 10px 10px' }}>
          <PatientDetailPage patientDetails={patientDetails}/>
          
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <Tabs.TabPane tab="Vitals" key="vitals">
            <Button type="primary" onClick={handleOpenModal}>
              <PlusOutlined />
              Add Vitals
              </Button>
              <VitalsTable handleOpenModal={handleOpenModal} vitalsLines={vitalsLines} loadingVitalsLines={loadingVitalsLines}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Allergy and Medication" key="allergy">
            <Button type="primary" onClick={handleOpenModal}>
              <PlusOutlined />
              Add allergy and medication
            </Button>
            <AllergyAndMedicationTable handleOpenModal={handleOpenModal} allergiesMedication={allergiesMedication} allergyMedicationLoading={allergyMedicationLoading}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Injections" key="injections">
            <Button type="primary" onClick={handleOpenModal}>
              <PlusOutlined />
              Add injections
            </Button>
            <InjectionTable handleOpenModal={handleOpenModal}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Dressing" key="dressing">
            <Button type="primary" onClick={handleOpenModal}>
              <PlusOutlined />
              Add Dressing
            </Button>
            <DressingTable handleOpenModal={handleOpenModal}/>
          </Tabs.TabPane>
          </Tabs>

    </Card>

    <Modal
      title="Patient Triage Details"
      open={onModalOpen}
      onCancel={() => setOnModalOpen(false)}
      onOk={handleSaveModalData}
      width={800}
      confirmLoading={loading}
    >
      {modalContent}
    </Modal>
    </>
  )
}

export default EvaluatePatientInTriage
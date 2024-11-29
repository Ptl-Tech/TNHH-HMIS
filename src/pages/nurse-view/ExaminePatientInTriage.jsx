import { Card, Tabs, Button, Modal } from 'antd'
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


const EvaluatePatientInTriage = () => {
  const [onModalOpen, setOnModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState(null);
  const dispatch = useDispatch();
  const [ formData, setFormData ] = useState({});

  //getting the patientNo from the url
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientNo = searchParams.get('Patient_id');

  const { patientDetails } = useSelector((state) => state.getPatientDetails);

  //dispatch an action to get the patient's details
  useEffect(() => {
      patientNo && dispatch(getPatientDetails(patientNo));
  }, [dispatch, patientNo])


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
          <FormVitals handleOnChange={handleOnChange} setFormData={setFormData}/>
        );
      case 'allergy':
        return (
          <AllergyAndMedication handleOnChange={handleOnChange} setFormData={setFormData} handleSelectChange={handleSelectChange} activeTab={activeTab} formData={formData} />
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

  const handleSaveModalData = () => {
    console.log('Saving data for:', activeTab);
    console.log('Data:', formData[activeTab]);
    setOnModalOpen(false); // Close modal
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
              <VitalsTable handleOpenModal={handleOpenModal}/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Allergy and Medication" key="allergy">
            <Button type="primary" onClick={handleOpenModal}>
              <PlusOutlined />
              Add allergy and medication
            </Button>
            <AllergyAndMedicationTable handleOpenModal={handleOpenModal}/>
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
    >
      {modalContent}
    </Modal>
    </>
  )
}

export default EvaluatePatientInTriage
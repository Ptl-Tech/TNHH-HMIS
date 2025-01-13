import { Alert, Button, Card, Col, Form, message, Modal, Row, Select, Space, Typography } from "antd"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { POST_ADMISSION_FORM_DETAILS_FAILURE, POST_ADMISSION_FORM_DETAILS_SUCCESS, postAdmissionFormDetailsSlice } from "../../../../actions/nurse-actions/postAdmissionFormDetailsSlice";
import { POST_PATIENT_ADMISSION_FAIL, POST_PATIENT_ADMISSION_SUCCESS, postPatientAdmission } from "../../../../actions/Doc-actions/Admission/postAdmitPatient";
import { useGetWardManagementHook } from "../../../../hooks/useGetWardManagementHook";

const AdmitPatientForm = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const patientDetails = location.state?.patientDetails || {};
  const dispatch = useDispatch();

  const {getBeds, loadingWards, getWards, loadingAdmissionDetails, wardRooms } = useGetWardManagementHook();

  const [ selectedWard, setSelectedWard] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [resetMessage, setResetMessage] = useState('');
  const [hasSelectedWard, setHasSelectedWard] = useState(false);  
  const [hasSelectedRoom, setHasSelectedRoom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertType, setAlertType] = useState('info');
  
  const patientInfo = [
    { title: 'Patient Name', value: patientDetails?.Names },
    { title: 'Patient Number', value: patientDetails?.PatientNo },
    { title: 'Visit Number', value: patientDetails?.LinkNo },
    { title: "Doctor's Name", value: patientDetails?.DoctorName }
  ];

  const [form] = Form.useForm();
  const { confirm } = Modal;

  const filteredRooms = selectedWard
    ? wardRooms.filter((room) => room.Ward_No === selectedWard)
    : [];
    const filteredBeds = selectedRoom
    ? getBeds.filter((bed) => bed.Room_No === selectedRoom)
    : [];

    const handleWardChange = (value) => {
      setSelectedWard(value);
      setSelectedRoom(null);
      setSelectedBed(null); 
      if (hasSelectedWard && value) {
        setResetMessage('You have changed the ward, so room and bed selections have been cleared.');
        setAlertType('info');
      }
  
      setHasSelectedWard(true);
    };
    const handleRoomChange = (value) => {
      setSelectedRoom(value);
      setSelectedBed(null);
      if (hasSelectedWard && !hasSelectedRoom && value) {
        setHasSelectedRoom(true);
      } else if (hasSelectedRoom && value) {
        setResetMessage('You have changed the room, so bed selection has been cleared.');
        setAlertType('info');
      }
    };

    const handleBedChange = (value) => {
      setSelectedBed(value);
      setResetMessage('');
    };
  
  const onFinish = async (values) => {
    const { bed, ward, room } = values;
    const formData = {
      myAction: 'edit',
      recId: patientDetails?.SystemId,
      admissionNo: patientDetails?.No,
      admissionType:  room,
      ward,
      bed,
    }

    try{
      const result = await dispatch(postAdmissionFormDetailsSlice((formData)));
      console.log('Admission Form Details:', result);
      if(result.type === POST_ADMISSION_FORM_DETAILS_SUCCESS){
        setResetMessage(result.payload.message || 'Admission Form Details Submitted Successfully')
        setAlertType('success');
        form.resetFields();
        setIsSubmitting(true);
      }else if(result.type === POST_ADMISSION_FORM_DETAILS_FAILURE){
        setResetMessage( result.payload.message || 'Admission Form Details Failed to Submit');
        setAlertType('error');
      }
    }catch(error){
        message.error(error.message || 'An error occurred');
    }
  }

  const handleAdmitPatient = async () => {
    confirm({
      title: 'Confirm Patient Admission',
      content: `Are you sure you want to admit ${patientDetails?.Names} ?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk(){
          return new Promise((resolve, reject) => {
              handleAdmitPatientAction()
              .then(resolve) // Resolve the modal when successful
              .catch(reject); // Reject on failure
          });
      },
  })
  }

  const handleAdmitPatientAction = async () => {
    try{
      const result = await dispatch(postPatientAdmission({admissionNo: patientDetails?.No}));
      if(result.type === POST_PATIENT_ADMISSION_SUCCESS){
        setAlertType(result.payload.message || 'Patient Admitted Successfully')
        setAlertType('success');
        form.resetFields();
      }else if(result.type === POST_PATIENT_ADMISSION_FAIL){
        setResetMessage(result.payload.message || 'Patient Admission Failed')
        setAlertType('error');
      }
    }catch(error){
      message.error(error.message || 'Unexpected error occurred');
      setResetMessage(error.message || 'Unexpected error occurred')
    }
  }


  useEffect(()=>{
    if(!location.state){
      navigate('/Nurse/Dashboard');
    }
  }, [location.state, navigate])

  // Disable admit patient button after details has been saved
  useEffect(() => {
    if (loadingAdmissionDetails) {
      setIsSubmitting(false);
    }
  }, [loadingAdmissionDetails]);

  return (
    <>
     
    <Row gutter={16}>
    {patientInfo.map((info, index) => (
    <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6}>
    <Card className="admit-patient-card-container" style={{ borderTop: '3px solid #0f5689'}}>
      <Typography.Title level={5} style={{ color: '#0f5689' }}>
        {info.title}
      </Typography.Title>
      <Typography.Text>
        {info.value}
      </Typography.Text>
    </Card>
    </Col>
    ))}
    </Row>

    {resetMessage && (
        <Alert
          message={resetMessage}
          style={{ marginTop: '30px' }}
          type={alertType}
          showIcon
          closable
          onClose={() => setResetMessage('')} 
        />
      )}

    <Card style={{ marginTop: '30px' }}>
        <Form layout="vertical" 
        className="admit-patient-card-container"
        form={form}
        onFinish={onFinish}
        >
        
        <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item 
                  label="Select Ward"
                  name='ward'
                  rules={[
                    {
                      required: true,
                      message: 'Ward field is required!',
                    }
                  ]} 
                 
                >
                <Select 
                  onChange={handleWardChange}
                  optionFilterProp="label"
                  key={`ward-${selectedWard}`}
                  loading={loadingWards}
                  allowClear
                  options={getWards?.map((ward) => ({
                    value: ward.Ward_Code,
                    label: ward.Ward_Name,
                  }))
                  }
                  placeholder="Select ward"
                  showSearch
                
                />
               
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item 
              label="Room Number" 
              name='room'
              rules={[
                {
                  required: true,
                  message: 'Room Number is required!',
                }
              ]}
              >
                  <Select 
                    key={`room-${selectedWard}-${selectedRoom}`}
                    placeholder="Select Room"
                    allowClear
                    showSearch
                    value={selectedRoom}
                    onChange={handleRoomChange}
                    disabled={!selectedWard} // Disable if no ward is selected
                    options={filteredRooms?.map((room) => ({
                      value: room.Room_Name,
                      label: room.Room_Name,
                    }))
                  }
                  />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <Form.Item 
              label="Select Bed" 
              name='bed'
              rules={[
                {
                  required: true,
                  message: 'Bed field is required!',
                }
              ]}
               >
                <Select
                  key={`bed-${selectedRoom}-${selectedBed}`} 
                  placeholder="Select Bed"
                  showSearch
                  allowClear
                  value={selectedBed}
                  onChange={handleBedChange} // Handle bed selection
                  disabled={!selectedRoom} // Disable if no room is selected
                  options={filteredBeds?.map((bed) => ({
                    value: bed.BedNo,
                    label: bed.BedName,
                  }))
                }
                />
              </Form.Item>
            </Col>
            
        </Row>
        <Space style={{ marginTop: '20px' }}>
            <Form.Item >
                <Button type="primary" 
                htmlType="submit"
                loading={loadingAdmissionDetails}
                disabled={loadingAdmissionDetails}
                >
                  Save Admission
                </Button>
            </Form.Item>
            <Form.Item >
                <Button type="primary" 
                onClick={handleAdmitPatient} 
                // disabled={!loadingAdmissionDetails}
                >
                  Admit Patient
                </Button>
            </Form.Item>
        </Space>
        </Form>
        </Card>
    </>
    
  )
}

export default AdmitPatientForm
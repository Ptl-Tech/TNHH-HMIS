import { Button, Card, Col, Form, message, Modal, Row, Select, Space, Typography } from "antd"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPgBedsSlice } from "../../../../actions/nurse-actions/getPgBedsSlice";
import { getPgWardsListSlice } from "../../../../actions/nurse-actions/getPgWardsListSlice";
import { POST_ADMISSION_FORM_DETAILS_SUCCESS, postAdmissionFormDetailsSlice } from "../../../../actions/nurse-actions/postAdmissionFormDetailsSlice";
import { POST_CANCEL_ADMISSION_FAILURE } from "../../../../actions/nurse-actions/postCancelAdmissionSlice";
import { POST_PATIENT_ADMISSION_FAIL, POST_PATIENT_ADMISSION_SUCCESS, postPatientAdmission } from "../../../../actions/Doc-actions/Admission/postAdmitPatient";
import { getPgWardRoomsSetupSlice } from "../../../../actions/nurse-actions/getPgWardRoomsSetupSlice";

const AdmitPatientForm = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const patientDetails = location.state?.patientDetails || {};
  const dispatch = useDispatch();
  const {loadingBeds, getBeds} = useSelector(state => state.getPgBeds);
  const { loadingWards, getWards } = useSelector(state => state.getPgWardsList);
  const { loadingWardRooms, wardRooms } = useSelector(state => state.getPgWardRoomsSetup);
  const [ selectedWard, setSelectedWard] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const patientInfo = [
    { title: 'Patient Name', value: patientDetails?.Names },
    { title: 'Patient Number', value: patientDetails?.PatientNo },
    { title: 'Visit Number', value: patientDetails?.LinkNo },
    { title: "Doctor's Name", value: patientDetails?.DoctorName }
  ];

  const [form] = Form.useForm();
  const { confirm } = Modal;

  const filteredRooms = wardRooms.filter(room => room.Ward_No === selectedWard);
  const filteredBeds = getBeds.filter(bed => bed.Room_No === selectedRoom);
  
  const onFinish = async (values) => {
    const { bed, ward, type } = values;
    const formData = {
      myAction: 'edit',
      recId: "",
      admissionNo: patientDetails?.AdmissionNo,
      admissionType:  type,
      ward,
      bed,
    }

    try{
      const result = await dispatch(postAdmissionFormDetailsSlice((formData)));

      if(result.type === POST_ADMISSION_FORM_DETAILS_SUCCESS){
        message.success(result.payload.message || 'Admission Form Details Submitted Successfully');
        form.resetFields();
      }else if(result.type === POST_CANCEL_ADMISSION_FAILURE){
        message.error(result.payload.message || 'Admission Form Details Failed to Submit');
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
      const result = await dispatch(postPatientAdmission({admissionNo: patientDetails?.AdmissionNo}));
      if(result.type === POST_PATIENT_ADMISSION_SUCCESS){
        message.success(result.payload.message || 'Patient Admitted Successfully');
        form.resetFields();
      }else if(result.type === POST_PATIENT_ADMISSION_FAIL){
        message.error(result.payload.message || 'Patient Admission Failed');
      }
    }catch(error){
      message.error(error.message || 'Unexpected error occurred');
    }
  }

  useEffect(()=>{
      if(!getBeds?.length){
        dispatch(getPgBedsSlice())
      }
  }, [dispatch, getBeds?.length]);

  useEffect(()=>{
      if(!getWards?.length){
        dispatch(getPgWardsListSlice())
      }
  }, [dispatch, getWards])

  useEffect(()=>{
      if(!wardRooms?.length){
        dispatch(getPgWardRoomsSetupSlice())
      }
  }, [dispatch, wardRooms])

  useEffect(()=>{
    if(!location.state){
      navigate('/Nurse/Dashboard');
    }
  }, [location.state, navigate])

  return (
    <>
     
    <Row gutter={16}>
    {patientInfo.map((info, index) => (
    <Col key={index} xs={24} sm={24} md={12} lg={6} xl={6}>
    <Card className="admit-patient-card-container">
      <Typography.Title level={5}>
        {info.title}
      </Typography.Title>
      <Typography.Text>
        {info.value}
      </Typography.Text>
    </Card>
    </Col>
    ))}
    </Row>

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
                  optionFilterProp="label"
                  loading={loadingWards}
                  onChange={(value) => {
                    setSelectedWard(value); // Update selected ward
                    setSelectedRoom(null); // Reset room selection
                  }}
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
              name='type'
              rules={[
                {
                  required: true,
                  message: 'Room Number is required!',
                }
              ]}
              >
                  <Select 
                    showSearch
                    onChange={(value) => setSelectedRoom(value)} // Update selected room
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
                  placeholder="Select Bed"
                  showSearch
                  onChange={(value) => console.log('Selected Bed:', value)} // Handle bed selection
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
                <Button type="primary" htmlType="submit">Save Admission</Button>
            </Form.Item>
            <Form.Item >
                <Button type="primary" onClick={handleAdmitPatient} htmlType="submit">Admit Patient</Button>
            </Form.Item>
        </Space>
        </Form>
        </Card>
    </>
    
  )
}

export default AdmitPatientForm
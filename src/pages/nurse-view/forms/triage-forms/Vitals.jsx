import { Button, Col, Form, Input, message, Row } from 'antd'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { postTriageListVitalsSlice } from '../../../../actions/triage-actions/postTriageListVitalsSlice';
import { getVitalsLinesSlice } from '../../../../actions/triage-actions/getVitalsLinesSlice';
import { useEffect } from 'react';
import Loading from '../../../../partials/nurse-partials/Loading';

const FormVitals = ({ observationNumber, patientNumber}) => {

  const dispatch = useDispatch();
  const {loadingVitalsLines, vitalsLines} = useSelector((state) => state.getVitalsLines);
  
  useEffect(() => {
    dispatch(getVitalsLinesSlice(patientNumber));
  }, [dispatch, patientNumber]);

  const onFinish = (values) => {
    const { pulseRate, pain, height, weight, temperature, bloodPreasure, sP02, respirationRate } = values.vitals;

    const createVitals = {
      pulseRate,
      Pain: parseInt(cleanValue(pain)),
      Height: parseFloat(cleanValue(height)),
      Weight: parseFloat(cleanValue(weight)),
      Temperature: parseFloat(cleanValue(temperature)),
      bloodPreasure,
      sP02,
      respirationRate,
      patientNo: patientNumber,
      observationNo:  observationNumber,
      BMI: calculateBMI(height, weight),
      type: 0,
      myAction: "create"
    };

    const updateVitals = {
      pulseRate,
      Pain: parseInt(cleanValue(pain)),
      Height: parseFloat(cleanValue(height)),
      Weight: parseFloat(cleanValue(weight)),
      Temperature: parseFloat(cleanValue(temperature)),
      bloodPreasure,
      sP02,
      respirationRate,
      patientNo: patientNumber,
      observationNo:  observationNumber,
      BMI: calculateBMI(height, weight),
      type: 0,
      myAction: "update"
    };

    //check if vitals exists ifs so update else create
    
    if(Object.keys(vitalsLines).length > 0) {
    // update vitals
    dispatch(postTriageListVitalsSlice(updateVitals)).then(()=>{
      message.success('successfully updated vitals');
    })
    
      
    }else{
      // create vitals
      dispatch(postTriageListVitalsSlice(createVitals)).then((data)=>{
        if(data?.status === "success"){
          message.success(data?.status);
          // dispatch(getVitalsLinesSlice(patientNo));
        }else{
          message.error('Error saving vitals data');
        }
      })
    }
  
  };
  
  
  const cleanValue = (value) => {
    if (typeof value === "string") {
      return value.replace(/[^\d.-]/g, "");
    }
    return value;
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) {
      return null; 
    }
    const heightInMeters = height / 100; 
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2); 
  };

  return (
   <div>
    {
      loadingVitalsLines ? (
        <Loading />
      ):(
        <Form layout="vertical" 

          onFinish={onFinish}
          initialValues={{
            vitals: {
              observationNumber: observationNumber,
              patientNumber: patientNumber,
              pulseRate: vitalsLines?.PulseRate,
              bloodPreasure: vitalsLines?.BloodPreasure,
              temperature: vitalsLines?.Temperature,
              sP02: vitalsLines?.SP02,
              height: vitalsLines?.Height,
              weight: vitalsLines?.Weight,
              respirationRate: vitalsLines?.RespirationRate,
              pain: vitalsLines?.Pain,
            },
          }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="Observation Number"
                  name={['vitals', 'observationNumber']}
                  rules={[{ required: true, message: 'Please input observation number!' }]} 
                >
                  <Input type='text' 
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="Patient Number" 
                  name={['vitals', 'patientNumber']}
                  rules={[{ required: true, message: 'Please input patient number!' }]}
                  >
                  <Input type='text' 
                    name='patientNumber'
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pulse Rate"
                  name={['vitals', 'pulseRate']}
                  rules={[{ required: true, message: 'Please input pulse rate!' }]}
                >
                  <Input type='text'
                    name='pulseRate'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Blood Pressure" name={['vitals', 'bloodPreasure']}
                  rules={[{ required: true, message: 'Please input blood pressure!' }]}
                  >
                  <Input type='text' 
                      name='bloodPreasure'
                      
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Temperature" name={['vitals', 'temperature']}
                  rules={[{ required: true, message: 'Please input temperature!' }]}
                >
                  <Input type='number' 
                    name='temperature'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SPO2" name={['vitals', 'sP02']}
                  rules={[{ required: true, message: 'Please input SOP2!' }]}
                >
                  <Input type='text' 
                    name='sP02'
              
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Height" name={['vitals', 'height']}
                
                rules={[{ required: true, message: 'Please input height!' }]}
                >
                  <Input type='number' 
                    name='height'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Weight" name={['vitals', 'weight']}
                  rules={[{ required: true, message: 'Please input weight!' }]}
                >
                  <Input type='number' 
                    name='weight'
                
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Respiration Rate" name={['vitals', 'respirationRate']}
                  rules={[{ required: true, message: 'Please input respiration rate!' }]}
                >
                  <Input type='text' 
                  
                  name='respirationRate'
                  
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pain" name={['vitals', 'pain']}>
                  <Input type='number' 
                    name='pain'
              
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item >
                    <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
              </Col>
            </Row>
        </Form>
      )
    }
   </div>
  )
}

export default FormVitals

//prop type validation
FormVitals.propTypes = {
  observationNumber: PropTypes.string.isRequired,
  patientNumber: PropTypes.string.isRequired,
}
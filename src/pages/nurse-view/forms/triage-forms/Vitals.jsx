import { Button, Col, Divider, Form, Input, message, Row, Table } from 'antd'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { postTriageListVitalsSlice } from '../../../../actions/triage-actions/postTriageListVitalsSlice';
import { getVitalsLinesSlice } from '../../../../actions/triage-actions/getVitalsLinesSlice';
import { useEffect } from 'react';
import Loading from '../../../../partials/nurse-partials/Loading';
import { SaveOutlined } from '@ant-design/icons';
import { updateTriageListVitalsSlice } from '../../../../actions/triage-actions/updateTriageListVitalsSlice';

const FormVitals = ({ observationNumber, patientNumber}) => {

  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const {loadingVitalsLines, vitalsLines} = useSelector((state) => state.getVitalsLines);
  const { loading } = useSelector((state) => state.postTriageListVitals);
  
  useEffect(() => {
    if (!vitalsLines.length) {
      dispatch(getVitalsLinesSlice(observationNumber));
    }
  }, [dispatch, observationNumber, vitalsLines.length]);
  

  const onFinish = (values) => {
    const { pulseRate, pain, height, weight, temperature, bloodPreasure, sP02, respirationRate } = values.vitals;

    const createVitals = {
      pulseRate,
      Pain: parseInt(cleanValue(pain)),
      height: parseFloat(cleanValue(height)),
      weight: parseFloat(cleanValue(weight)),
      temperature: parseFloat(cleanValue(temperature)),
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
      height: parseFloat(cleanValue(height)),
      weight: parseFloat(cleanValue(weight)),
      temperature: parseFloat(cleanValue(temperature)),
      bloodPreasure,
      sP02,
      respirationRate,
      patientNo: patientNumber,
      observationNo:  observationNumber,
      BMI: calculateBMI(height, weight),
      type: 1,
      myAction: "update"
    };

    //check if vitals exists ifs so update else create
    
    if(Object.keys(vitalsLines).length > 0) {
    // update vitals
    dispatch(updateTriageListVitalsSlice(updateVitals)).then(()=>{
      message.success('successfully updated vitals');
    }).error((error) => {
      message.error('Error updating vitals');
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

  const handleValuesChange = (_, allValues) => {
    const { height, weight } = allValues.vitals || {};
    if (height && weight) {
      const bmi = calculateBMI(height, weight);
      form.setFieldsValue({
        vitals: { ...allValues.vitals, bmi }, // Update BMI field
      });
    }
  };

  const columns = [
    {
      title: 'Pulse Rate',
      dataIndex: 'pulseRate',
      key: 'pulseRate',
    },
    {
      title: 'Pain',
      dataIndex: 'pain',
      key: 'pain',
    },
    {
      title: 'Height',
      dataIndex: 'height',
      key: 'height',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Temperature',
      dataIndex: 'temperature',
      key: 'temperature',
    },

  ]

  const { PulseRate, Pain, Height, Weight, Temperature, BloodPressure, SP02, RespirationRate, ObservationNo, BMI } = vitalsLines;
  
  const dataSource = [
    {
      key: ObservationNo,
      pulseRate: PulseRate,
      pain: Pain,
      height: Height,
      weight: Weight,
      temperature: Temperature,
      bloodPreasure: BloodPressure,
      sP02: SP02,
      respirationRate: RespirationRate,
      bmi: BMI,
    }
  ]

  return (
   <div>
    {
      loadingVitalsLines ? (
        <Loading />
      ):(
        
      <div>
        <Form layout="vertical" 

          form={form}
          onFinish={onFinish}
          initialValues={{
            vitals: {
              pulseRate: vitalsLines?.PulseRate ? vitalsLines.PulseRate : '',
              bloodPreasure: vitalsLines?.BloodPressure ? vitalsLines.BloodPressure : '',
              temperature: vitalsLines?.Temperature ? vitalsLines.Temperature : '',
              sP02: vitalsLines?.SP02 ? vitalsLines.SP02 : '',
              height: vitalsLines?.Height ? vitalsLines.Height : '',
              weight: vitalsLines?.Weight ? vitalsLines.Weight : '',
              respirationRate: vitalsLines?.RespirationRate ? vitalsLines.RespirationRate : '',
              pain: vitalsLines?.Pain ? vitalsLines.Pain : 0,
              bmi: vitalsLines?.BMI ? vitalsLines.BMI.toFixed(2) : "0.0"
            },
            
          }}
          autoComplete="off"
          onValuesChange={handleValuesChange}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pulse Rate (bpm)"
                  name={['vitals', 'pulseRate']}
                  
                  rules={[
                    {
                      required: true,
                      message: 'Please input pulse rate!',
                    },
                    {
                      pattern: /^[0-9]+$/, // Validate numeric input
                      message: 'Pulse rate must be a valid number!',
                    },
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.resolve(); // Skip if no value (handled by required rule)
                        }
                        if (value < 40 || value > 180) {
                          return Promise.reject(new Error('Pulse rate must be between 40 and 180 bpm!'));
                        }
                        return Promise.resolve(); // Valid input
                      },
                    },
                  ]}
                >
                  <Input type='text'
          
                    placeholder='eg 70'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Blood Pressure (mmHg)" 
                  name={['vitals', 'bloodPreasure']}
                  validateTrigger={['onBlur', 'onChange']}
                  rules={[
                    { required: true, message: 'Blood Pressure is required!' },
                    {
                      validator(_, value) {
                        if (!value) {
                          return Promise.reject(new Error('Blood Pressure is required!'));
                        }
          
                        const regex = /^\d{2,3}\/\d{2,3}$/; // Pattern to match "120/80"
                        if (!regex.test(value)) {
                          return Promise.reject(
                            new Error('Enter a valid format (e.g., 120/80)')
                          );
                        }
          
                        const [systolic, diastolic] = value.split('/').map(Number);
                        if (
                          systolic < 90 ||
                          systolic > 200 ||
                          diastolic < 60 ||
                          diastolic > 120
                        ) {
                          return Promise.reject(
                            new Error(
                              'Values out of range. Systolic: 90-200, Diastolic: 60-120.'
                            )
                          );
                        }
          
                        return Promise.resolve();
                      },
                    },
                  ]}
                  >
                  <Input type='text' 
                     
                      placeholder='eg 120/80'
                      
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Temperature (&deg;C)" name={['vitals', 'temperature']}
                  validateTrigger={['onBlur', 'onChange']}
                  rules={[
                    { required: true, message: 'Please input temperature!' },
                    {
                      validator(_, value) {
                        if (value === undefined || value === null || value === '') {
                          return Promise.reject(new Error('Temperature is required!'));
                        }
                
                        const temperature = parseFloat(value);
                        if (isNaN(temperature)) {
                          return Promise.reject(new Error('Temperature must be a number!'));
                        }
                
                        if (temperature < 35.0 || temperature > 42.0) {
                          return Promise.reject(
                            new Error('Temperature must be between 35.0°C and 42.0°C.')
                          );
                        }
                
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input type='number' 
                   
                     placeholder='eg: 32.7'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SPO2 (%)" name={['vitals', 'sP02']}
                    validateTrigger={['onBlur', 'onChange']}
                    rules={[
                      { required: true, message: 'Please input SPO2!' },
                      {
                        validator(_, value) {
                          if (value === undefined || value === null || value.trim() === '') {
                            return Promise.reject(new Error('SPO2 is required!'));
                          }
                  
                          // Ensure value is a valid percentage
                          const percentageMatch = value.match(/^(\d{1,2}|100)%$/);
                          if (!percentageMatch) {
                            return Promise.reject(
                              new Error('SPO2 must be a valid percentage (e.g., 98%).')
                            );
                          }
                  
                          const numericValue = parseInt(percentageMatch[1], 10);
                          if (numericValue < 0 || numericValue > 100) {
                            return Promise.reject(
                              new Error('SPO2 must be between 0% and 100%.')
                            );
                          }
                  
                          return Promise.resolve();
                        },
                      },
                    ]}
                >
                  <Input type='text' 
                    name='sP02'
                    placeholder='eg 98%'
              
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Height (cm)" name={['vitals', 'height']}
                
                validateTrigger={['onBlur', 'onChange']}
                rules={[
                  { required: true, message: 'Please input height!' },
                  {
                    type: 'number', 
                    min: 30, 
                    max: 300, 
                    transform(value) {
                      return value ? Number(value) : null;
                    },
                    message: 'Height must be between 30 cm and 300 cm!',
                  },
                 
                ]}
                >
                  <Input type='number' 
                    
                    placeholder='eg 170'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Weight (kg)" name={['vitals', 'weight']}
                  validateTrigger={['onBlur', 'onChange']}
                  rules={[
                    { required: true, message: 'Please input weight!' },
                    {
                      type: 'number',
                      min: 1,
                      max: 500,
                      transform(value) {
                        return value ? Number(value) : null;
                      },
                      message: 'Weight must be between 1 kg and 500 kg!',
                    },
                    
                  ]}
                >
                  <Input type='number' 
                  
                    placeholder='eg 70'
                
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Respiration Rate (bpm)" name={['vitals', 'respirationRate']}
                   rules={[
                    { required: true, message: 'Please input respiration rate!' },
                    {
                      pattern: /^[0-9]+$/,
                      message: 'Respiration rate must be a valid number!',
                    },
                    {
                      validator(_, value) {
                        if (!value || (value >= 12 && value <= 25)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Respiration rate must be between 12 and 25 bpm!'));
                      },
                    },
                  ]}
                >
                  <Input type='text' 
                  
                  name='respirationRate'
                  placeholder='eg 18'
                  
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pain" name={['vitals', 'pain']}
                validationTrigger={['onBlur', 'onChange']}
                rules={[
                  { required: true, message: 'Please input pain level!' },
                  {
                    validator(_, value) {
                      if (value === 0 || value === 1) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Pain level must be 0 or 1!'));
                    },
                  },
                ]}

                >
                
                  <Input type='number' 
                   
                    placeholder='eg 1'
              
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
              <Form.Item label="BMI" name={['vitals', 'bmi']}
              >
                <Input type='text' 
                
                 
                  disabled

                />

                </Form.Item>
              </Col>
            </Row>

            <Col span={12}>
                <Form.Item >
                    <Button type="primary" loading={loading} htmlType="submit">
                      <SaveOutlined />
                      {
                        vitalsLines && Object.keys(vitalsLines).length > 0 ? 'Update vitals' : 'Save vitals'
                      }
                    </Button>
                </Form.Item>
            </Col>
        </Form>
        

        {
          vitalsLines && Object.keys(vitalsLines).length > 0 && 
          (
            <div style={{ marginTop: '10px' }}>
            <Divider />
            <Table columns={columns} 
            dataSource={dataSource} 
            pagination={false}
            expandable={{
              expandedRowRender: (record) => (
                <p style={{ margin: 0 }}>

                  Blood Preasure : {record.bloodPreasure}, 
                  SP02 : {record.sP02}, 
                  Respiration Rate : {record.respirationRate}, 
                  BMI : {record.bmi.toFixed(2)}
                </p>
              ),
              rowExpandable: (record) => record.name !== 'Not Expandable',
            }}
            />
            </div>
          )
        }
        </div>
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
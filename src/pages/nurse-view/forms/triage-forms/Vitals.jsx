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

    // get vitals

    dispatch(getVitalsLinesSlice(observationNumber));
  
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

          onFinish={onFinish}
          initialValues={{
            vitals: {
              pulseRate: vitalsLines?.PulseRate,
              bloodPreasure: vitalsLines?.BloodPressure,
              temperature: vitalsLines?.Temperature,
              sP02: vitalsLines?.SP02,
              height: vitalsLines?.Height,
              weight: vitalsLines?.Weight,
              respirationRate: vitalsLines?.RespirationRate,
              pain: vitalsLines?.Pain,
              bmi: vitalsLines?.BMI ? vitalsLines.BMI.toFixed(2) : "0.0"
            },
          }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Pulse Rate (bpm)"
                  name={['vitals', 'pulseRate']}
                  rules={[{ required: true, message: 'Please input pulse rate!' }]}
                >
                  <Input type='text'
                    name='pulseRate'
                    placeholder='eg 70'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Blood Pressure (mmHg)" name={['vitals', 'bloodPreasure']}
                  rules={[{ required: true, message: 'Please input blood pressure!' }]}
                  >
                  <Input type='text' 
                      name='bloodPreasure'
                      placeholder='eg 120/80'
                      
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Temperature (&deg;C)" name={['vitals', 'temperature']}
                  rules={[{ required: true, message: 'Please input temperature!' }]}
                >
                  <Input type='number' 
                    name='temperature'
                     placeholder='eg: 32.7'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="SPO2 (%)" name={['vitals', 'sP02']}
                  rules={[{ required: true, message: 'Please input SOP2!' }]}
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
                
                rules={[{ required: true, message: 'Please input height!' }]}
                >
                  <Input type='number' 
                    name='height'
                    placeholder='eg 170'
                    
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Weight (kg)" name={['vitals', 'weight']}
                  rules={[{ required: true, message: 'Please input weight!' }]}
                >
                  <Input type='number' 
                    name='weight'
                    placeholder='eg 70'
                
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Respiration Rate (bpm)" name={['vitals', 'respirationRate']}
                  rules={[{ required: true, message: 'Please input respiration rate!' }]}
                >
                  <Input type='text' 
                  
                  name='respirationRate'
                  placeholder='eg 18'
                  
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Pain" name={['vitals', 'pain']}>
                  <Input type='number' 
                    name='pain'
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
                
                  name='bmi'
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
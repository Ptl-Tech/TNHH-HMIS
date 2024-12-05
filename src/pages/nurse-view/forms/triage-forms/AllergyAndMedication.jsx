import { Button, Col, Form, Input, message, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllergiesAndMedicationsSlice } from '../../../../actions/triage-actions/getAllergiesAndMedicationsSlice';
import { postAllergiesMedicationSlice } from '../../../../actions/triage-actions/postAllergiesMedicationSlice';
import Loading from '../../../../partials/nurse-partials/Loading';

const AllergyAndMedication = ({observationNumber, patientNumber, staffNo}) => {
    const dispatch = useDispatch();
    const {allergyMedicationLoading, allergiesMedication} = useSelector((state) => state.getAllergiesAndMedications);

    const { postAllergyMedicationLoading } = useSelector((state) => state.postAllergiesMedication);

    useEffect(() => {
        dispatch(getAllergiesAndMedicationsSlice(patientNumber));
      }, [dispatch, patientNumber]);

    const cleanValue = (value) => {
        if (typeof value === "string") {
          return value.replace(/[^\d.-]/g, "");
        }
        return value;
      };
    const onFinish = (values) =>{
        const { complains, reasonForVisit, foodAllergy, drugAllergy } = values.allergy;
        const createAllergyAndMedicationData = {
          
            complains,
            reasonForVisit: parseInt(cleanValue(reasonForVisit)),
            foodAllergy,
            drugAllergy,
            patientNo: patientNumber,
            staffNo: staffNo,
            observationNo: observationNumber,
            assessedBy: staffNo,
            myAction: "create"
          };

          const updateAllergyAndMedicationData = {
          
            complains,
            reasonForVisit: parseInt(cleanValue(reasonForVisit)),
            foodAllergy,
            drugAllergy,
            patientNo: patientNumber,
            staffNo: staffNo,
            observationNo: observationNumber,
            assessedBy: staffNo,
            myAction: "update"
          };

          if(Object.keys(allergiesMedication).length > 0) {
            // update vitals
            dispatch(postAllergiesMedicationSlice(updateAllergyAndMedicationData)).then(()=>{
              message.success('successfully updated allergies');
            })
            
              
            }else{
              // create vitals
              dispatch(postAllergiesMedicationSlice(createAllergyAndMedicationData)).then((data)=>{
                if(data?.status === "success"){
                  message.success(data?.status);
                  // dispatch(getVitalsLinesSlice(patientNo));
                }else{
                  message.error('Error saving vitals data');
                }
              })
            }

    }
    const selectReasonForVisit = [
        {
          value: 0,
          label: '',
        },
    
        {
          value: 1,
          label: 'Patient not improving',
        },
        {
          value: 2,
          label: 'Patient Deteriorating',
        },
    
        {
          value: 3,
          label: 'New Presentation',
        },
    
        {
          value: 4,
          label: 'Follow Up',
        },
    
      ]

  return (
    <div>
        {
            allergyMedicationLoading ? (
                <Loading />
            ):(
                <Form layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    allergy: {
                    observationNumber: observationNumber,
                    patientNumber: patientNumber,
                    assessedBy: staffNo,
                    complains: '',
                    reasonForVisit: '',
                    foodAllergy: '',
                    drugAllergy: '',
                    },
                }}
            >
                <Row gutter={16}>
                
                <Col span={12}>
                    <Form.Item label="Observation No" 
                    name={['allergy', 'observationNumber']}
                    rules={[{ required: true, message: 'Please input observation no!' }]}
                    >
                    <Input type='text' 
                        name='observationNumber'
                        disabled
                        
                    />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Assessed by" 
                    name={['allergy', 'assessedBy']}
                    rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                    <Input type='text' 
                    name='assessedBy'
                    disabled
                    
                    />
                    </Form.Item>
                </Col>
                </Row>

                <Row gutter={16}>
                
                <Col span={12}>
                    <Form.Item label="Complains" 
                    name={['allergy', 'complains']}
                    >
                    <Input type='text' 
                        name='complains'
                        
                    />
                    </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item label="Reason for visit" 
                    name={['allergy', 'reasonForVisit']}
                    rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                    <Select
                        key={'location'}
                        style={{ width: '100%' }}
                        optionFilterProp="label"
                        options={selectReasonForVisit} 
                        
                    >
                    </Select>
                    </Form.Item>
                </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item label="Food Allergy" name={['allergy', 'foodAllergy']}>
                        <Input type='text' 
                        
                        name='foodAllergy'
                        />
                    </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item label="Drug Allergy" name={['allergy', 'drugAllergy']}>
                        <Input type='text' 
                        name='drugAllergy'
                        />
                    </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item >
                            <Button type="primary" htmlType="submit" loading={postAllergyMedicationLoading}>Save allegies and medication</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            )
        }

    </div>
  )
}

export default AllergyAndMedication

AllergyAndMedication.propTypes = {
    observationNumber: PropTypes.string.isRequired,
    patientNumber: PropTypes.string.isRequired,
    staffNo: PropTypes.string.isRequired,
  }
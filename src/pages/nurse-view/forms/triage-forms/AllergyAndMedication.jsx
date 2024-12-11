import { Button, Col, Divider, Form, Input, message, Row, Table } from 'antd'
import PropTypes from 'prop-types'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllergiesAndMedicationsSlice } from '../../../../actions/triage-actions/getAllergiesAndMedicationsSlice';
import { postAllergiesMedicationSlice } from '../../../../actions/triage-actions/postAllergiesMedicationSlice';
import Loading from '../../../../partials/nurse-partials/Loading';
import { SaveOutlined } from '@ant-design/icons';

const AllergyAndMedication = ({observationNumber, patientNumber, staffNo}) => {
    const dispatch = useDispatch();
    const {allergyMedicationLoading, allergiesMedication} = useSelector((state) => state.getAllergiesAndMedications);

    console.log('allergy and medication', allergiesMedication);

    const { postAllergyMedicationLoading } = useSelector((state) => state.postAllergiesMedication);

    useEffect(() => {
        dispatch(getAllergiesAndMedicationsSlice(observationNumber));
      }, [dispatch, observationNumber]);

    const cleanValue = (value) => {
        if (typeof value === "string") {
          return value.replace(/[^\d.-]/g, "");
        }
        return value;
      };
    const onFinish = (values) =>{
        const { complains, foodAllergy, drugAllergy } = values.allergy;
        const createAllergyAndMedicationData = {
          
            complaints: complains,
            foodAllergy,
            drugAllergy,
            patientNo: patientNumber,
            staffNo: staffNo,
            observationNo: observationNumber,
            assessedBy: staffNo,
            myAction: "create"
          };

          dispatch(postAllergiesMedicationSlice(createAllergyAndMedicationData)).then((data)=>{
            if(data?.status === "success"){
              message.success(data?.status);
              // dispatch(getVitalsLinesSlice(patientNo));
            }else{
              message.error('Error saving allergies and medication');
            }
          })

            dispatch(getAllergiesAndMedicationsSlice(observationNumber));

    }

    const columns = [

      {
        title: 'Assessed By',
        dataIndex: 'assessedBy',
        key: 'assessedBy',
      },
      {
        title: 'Complains',
        dataIndex: 'complains',
        key: 'complains',
      },
      {
        title: 'Food Allergy',
        dataIndex: 'foodAllergy',
        key: 'foodAllergy',
      },
      ]


     const { AssessedBy, Complaints, DrugAllergy, FoodAllergy, observationNo } = allergiesMedication

     const dataSource = [

      {
        key: observationNo,
        assessedBy: AssessedBy,
        complains: Complaints,
        foodAllergy: FoodAllergy,
        drugAllergy: DrugAllergy,
      }
     ]

  return (
    <div>
        {
            allergyMedicationLoading ? (
                <Loading />
            ):(
              <div>
                
                <Form layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                      allergy: {
                      assessedBy: allergiesMedication?.AssessedBy || staffNo,
                      complains: '',
                      foodAllergy: '',
                      drugAllergy: '',
                      },
                  }}
              >
                  <Row gutter={16}>

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
                  <Col span={12}>
                      <Form.Item label="Complains" 
                      name={['allergy', 'complains']}
                      >
                      <Input type='text' 
                          name='complains'
                          
                      />
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
                              <Button type="primary" htmlType="submit" loading={postAllergyMedicationLoading}><SaveOutlined /> 
                              {
                                allergiesMedication && Object.keys(allergiesMedication).length > 0 ? 'Add allergies and medication' : 'Save allergies and medication'
                              }
                                  
                              </Button>
                          </Form.Item>
                      </Col>
                  </Row>
              </Form>

              {
                allergiesMedication && Object.keys(allergiesMedication).length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                  <Divider />
                  <Table columns={columns} 
                  dataSource={dataSource} 
                  pagination={false}
                  expandable={{
                    expandedRowRender: (record) => (
                      <p style={{ margin: 0 }}>
    
                        Drug Allergy : {record.drugAllergy} 
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

export default AllergyAndMedication

AllergyAndMedication.propTypes = {
    observationNumber: PropTypes.string.isRequired,
    patientNumber: PropTypes.string.isRequired,
    staffNo: PropTypes.string.isRequired,
  }
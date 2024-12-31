import { Button, Divider, Form, Input, message, Modal, Select, Space, Typography } from 'antd'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import DietaryIntakeTable from '../tables/nurse-tables/DietaryIntakeTable';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQyIpLookupValuesSlice } from '../../../actions/nurse-actions/getQyIPLookupValuesSlice';
import { POST_DIETARY_INTAKE_FORM_LINE_FAILURE, POST_DIETARY_INTAKE_FORM_LINE_SUCCESS, postDietaryIntakeFormLineSlice } from '../../../actions/nurse-actions/postDietaryIntakeFormLineSlice';
import { getQyDietaryFormLinesSlice } from '../../../actions/nurse-actions/getQyIPDietaryFormLinesSlice';

const DietaryIntakeForm = () => {

    const { patientDetails } = useLocation().state;
    const [ form ] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(false);

    const {ipLookupValues} = useSelector((state) => state.getQyIpLookupValues);
    const { loadingGetIpDietaryForm, ipGetDietaryForm} = useSelector((state) => state.getQyDietaryFormLine);
    
    const showModal = (record) => {
        form.resetFields();
        if (record) {
            setIsEditMode(true);
            form.setFieldsValue({
                category: record?.Category || '',
                comments: record?.Comment || '',
            });
        } else {
            setIsEditMode(false);
        }
        setIsModalOpen(true);
      };
    const handleOk = () => {
        form.submit();
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };


    const handleOnFinish = async (values) => {
        try {
          const { category, comments } = values;
      
          // Construct the visitor data
          const visitorData = {
            myAction: isEditMode ? "edit" : "create",
            admissionNo: patientDetails?.CurrentAdmNo,
            category,
            comments,
          };
      
          // Dispatch function to handle API call and feedback
          const dispatchVisitorData = async (data) => {
            await dispatch(postDietaryIntakeFormLineSlice(data))
              .then((result) => {
                if (result.type === POST_DIETARY_INTAKE_FORM_LINE_SUCCESS) {
                  const actionWord = isEditMode ? 'updated' : 'added';
                  message.success(`Dietary Intake Form Line ${actionWord} successfully!`);
                  dispatch(getQyDietaryFormLinesSlice(patientDetails?.CurrentAdmNo));
                } else if (result.type === POST_DIETARY_INTAKE_FORM_LINE_FAILURE) {
                  message.error(result.payload.message || "Internal server error, please try again later.");
                }
              })
              .then(() => {
                setIsModalOpen(false);
                form.resetFields();
              })
              .catch((err) => {
                message.error(err.message || "Internal server error, please try again later.");
              });
          };
      
          // Call the function
          await dispatchVisitorData(visitorData);
      
        } catch (error) {
          message.error(error.message || "An unexpected error occurred.");
        }
      };
  

    useEffect(() => {
        if(!ipLookupValues?.length){
          dispatch(getQyIpLookupValuesSlice());
        }
      }, [dispatch, ipLookupValues]);

      useEffect(() => {
            if(!ipGetDietaryForm?.length){
              dispatch(getQyDietaryFormLinesSlice(patientDetails?.CurrentAdmNo));
            }
          }, [dispatch, patientDetails?.CurrentAdmNo, ipGetDietaryForm?.length]);
      
    
  return (
    <div>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Dietary Intake Form
          </Typography.Text>
        </Space>

        <Divider />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <DietaryIntakeTable showModal={showModal} ipGetDietaryForm={ipGetDietaryForm} loadingGetIpDietaryForm={loadingGetIpDietaryForm}/>

        <Modal title="Dietary Intake Form" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText= {isEditMode ? "Update Form" : "Save Form"}
        >
            <Form
            
                layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={
                    {
                        admissionNo: patientDetails?.CurrentAdmNo,
                        category: '',
                        comments: '',
                    }
                }
            >
          
            <Form.Item 
                label="Admission No" 
                name="admissionNo"
                hasFeedback
                >
                <Input placeholder="Admission No"
                    type='text'
                    disabled
                />
            </Form.Item>

            <Form.Item
            label="Category"    
            name="category"
            hasFeedback
            rules={[
                {
                    required: true,
                    message: 'Please select a category!',
                }
            ]}
            >
                <Select>
                    <Select.Option value="morning">Good</Select.Option>
                    <Select.Option value="afternoon">Average</Select.Option>
                    <Select.Option value="evening">Poor</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item 
                label="Comments" 
                name="comments"
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please enter comments!',
                    }
                ]}
                >
                <TextArea placeholder="Comments"
                    type="text"
                    
                />
            </Form.Item>
            </Form>
        </Modal> 
    </div>
  )
}

export default DietaryIntakeForm
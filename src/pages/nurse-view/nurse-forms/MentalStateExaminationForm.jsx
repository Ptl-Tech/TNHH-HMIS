import { Button, DatePicker, Form, message, Modal, Select, Space, Typography } from 'antd'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import MentalStatusExaminationTable from '../tables/nurse-tables/MentalStatusExaminationTable';
import { useDispatch, useSelector } from 'react-redux';
import { POST_MENTAL_EXAMINATION_FORM_FAILURE, POST_MENTAL_EXAMINATION_FORM_SUCCESS, postMentalExaminationFormSlice } from '../../../actions/nurse-actions/postMentalExaminationFormSlice';
import { getMentalExaminationFormSlice } from '../../../actions/nurse-actions/getMentalExaminationFormSlice';
import { useLocation } from 'react-router-dom';

const MentalStateExaminationForm = () => {
    const { patientDetails } = useLocation().state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ form ] = Form.useForm();
    const [isEditMode, setIsEditMode] = useState(false);

    const { loadingIpGetMentalStatusForm, ipGetMentalStatusForm} = useSelector((state) => state.getMentalStatusExaminationForm);

    const dispatch = useDispatch();

    const showModal = (record) => {
      form.resetFields();
      if (record) {
          setIsEditMode(true);
          form.setFieldsValue({
              status: record?.Status || '',
              comments: record?.Comments || '',
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
      
      try{
          
        const { date, status, comments } = values;
        
        const mentalStateExaminationFormData = {
          myAction: isEditMode ? "edit" : "create",
          admissionNo: patientDetails?.CurrentAdmNo,
          date: date.format('YYYY-MM-DD'),
          status,
          comments,
        }

      // Dispatch function to handle API call and feedback
      const dispatchMentalStateExaminationData = async (data) => {
        await dispatch(postMentalExaminationFormSlice('/InpatientForms/MentalStatusCheckForm', data))
          .then((result) => {
            if (result.type === POST_MENTAL_EXAMINATION_FORM_SUCCESS) {
              const actionWord = isEditMode ? 'updated' : 'added';
              message.success(`Mental state examination form has been ${actionWord} successfully!`);
              dispatch(getMentalExaminationFormSlice(patientDetails?.CurrentAdmNo));
            } else if (result.type === POST_MENTAL_EXAMINATION_FORM_FAILURE) {
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
      await dispatchMentalStateExaminationData(mentalStateExaminationFormData);

      }catch(err){
        message.error(err.message || "Internal server error, please try again later.");
      }
    }

    useEffect(() => {
      if(!ipGetMentalStatusForm?.length) {
        dispatch(getMentalExaminationFormSlice(patientDetails?.CurrentAdmNo));
      }
    }, [ipGetMentalStatusForm?.length, dispatch, patientDetails?.CurrentAdmNo]);
    
  return (
    <div>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Mental State Examination Form
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <MentalStatusExaminationTable showModal={showModal} loadingIpGetMentalStatusForm={loadingIpGetMentalStatusForm} ipGetMentalStatusForm={ipGetMentalStatusForm}/>

        <Modal title="Suicidal Precaution Form" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText={isEditMode ? "Update Form" : "Save Form"}
        >
            <Form
            
                layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={
                  {
                    date: '',
                    status: '',
                    comments: '',
                  }
                }
            >
          
            <Form.Item 
                label="Date" 
                name="date"
                hasFeedback
                rules={[
                    {
                      required: true,
                      message: 'Please input date!',
                    },
                  ]}
                >
                <DatePicker placeholder="Date"
                    type='text'
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item
            label="Status"    
            name="status"
            hasFeedback
            rules={[
                {
                  required: true,
                  message: 'Please select status!',
                },
              ]}
            >
                <Select>
                    <Select.Option value="good">Good</Select.Option>
                    <Select.Option value="average">Average</Select.Option>
                    <Select.Option value="bad">Bad</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item 
                label="Comments" 
                name="comments"
                hasFeedback
                rules={[
                    {
                      required: true,
                      message: 'Please input comments!',
                    },
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

export default MentalStateExaminationForm

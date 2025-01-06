import { Button, DatePicker, Form, Input, message, Modal, Select, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import JacksonVisualFormTable from '../tables/nurse-tables/JacksonVisualFormTable';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { POST_JACKSON_VISUAL_FORM_FAILURE, POST_JACKSON_VISUAL_FORM_SUCCESS, postJacksonVisualFormSlice } from '../../../actions/nurse-actions/postJacksonVisualFormSlice';
import { getJacksonVisualFormSlice } from '../../../actions/nurse-actions/getJacksonVisualFormSlice';

const JacksonVisualForm = () => {
    const { patientDetails } = useLocation().state;
    const [isEditMode, setIsEditMode] = useState(false);
    const [ form ] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();

    const { loadingGetJacksonVisual, getJacksonVisual } = useSelector((state) => state.getJacksonVisualForm);
   
    const showModal = (record) => {
      form.resetFields();
      if (record) {
          setIsEditMode(true);
          form.setFieldsValue({
              score: record?.Score || '',
              iv_line: record?.IVLine || '',
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
        const { score, iv_line, date } = values;
    
        // Construct the visitor data
        const jacksonData = {
          myAction: isEditMode ? "edit" : "create",
          admissionNo: patientDetails?.CurrentAdmNo,
          score,
          date: date.format('YYYY-MM-DD'),
          ivLine: iv_line
        };
    
        // Dispatch function to handle API call and feedback
        const dispatchJacksonVisualFormData = async (data) => {
          await dispatch(postJacksonVisualFormSlice('/InpatientForms/JacksonVisualForm', data))
            .then((result) => {
              if (result.type === POST_JACKSON_VISUAL_FORM_SUCCESS) {
                const actionWord = isEditMode ? 'updated' : 'added';
                message.success(`Jackson Visual Form ${actionWord} successfully!`);
                dispatch(getJacksonVisualFormSlice(patientDetails?.CurrentAdmNo));
              } else if (result.type === POST_JACKSON_VISUAL_FORM_FAILURE) {
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
        await dispatchJacksonVisualFormData(jacksonData);
    
      } catch (error) {
        message.error(error.message || "An unexpected error occurred.");
      }
    };

    useEffect(() => {
      if(!getJacksonVisual?.length){
        dispatch(getJacksonVisualFormSlice(patientDetails?.CurrentAdmNo));
      }
    }, [dispatch, patientDetails?.CurrentAdmNo, getJacksonVisual?.length]);
  
    
  return (
    <div>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Jackson Visual Form
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <JacksonVisualFormTable showModal={showModal} loadingGetJacksonVisual={loadingGetJacksonVisual} getJacksonVisual={getJacksonVisual}/>


        <Modal title="Jackson Visual Form" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText={isEditMode ? 'Update Form' : 'Save Form'}
        >
            <Form
            
                layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={{
                  score: '',
                  iv_line: '',
                }}
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
                label="Score" 
                name="score"
                hasFeedback
                rules={[
                    {
                      required: true,
                      message: 'Please input score!',
                    },
                  ]}
                >
                <Input placeholder="Score"
                    type='number'
                />
            </Form.Item>

            <Form.Item
            label="IV Line"    
            name="iv_line"
            hasFeedback
            rules={[
                {
                  required: true,
                  message: 'Please input IV Line!',
                },
              ]}
            >
                <Select>
                    <Select.Option value="1">Insertion</Select.Option>
                    <Select.Option value="2">Removal</Select.Option>
                </Select>
            </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default JacksonVisualForm
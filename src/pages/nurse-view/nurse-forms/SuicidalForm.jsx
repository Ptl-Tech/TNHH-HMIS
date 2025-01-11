import { Button, DatePicker, Form, Input, message, Modal, Space, TimePicker, Typography } from 'antd'
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import SuicidalFormTable from '../tables/nurse-tables/SuicidalFormTable';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { POST_SUICIDAL_FORM_FAILURE, POST_SUICIDAL_FORM_SUCCESS, postSuicidalFormSlice } from '../../../actions/nurse-actions/postSuicidalFormSlice';
import { getSuicidalFormSlice } from '../../../actions/nurse-actions/getSuicidalFormSlice';
import { use } from 'react';

const SuicidalForm = () => {
    const { patientDetails } = useLocation().state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [ form ] = Form.useForm();
const [loadingIpSuicidalForm, setLoadingIpSuicidalForm]=useState(false);
const [ipSuicidalForm, setIpSuicidalForm] = useState([]);
const [suicidalFormData, setSuicidalFormData] = useState({
  date: '',
  time: '',
  handingOver: '',
  takingOver: '',
  remarks: ''
});


    const dispatch = useDispatch();

    const showModal = (record) => {
      form.resetFields();
      if(record){
        setIsEditMode(true);
        form.setFieldsValue({
          handingOver: record?.HandingOver || '',
          takingOver: record?.TakingOver || '',
          remarks: record?.Remarks || ''
        });
      }else{
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

        const { date, time, handingOver, takingOver, remarks } = values;

        const suicidalFormData = {
          myAction: isEditMode ? "edit" : "create",
          date: date.format('YYYY-MM-DD'),
          time: time.format('HH:mm:ss'),
          admissionNo: patientDetails?.CurrentAdmNo,
          handingOver,
          takingOver,
          remarks   
        }

         // Dispatch function to handle API call and feedback
        const dispatchSuicidalFormData = async (data) => {
          await dispatch(postSuicidalFormSlice('/InpatientForms/SuicidalPrecautionForm', data))
            .then((result) => {
              if (result.type === POST_SUICIDAL_FORM_SUCCESS) {
                const actionWord = isEditMode ? 'updated' : 'added';
                message.success(`suicidal precaution form has ${actionWord} suicidal form successfully!`);
                dispatch(getSuicidalFormSlice(patientDetails?.CurrentAdmNo));
              } else if (result.type === POST_SUICIDAL_FORM_FAILURE) {
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
        await dispatchSuicidalFormData(suicidalFormData);

      }catch (error) {
        message.error(error.message || "An unexpected error occurred.");
      }

    }

    useEffect(() => {
      if(!ipSuicidalForm?.length){
        dispatch(getSuicidalFormSlice(patientDetails?.CurrentAdmNo));
      }
    }, [dispatch, patientDetails?.CurrentAdmNo, ipSuicidalForm?.length]);



    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const staffNo = userInfo?.userData?.no
    let formattedSffNo = staffNo.charAt(0).toUpperCase() + staffNo.slice(1).toLowerCase();

    
  return (
    <div>

        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Suicidal Precaution Form
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Form
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Form
          </Button>
        </div>

        <SuicidalFormTable showModal={showModal} ipSuicidalForm={ipSuicidalForm} loadingIpSuicidalForm={loadingIpSuicidalForm} />


        <Modal title="Suicidal Precaution Form" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText= {isEditMode ? "Update Form" : "Add Form"}
        >
            <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={{
                  date: '',
                  time: '',
                  handingOver: '',
                  takingOver: formattedSffNo,
                  remarks: ''
                  }}
            >
          
            <Form.Item 
                label="Date" 
                name="date"
                hasFeedback
                rules={[
                    {
                      required: true,
                      message: 'Please input the date!',
                    },
                  ]}
                >
                <DatePicker placeholder="Date"
                    type='text'
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item 
                label="Time" 
                name="time"
                hasFeedback
                rules={[
                    {
                      required: true,
                      message: 'Please input the time!',
                    },
                  ]}
                >
                <TimePicker placeholder="Time"
                    type='text'
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item 
                label="Handing Over" 
                name="handingOver"
                hasFeedback
                rules={[
                  {
                      required: true,
                      message: "Handing Over is required.",
                  },
                  {
                      pattern: /^[a-zA-Z ]{3,}$/,
                      message: "Must contain only alphabetic characters and be at least 3 characters long.",
                  }
                ]}
                >
                <Input placeholder="Handing Over Nurse"
                    type="text"
                />
            </Form.Item>

            <Form.Item 
                label="Taking Over" 
                name="takingOver"
                hasFeedback
                >
                <Input placeholder="Taking Over Nurse"
                    type="text"
                    disabled
                />
            </Form.Item>
            <Form.Item 
                label="Remarks" 
                name="remarks"
                hasFeedback
                rules={[
                  {
                    pattern: /^[a-zA-Z0-9 ]{3,}$/,
                    message: "Must contain only alphanumeric characters and be at least 3 characters long.",
                  }
                ]}
                >
                <TextArea placeholder="Remarks"
                    type="text"
                    
                />
            </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default SuicidalForm
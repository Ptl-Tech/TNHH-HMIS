import { Button, Form, Input, message, Modal, Space, Typography } from "antd"
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import VisitorFormTable from "../tables/nurse-tables/VisitorFormTable";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { POST_VISITOR_LIST_FAILURE, POST_VISITOR_LIST_SUCCESS, postVisitorListSlice } from "../../../actions/nurse-actions/postVisitorListSlice";
import { getVisitorsListSlice } from "../../../actions/nurse-actions/getVisitorsListSlice";

const VisitorsList = () => {

    const { patientDetails } = useLocation().state;
    const [ form ] = Form.useForm();
    const dispatch = useDispatch();
    const [isEditMode, setIsEditMode] = useState(false);

    const { loadingIpVisitors, ipVisitors} = useSelector((state) => state.getIPVisitors);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (record) => {
      form.resetFields();
      if (record) {
          setIsEditMode(true);
          form.setFieldsValue({
              admissionNo: record?.AdmissionNo || '',
              visitorName: record?.VisitorName || '',
              idNumber: record?.IdNumber || '',
              phoneNumber: record?.PhoneNumber || '',
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
        const { admissionNo, visitorName, idNumber, phoneNumber } = values;
    
        // Construct the visitor data
        const visitorData = {
          myAction: isEditMode ? "edit" : "create",
          admissionNo,
          visitorName,
          idNumber,
          phoneNumber,
        };
    
        // Dispatch function to handle API call and feedback
        const dispatchVisitorData = async (data) => {
          await dispatch(postVisitorListSlice('/InpatientForms/VisitorsListForm', data))
            .then((result) => {
              if (result.type === POST_VISITOR_LIST_SUCCESS) {
                const actionWord = isEditMode ? 'updated' : 'added';
                message.success(`Visitor ${result.payload.visitorName} ${actionWord} successfully!`);
                dispatch(getVisitorsListSlice(patientDetails?.CurrentAdmNo));
              } else if (result.type === POST_VISITOR_LIST_FAILURE) {
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
      if(!ipVisitors?.length){
        dispatch(getVisitorsListSlice(patientDetails?.CurrentAdmNo));
      }
    }, [dispatch, patientDetails?.CurrentAdmNo, ipVisitors?.length]);


  return (
    <div>
         <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Visitor List
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Visitor
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Visitor List
          </Button>
        </div>

        <VisitorFormTable showModal={showModal} loadingIpVisitors={loadingIpVisitors} ipVisitors={ipVisitors} />

        <Modal title="Visitor Form" 
          open={isModalOpen} 
          onOk={handleOk} 
          onCancel={handleCancel}
          okText= {isEditMode ? 'Update Visitor' : 'Save Visitor'}
        >
            <Form
            
                layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={{
                  admissionNo: patientDetails?.CurrentAdmNo,
                  visitorName: '',
                  idNumber: '',
                  phoneNumber: ''
                }}
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
                label="Visitor Name" 
                name="visitorName"
                hasFeedback
                rules={[
                  { required: true, message: 'Visitor Name is required' },
                  {
                    validator: (_, value) => {
                      const regex = /^[A-Za-z\s]+$/;
                      if (!value || regex.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Name should only contain letters and spaces');
                    },
                  },
                  {
                    validator: (_, value) => {
                      const name = value.length;
                      if (name < 3) {
                        return Promise.reject('Name should be at least 3 characters');
                      }
                      return Promise.resolve();
                    },
                  }
                
                ]}
                >
                <Input placeholder="Visitor Name"
                    type='text'
                />
            </Form.Item>

            <Form.Item 
                label="ID Number" 
                name="idNumber"
                hasFeedback
                rules={[
                  { required: true, message: 'ID Number is required' },
                  {
                    validator: (_, value) => {
                      const regex = /^\d{8}$/;
                      if (!value || regex.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('ID Number should contains digits and 8 digits long');
                    },
                  },
                ]}
                >
                <Input placeholder="ID Number"
                    type="text"
                />
            </Form.Item>

            <Form.Item 
                label="Phone Number" 
                name="phoneNumber"
                placeholder="e.g 0712345678"
                hasFeedback
                rules={[
                  { required: true, message: 'Phone Number is required' },
                  {
                    validator: (_, value) => {
                      const regex = /^07\d{8}$/;
                      if (!value || regex.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Phone Number must start with 07 and be 10 digits long');
                    },
                  },
                ]}
                >
                <Input placeholder="Phone Number"
                    type="text"
                />
            </Form.Item>
            </Form>
        </Modal>


    </div>
  )
}

export default VisitorsList
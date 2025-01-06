import { Button, Form, Input, message, Modal, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProfileOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import NursingNotesTable from "../tables/nurse-tables/NursingNotesTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { POST_NURSE_ADMISSION_NOTES_FAILURE, POST_NURSE_ADMISSION_NOTES_SUCCESS, postNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/postNurseAdmissionNotesSlice";
import { getNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/getNurseAdmissionNotesSlice";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";

const NursingNotes = () => {
  const role = useAuth().userData.departmentName; // Get user role from useAuth hook
  const { patientDetails } = useLocation().state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ form ] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();
  const userDetails = useAuth();

  const { loadingGetNurseAdmissionNotes, getNurseNotes } = useSelector((state) => state.getNurseAdmissionNotes);

  const { loadingNurseNotes } = useSelector((state) => state.postNurseAdmissionNotes);

  const showModal = (record) => {
    form.resetFields();
    if (record) {
        setIsEditMode(true);
        form.setFieldsValue({
            admissionNo: record?.AdmissionNo || '',
            nurseNotes: record?.Notes || '',
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
        
        // Construct the visitor data
        const notesData = {
          myAction: isEditMode ? "edit" : "create",
          recId: '',
          staffNo: userDetails.userData.no,
          branchCode: branchCode,
          patientNo: patientDetails?.PatientNo,
          admissionNo: patientDetails?.CurrentAdmNo,
          notes: values?.nurseNotes,
        };

    
        // Dispatch function to handle API call and feedback
        const dispatchNurseNotesData = async (data) => {
          await dispatch(postNurseAdmissionNotesSlice('/Nurse/NurseAdmissionNotes', data))
            .then((result) => {
              if (result.type === POST_NURSE_ADMISSION_NOTES_SUCCESS) {
                const actionWord = isEditMode ? 'updated' : 'added';
                message.success(`Visitor ${result.payload.visitorName} ${actionWord} successfully!`);
                dispatch(getNurseAdmissionNotesSlice(patientDetails?.CurrentAdmNo));
              } else if (result.type === POST_NURSE_ADMISSION_NOTES_FAILURE) {
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
        await dispatchNurseNotesData(notesData);
    
      } catch (error) {
        message.error(error.message || "An unexpected error occurred.");
      }
    };

    useEffect(() => {
        if(!getNurseNotes?.length){
          dispatch(getNurseAdmissionNotesSlice(patientDetails?.CurrentAdmNo));
        }
      }, [dispatch, patientDetails?.CurrentAdmNo, getNurseNotes?.length]);

  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative' }}>
        <ProfileOutlined />
        <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px' }}>
          Nursing Notes
        </Typography.Text>
      </Space>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px' }}>
        {/* Conditionally render buttons based on role */}
        {role !== 'Doctor' && (
          <Button type="primary" style={{ width: '100%' }} onClick={showModal}>
            <PlusOutlined /> Add Nursing Notes
          </Button>
        )}

        {role === 'Doctor' && (
          <>
            {/* Button to view Nursing Notes for Doctor */}
            <Button
              type="primary"
              style={{ width: '50%' }}
              icon={<EyeOutlined />}
              onClick={showModal}
            >
              View Nursing Notes
            </Button>
          </>
        )}
      </div>

        <NursingNotesTable showModal={showModal} loadingGetNurseAdmissionNotes={loadingGetNurseAdmissionNotes} getNurseNotes={getNurseNotes} />
      <NursingNotesTable showModal={showModal} />

        <Modal title="Nursing Notes" 
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditMode ? 'Update Notes' : 'Add Notes'}

            okButtonProps={{
              disabled: loadingNurseNotes,
              loading: loadingNurseNotes,
              style: isEditMode ? { display: 'none' } : undefined,
            }}
          >
            <Form
            
                layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={{
                  admissionNo: patientDetails?.CurrentAdmNo,
                  nurseNotes: ''
                  
                }}
            >

            <Form.Item 
                label="admissionNo Number" 
                name="admissionNo"
                rules={[{ required: true, message: 'Please enter the patient admission number!' }]}
              >
                  <Input 
                  disabled
             />
            </Form.Item>  
            <Form.Item 
            label="Nurse Notes" 
            name="nurseNotes"
            rules={[
              {
                required: true,
                message: 'Please enter the notes!',
              },
              {
                  validator: (_, value) => {
                    if (value && value.length > 2000) {
                      return Promise.reject(new Error('Nurse notes cannot exceed 150 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter Nurse Notes" name="Nurse Notes"
              rows={3}
          />
        </Form.Item>
        </Form>
        </Modal>
        
      <Modal 
        title={viewNotes ? "View Nursing Notes" : "Nursing Notes"} 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={null} // Remove footer buttons (if required)
      >
        {/* Render different content based on the role */}
        {viewNotes ? (
          <div>
            <Typography.Text>View Nursing Notes content goes here...</Typography.Text>
            {/* Add content related to viewing the notes */}
          </div>
        ) : (
          <Form
            layout="vertical"
            style={{ paddingTop: '10px' }}
            form={form}
          >
            <Form.Item
              label="Date"
              name="nurseNotesDate"
              rules={[{ required: true, message: 'Please enter the date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Time"
              name="nurseNotesTime"
              rules={[{ required: true, message: 'Please enter the time!' }]}
            >
              <TimePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Nurse Name"
              name="nurse"
            >
              <Input placeholder="Nurse name" disabled />
            </Form.Item>
            <Form.Item
              label="Nurse Notes"
              name="nurseNotes"
              rules={[
                {
                  required: true,
                  message: 'Please enter the notes!',
                },
                {
                  validator: (_, value) => {
                    if (value && value.length > 2000) {
                      return Promise.reject(new Error('Nurse notes cannot exceed 2000 characters!'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <TextArea placeholder="Enter Nurse Notes" name="Nurse Notes" rows={3} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default NursingNotes;

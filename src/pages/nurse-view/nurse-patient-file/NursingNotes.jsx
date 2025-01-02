import { Button, Form, Input, message, Modal, Space, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProfileOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons";
import NursingNotesTable from "../tables/nurse-tables/NursingNotesTable";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { POST_NURSE_ADMISSION_NOTES_FAILURE, POST_NURSE_ADMISSION_NOTES_SUCCESS, postNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/postNurseAdmissionNotesSlice";
import { getNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/getNurseAdmissionNotesSlice";
import useAuth from "../../../hooks/useAuth";

const NursingNotes = () => {

  const { patientDetails } = useLocation().state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ form ] = Form.useForm();
  const dispatch = useDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();
  const userDetails = useAuth();

  const { loadingGetNurseAdmissionNotes, getNurseNotes } = useSelector((state) => state.getNurseAdmissionNotes);

  const { loadingNurseNotes } = useSelector((state) => state.postNurseAdmissionNotes);

  console.log('nurse notes', getNurseNotes)
  const showModal = (record) => {
    form.resetFields();
    if (record) {
        setIsEditMode(true);
        form.setFieldsValue({
            admissionNo: record?.AdmissionNo || '',
            nursingNotes: record?.NursingNotes || '',
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
          notes: values.nurseNotes,
        };

    
        // Dispatch function to handle API call and feedback
        const dispatchNurseNotesData = async (data) => {
          await dispatch(postNurseAdmissionNotesSlice('/InpatientForms/VisitorsListForm', data))
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
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
            <ProfileOutlined />
            <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
                Nursing Notes
            </Typography.Text>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Nursing Notes</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><PrinterOutlined /> Print Cardex</Button>
        </div>

        <NursingNotesTable showModal={showModal} loadingGetNurseAdmissionNotes={loadingGetNurseAdmissionNotes} getNurseNotes={getNurseNotes} />

        <Modal title="Nursing Notes" 
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={isEditMode ? 'Update Notes' : 'Add Notes'}
            okButtonProps={{ disabled: loadingNurseNotes }}
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
        
    </div>
  )
}

export default NursingNotes
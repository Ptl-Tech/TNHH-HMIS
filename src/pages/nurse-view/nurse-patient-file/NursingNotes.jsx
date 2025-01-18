import { Button, Form, message } from "antd";
import { PlusOutlined, EyeOutlined, SaveOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { POST_NURSE_ADMISSION_NOTES_FAILURE, POST_NURSE_ADMISSION_NOTES_SUCCESS, postNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/postNurseAdmissionNotesSlice";
import { getNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/getNurseAdmissionNotesSlice";
import useAuth from "../../../hooks/useAuth";

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";


const NursingNotes = () => {
  const role = useAuth().userData.departmentName; // Get user role from useAuth hook
  const { patientDetails } = useLocation().state;
  const [ form ] = Form.useForm();
  const dispatch = useDispatch();
  const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();
  const userDetails = useAuth();
  const [isVitalFormVisible, setIsVitalFormVisible] = useState(false);

  const { loadingGetNurseAdmissionNotes, getNurseNotes } = useSelector((state) => state.getNurseAdmissionNotes);

  const { loadingNurseNotes } = useSelector((state) => state.postNurseAdmissionNotes);
  const navigate = useNavigate();

  const filterNurseNotes = getNurseNotes?.filter((note) => note?.AdmissionNo === patientDetails?.CurrentAdmNo);
    
  const handleNavigateReadNotes = () => {
    if (filterNurseNotes.length > 0) {
      navigate(`/Nurse/Inpatient/Read-nurse-notes`, {
        state: {
          loadingGetNurseAdmissionNotes,
          filterNurseNotes,
          patientDetails,
        },
      });
    } else {
      navigate(`/Doctor/Inpatient/Read-nurse-notes`, {
        state: {
            loadingGetNurseAdmissionNotes,
            filterNurseNotes,
            patientDetails,
        },
    });
    }
   
  };
  const handleVitalsButtonVisibility = () => {
    setIsVitalFormVisible(!isVitalFormVisible);
  }

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state) => {
        setEditorState(state);
        form.setFieldValue('content', JSON.stringify(convertToRaw(state.getCurrentContent())));
    };

const handleOnFinish = async () => {
      const contentState = editorState.getCurrentContent();
      const htmlContent = stateToHTML(contentState);
      try {
        
        // Construct the visitor data
        const notesData = {
          myAction: "create",
          recId: '',
          staffNo: userDetails.userData.no,
          branchCode: branchCode,
          patientNo: patientDetails?.PatientNo,
          admissionNo: patientDetails?.CurrentAdmNo,
          notes: htmlContent,
        };

        // Dispatch function to handle API call and feedback
        const dispatchNurseNotesData = async (data) => {
          await dispatch(postNurseAdmissionNotesSlice('/Nurse/NurseAdmissionNotes', data))
            .then((result) => {
              if (result.type === POST_NURSE_ADMISSION_NOTES_SUCCESS) {
                message.success(`Nursing Notes saved successfully!`);
                setEditorState(EditorState.createEmpty());
              } else if (result.type === POST_NURSE_ADMISSION_NOTES_FAILURE) {
                message.error(result.payload.message || "Internal server error, please try again later.");
              }
            })
            .then(() => {
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
          dispatch(getNurseAdmissionNotesSlice());
        }
      }, [dispatch, patientDetails?.CurrentAdmNo, getNurseNotes?.length]);

  return (
    <div>
      
      <NurseInnerHeader icon={<MedicineBoxOutlined />} title="Nursing Notes" />
    
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px' }}>
        {/* Conditionally render buttons based on role */}
        {role == 'Nurse' && (
          <>
              <Button type="primary" 
              style={{ width: '100%' }} 
              icon={<PlusOutlined />}
              onClick={handleVitalsButtonVisibility}
              >
                Add Nursing Notes
              </Button>
              <Button type="primary" 
              style={{ width: '100%' }}
              icon={<EyeOutlined />} 
              onClick={handleNavigateReadNotes}
              >
                Read Nursing Notes
              </Button>
          </>
        )}

        {role === 'Doctor' && (
          <>
            {/* Button to view Nursing Notes for Doctor */}
            <Button type="primary" 
            style={{ width: '50%' }} 
            icon={<EyeOutlined />}
            onClick={handleNavigateReadNotes}
            >
              Read Nursing Notes
              </Button>
          </>
        )}
      </div>
      {
        isVitalFormVisible && ( 
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
      label="Nurse Notes" 
      name="nurseNotes"
      rules={[
      {
        required: true,
        message: 'Please enter the notes!',
      }
      ]}
      >
      <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbar={{
              options: ['inline', 'blockType', 'list', 'textAlign', 'history'],
          }}
          editorStyle={{
              border: '1px solid #f0f0f0',
              padding: '5px',
              minHeight: '200px',
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          icon={<SaveOutlined />}
          loading={loadingNurseNotes}
          disabled={!editorState.getCurrentContent().hasText() || loadingNurseNotes}
        >Save Nursing Notes
        </Button>
      </Form.Item>
      </Form>

        )
      }
    </div>
  );
};

export default NursingNotes;

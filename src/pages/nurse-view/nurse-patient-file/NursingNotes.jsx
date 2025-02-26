import { Button, Form, message, Space } from "antd";
import { EyeOutlined, SaveOutlined, FileProtectOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { POST_NURSE_ADMISSION_NOTES_FAILURE, POST_NURSE_ADMISSION_NOTES_SUCCESS, postNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/postNurseAdmissionNotesSlice";
import useAuth from "../../../hooks/useAuth";

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import PropTypes from "prop-types";


const NursingNotes = () => {
  const role = useAuth().userData.departmentName; // Get user role from useAuth hook
  const { patientDetails } = useLocation().state;
  const [ form ] = Form.useForm();
  const dispatch = useDispatch();
  const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();
  const userDetails = useAuth();

  const { loadingNurseNotes } = useSelector((state) => state.postNurseAdmissionNotes);
  const navigate = useNavigate();
  

    
  const handleNavigateReadNotes = () => {
      navigate(`/Nurse/Inpatient/Read-nurse-notes`, {
        state: {
          patientDetails,
        },
      });
  };

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
          patientNo: patientDetails?.Patient_No,
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


  return (
    <div>
      
      <NurseInnerHeader icon={<FileProtectOutlined />} title="Nursing Notes" />
    
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '10px' }}>
        {/* Conditionally render buttons based on role */}
        
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
        <Space>
        <Button 
          type="primary" 
          htmlType="submit" 
          icon={<SaveOutlined />}
          loading={loadingNurseNotes}
          disabled={!editorState.getCurrentContent().hasText() || loadingNurseNotes}
        >Save Nursing Notes
        </Button>
         
        <Button type="primary" 
        icon={<EyeOutlined />} 
        onClick={handleNavigateReadNotes}
        >
          Read Nursing Notes
        </Button>
        </Space>
          
      </Form.Item>
      </Form>
    </div>
  );
};

export default NursingNotes;
// props validation
NursingNotes.propTypes = {
  setSelectedItem: PropTypes.string,
  selectedItem: PropTypes.string,
}

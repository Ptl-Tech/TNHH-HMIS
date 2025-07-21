import { Button, Form, message } from "antd";
import { PlusOutlined, FileProtectOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  POST_NURSE_ADMISSION_NOTES_FAILURE,
  POST_NURSE_ADMISSION_NOTES_SUCCESS,
  postNurseAdmissionNotesSlice,
} from "../../../actions/nurse-actions/postNurseAdmissionNotesSlice";
// import useAuth from "../../../hooks/useAuth";

import { EditorState, convertToRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import PropTypes from "prop-types";
import NursingNotesFormData from "../nurse-forms/NursingNotesFormData";
import NursingNotesTable from "../tables/nurse-tables/NursingNotesTable";
import { getNurseAdmissionNotesSlice } from "../../../actions/nurse-actions/getNurseAdmissionNotesSlice";

const NursingNotes = () => {
  const role = null.userData.departmentName; // Get user role from useAuth hook
  const { patientDetails } = useLocation().state;
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();
  const userDetails = null;
  const [isNursingNotesFormVisible, setIsNursingNotesFormVisible] =
    useState(false);

  const { loadingNurseNotes } = useSelector(
    (state) => state.postNurseAdmissionNotes
  );

  const { loadingGetNurseAdmissionNotes, getNurseNotes } = useSelector(
    (state) => state.getNurseAdmissionNotes
  );

  useEffect(() => {
    dispatch(getNurseAdmissionNotesSlice(patientDetails?.Admission_No));
  }, [dispatch, patientDetails?.Admission_No]);

  const handleNurseNotesButtonVisibility = () => {
    setIsNursingNotesFormVisible(!isNursingNotesFormVisible);
  };

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleEditorChange = (state) => {
    setEditorState(state);
    form.setFieldValue(
      "content",
      JSON.stringify(convertToRaw(state.getCurrentContent()))
    );
    form.validateFields(["content"]);
  };

  const handleOnFinish = async () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    try {
      // Construct the visitor data
      const notesData = {
        myAction: "create",
        recId: "",
        staffNo: userDetails.userData.no,
        branchCode: branchCode,
        patientNo: patientDetails?.Patient_No,
        admissionNo: patientDetails?.Admission_No,
        notes: htmlContent,
      };

      // Dispatch function to handle API call and feedback
      const dispatchNurseNotesData = async (data) => {
        await dispatch(
          postNurseAdmissionNotesSlice("/Nurse/NurseAdmissionNotes", data)
        )
          .then((result) => {
            if (result.type === POST_NURSE_ADMISSION_NOTES_SUCCESS) {
              message.success(`Nursing Notes saved successfully!`);
              dispatch(
                getNurseAdmissionNotesSlice(patientDetails?.Admission_No)
              );
              setIsNursingNotesFormVisible(false);
              setEditorState(EditorState.createEmpty());
            } else if (result.type === POST_NURSE_ADMISSION_NOTES_FAILURE) {
              message.error(
                result.payload.message ||
                  "Internal server error, please try again later."
              );
            }
          })
          .then(() => {
            form.resetFields();
          })
          .catch((err) => {
            message.error(
              err.message || "Internal server error, please try again later."
            );
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

      {!isNursingNotesFormVisible && role === "Nurse" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            paddingBottom: "10px",
            marginTop: "20px",
          }}
        >
          <Button type="primary" onClick={handleNurseNotesButtonVisibility}>
            <PlusOutlined />
            Nursing Notes
          </Button>
        </div>
      )}

      {isNursingNotesFormVisible && (
        <NursingNotesFormData
          form={form}
          editorState={editorState}
          handleEditorChange={handleEditorChange}
          handleOnFinish={handleOnFinish}
          loadingNurseNotes={loadingNurseNotes}
          setIsNursingNotesFormVisible={setIsNursingNotesFormVisible}
        />
      )}

      {!isNursingNotesFormVisible && (
        <NursingNotesTable
          loadingGetNurseAdmissionNotes={loadingGetNurseAdmissionNotes}
          getNurseNotes={getNurseNotes}
        />
      )}
    </div>
  );
};

export default NursingNotes;
// props validation
NursingNotes.propTypes = {
  setSelectedItem: PropTypes.string,
  selectedItem: PropTypes.string,
};

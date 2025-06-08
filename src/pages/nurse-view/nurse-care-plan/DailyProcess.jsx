import { Button, Form, message } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined, UserAddOutlined } from '@ant-design/icons';
import GeneralObservationsTable from '../tables/nurse-tables/GeneralObservationsTable';
import { useDispatch, useSelector } from 'react-redux';
import { getQyInpatientProcessProceduresSlice } from '../../../actions/nurse-actions/getQyInpatientProcessProceduresSlice';
import { useLocation } from 'react-router-dom';
import DailyProcessFormData from '../nurse-forms/DailyProcessFormData';
import NurseInnerHeader from '../../../partials/nurse-partials/NurseInnerHeader';
import { convertToRaw, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import {
  POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE,
  POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS,
  postDailyProcedureOrProcessSlice,
} from '../../../actions/nurse-actions/postDailyProcedureOrProcessSlice';
import useAuth from '../../../hooks/useAuth';
const DailyProcess = () => {
  const { patientDetails } = useLocation().state;
  const queryParams = new URLSearchParams(location.search);
  const AdmNo = queryParams.get('AdmNo');
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const role = useAuth().userData.departmentName;

  const [isDailyProcessFormVisible, setIsDailyProcessFormVisible] =
    useState(false);

  const { loadingGetIpProcedure, ipGetProcedure } = useSelector(
    (state) => state.getQyInpatientProcessProcedure,
  );

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleVitalsButtonVisibility = () => {
    setIsDailyProcessFormVisible(!isDailyProcessFormVisible);
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    form.setFieldValue(
      'content',
      JSON.stringify(convertToRaw(state.getCurrentContent())),
    );
  };

  const handleOnFinish = async () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    try {
      // Construct the visitor data
      const visitorData = {
        recId: '',
        notesType: 1,
        myAction: 'create',
        notes: htmlContent,
        treatmentNo: patientDetails?.CurrentAdmNo || AdmNo,
        patientNo: patientDetails?.Patient_No || queryParams.get('PatientNo'),
      };

      // Dispatch function to handle API call and feedback
      const dispatchDailyProcessData = async (data) => {
        await dispatch(postDailyProcedureOrProcessSlice(data))
          .then((result) => {
            if (result.type === POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS) {
              message.success(`Daily Process added successfully!`);
              dispatch(getQyInpatientProcessProceduresSlice(AdmNo));
              setIsDailyProcessFormVisible(false);
            } else if (
              result.type === POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE
            ) {
              message.error(
                result.payload.message ||
                  'Internal server error, please try again later.',
              );
            }
          })
          .then(() => {
            form.resetFields();
          })
          .catch((err) => {
            message.error(
              err.message || 'Internal server error, please try again later.',
            );
          });
      };

      // Call the function
      await dispatchDailyProcessData(visitorData);
    } catch (error) {
      message.error(error.message || 'An unexpected error occurred.');
    }
  };

  useEffect(() => {
    dispatch(getQyInpatientProcessProceduresSlice(AdmNo));
  }, [dispatch, AdmNo]);

  return (
    <div>
      <NurseInnerHeader
        icon={<UserAddOutlined />}
        title="Daily Ward Rounds"
      />

      {!isDailyProcessFormVisible && role === 'Doctor' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            paddingBottom: '20px',
            marginTop: '20px',
          }}
        >
          <Button
            type="primary"
            onClick={handleVitalsButtonVisibility}
            icon={<PlusOutlined />}
          >
            Add Daily Progress
          </Button>
        </div>
      )}

      {!isDailyProcessFormVisible && (
        <GeneralObservationsTable
          ipGetProcedure={ipGetProcedure}
          loadingGetIpProcedure={loadingGetIpProcedure}
        />
      )}

      {isDailyProcessFormVisible && (
        <DailyProcessFormData
          form={form}
          editorState={editorState}
          handleEditorChange={handleEditorChange}
          handleOnFinish={handleOnFinish}
          loadingGetIpProcedure={loadingGetIpProcedure}
          setIsDailyProcessFormVisible={setIsDailyProcessFormVisible}
        />
      )}
    </div>
  );
};

export default DailyProcess;

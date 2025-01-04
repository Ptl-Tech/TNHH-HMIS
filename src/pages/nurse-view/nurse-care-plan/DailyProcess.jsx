import { Button, Form, Input, message, Modal, Space, TimePicker, Typography } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import GeneralObservationsTable from "../tables/nurse-tables/GeneralObservationsTable";
import TextArea from "antd/es/input/TextArea";
import { POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE, POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS, postDailyProcedureOrProcessSlice } from "../../../actions/nurse-actions/postDailyProcedureOrProcessSlice";
import { useDispatch, useSelector } from "react-redux";
import { getQyInpatientProcessProceduresSlice } from "../../../actions/nurse-actions/getQyInpatientProcessProceduresSlice";
import { useLocation } from "react-router-dom";

const DailyProcess = () => {
          const [isModalOpen, setIsModalOpen] = useState(false);
          const [isEditMode, setIsEditMode] = useState(false);
          const [ form ] = Form.useForm();
          const { patientDetails } = useLocation().state;

          const {loadingGetIpProcedure, ipGetProcedure} = useSelector((state) => state.getQyInpatientProcessProcedure);
          const { loadingDailyProcedure } = useSelector((state) => state.postDailyProcedureOrProcess);

          const filterProcedures = ipGetProcedure?.filter(procedure => procedure.AdmissionNo === patientDetails?.CurrentAdmNo);

          const dispatch = useDispatch();
          const showModal = (record) => {
            form.resetFields();
            if (record) {
            setIsEditMode(true);
            form.setFieldsValue({
              process: record.ProcessCode,
              processDescription: record.Process,
              remarks: record.Remarks
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
              const visitorData = {
                myAction: isEditMode ? "edit" : "create",
                raceId: "",
                admissionNo: patientDetails?.CurrentAdmNo,
                processCode: values.process,
                processDescription: values.process,
                remarks: values.remarks
              };
          
              // Dispatch function to handle API call and feedback
              const dispatchDailyProcessData = async (data) => {
                await dispatch(postDailyProcedureOrProcessSlice(data))
                  .then((result) => {
                    if (result.type === POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS) {
                      const actionWord = isEditMode ? 'updated' : 'added';
                      message.success(`Daily Process ${actionWord} successfully!`);
                      dispatch(getQyInpatientProcessProceduresSlice());
                    } else if (result.type === POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE) {
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
              await dispatchDailyProcessData(visitorData);
          
            } catch (error) {
              message.error(error.message || "An unexpected error occurred.");
            }
          };

    useEffect(() => {
          if(!ipGetProcedure?.length){
            dispatch(getQyInpatientProcessProceduresSlice());
          }
        }, [dispatch, ipGetProcedure?.length]);
  
      
  return (
    <div>
        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Daily Process / Procedures
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Daily Process</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Daily Process</Button>
        </div>

        <GeneralObservationsTable showModal={showModal} ipGetProcedure={filterProcedures} loadingGetIpProcedure={loadingGetIpProcedure}/>

        <Modal title="Daily Process / Procedures" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText={'Save Process'}
        okButtonProps={{ 
          disabled: loadingDailyProcedure, 
          loading: loadingDailyProcedure,
          style: isEditMode ? { display: 'none' } : undefined, 
        }}
        >
        
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            onFinish={handleOnFinish}
            autoComplete="off"
            initialValues={{
                process: '',
                processDescription: '',
                remarks: '',
            }}
            >
            <Form.Item label="Process Code" 
                rules={[{ required: true, message: 'Please select process!' }]}
                name="process"
                hasFeedback
                >
                <Input type='text' placeholder="Enter value" />
                  
            </Form.Item>  
            <Form.Item label="Process Description" name="processDescription"
              rules={[{ required: true, message: 'Please select a time!' }]}
              hasFeedback
            >
            <Input type='text' placeholder="Enter description" 
          
            />
        </Form.Item>
        <Form.Item label="Remarks" name="remarks"
          rules={[{ required: true, message: 'Please enter a value!' }]}
        >
            <TextArea type='text' placeholder="Enter value" />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default DailyProcess
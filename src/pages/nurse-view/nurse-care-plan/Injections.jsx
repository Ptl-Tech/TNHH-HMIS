import { Button, DatePicker, Form, message, Modal, Select, Space, TimePicker, Typography } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, ProfileOutlined, FolderViewOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import DiagnosisTable from "../tables/nurse-tables/DiagnosisTable";
import { useDispatch, useSelector } from "react-redux";
import { POST_INPATIENT_INJECTION_FAILURE, POST_INPATIENT_INJECTION_SUCCESS, postInpatientInjectionSlice } from "../../../actions/nurse-actions/postInpatientInjectionSlice";
import { useLocation } from "react-router-dom";
import { getInpatientInjectionSlice } from "../../../actions/nurse-actions/getInpatientInjectionSlice";
import { getInjectionNumberSlice } from "../../../actions/triage-actions/getInjectionNumberSlice";
import dayjs from "dayjs";

const Injections = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isEditMode, setIsEditMode] = useState(false);
      const [ form ] = Form.useForm();
      const dispatch = useDispatch();
       const { patientDetails } = useLocation().state;

       const { loadingGetInpatientInjection, injections } = useSelector((state) => state.getInpatientInjection);
       const { loadingInpatientInjection } = useSelector((state) => state.postInpatientInjection);
       const { loadingInjectionNumber, injectionsNumber } = useSelector((state) => state.getInjectionNumber);

       const filterInjections = injections?.filter((item) => item.AdmissionNo === patientDetails?.CurrentAdmNo);
  
       const showModal = (record) => {
        form.resetFields();
        if (record) {
            setIsEditMode(true);
            form.setFieldsValue({
                injection: record?.InjectionName || '',
                remarks: record?.Remarks || '',
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
          const injectionsData = {
            myAction: isEditMode ? "edit" : "create",
            recId: "",
            admissionNo:  patientDetails?.CurrentAdmNo,
            injectionDate: dayjs(values?.date).format('YYYY-MM-DD'),
            injectionTime: dayjs(values?.time).format('HH:mm:ss'),
            injection: values?.injection,
            remarks: values?.remarks,
          };

          
          // Dispatch function to handle API call and feedback
          const dispatchVisitorData = async (data) => {
            await dispatch(postInpatientInjectionSlice('/Inpatient/Injection', data))
              .then((result) => {
                if (result.type === POST_INPATIENT_INJECTION_SUCCESS) {
                  const actionWord = isEditMode ? 'updated' : 'added';
                  message.success(`Injection ${actionWord} successfully!`);
                  dispatch(getInpatientInjectionSlice('/data/odatafilter?webservice=QyInpatientInjections&isList=true'));
                } else if (result.type === POST_INPATIENT_INJECTION_FAILURE) {
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
          await dispatchVisitorData(injectionsData);
      
        } catch (error) {
          message.error(error.message || "An unexpected error occurred.");
        }
      };

      useEffect(() => {
        if(!injections?.length){
          dispatch(getInpatientInjectionSlice('/data/odatafilter?webservice=QyInpatientInjections&isList=true'));
        }
      }, [dispatch, injections?.length]);

      useEffect(() => {
        if(!injectionsNumber?.length){
          dispatch(getInjectionNumberSlice());
        }
      }, [dispatch, injectionsNumber?.length]);
  
  return (
    <div>

        <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Injections
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Injection</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined /> Preview Injection</Button>
        </div>

        <DiagnosisTable showModal={showModal} loadingGetInpatientInjection={loadingGetInpatientInjection} injections={filterInjections} />

        <Modal title="Add Diagnosis" 
              open={isModalOpen}
              onOk={handleOk} 
              onCancel={handleCancel}
              okText={'Save Injection'}
              okButtonProps={{ 
                loading: loadingInpatientInjection,
                disabled: loadingInpatientInjection,
                style: isEditMode ? { display: 'none' } : undefined, 
              
              }}
              >
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            onFinish={handleOnFinish}
            initialValues={{
              date: '',
              time: '',
              injection: '',
              remarks: '',
            }}
            >

            {
              !isEditMode ? (
                <>
                <Form.Item label="Date" name="date"
                rules={[{ required: true, message: 'Please select date!' }]}
                hasFeedback
                >
                <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Time" name="time"
                rules={[{ required: true, message: 'Please select date!' }]}
                hasFeedback
                >
                <TimePicker style={{ width: '100%' }} />
                </Form.Item>
                </>
                
              ) : (
                null
              )
            }
            <Form.Item label="Injection" 
                name="injection"
                rules={[{ required: true, message: 'Please select injection!' }]}
                hasFeedback
                placeholder="Injection"
                >
                <Select 
                  loading={loadingInjectionNumber}
                  options={injectionsNumber?.map((item) => ({
                    key: item.Code,
                    label: item.Description,
                    value: item.Code,
                  }))}
                />
            </Form.Item>
      
            <Form.Item label="Remarks" name="remarks"
              rules={[{ required: true, message: 'Please enter a remarks!' }]}
              hasFeedback
            >
            <TextArea type='text' placeholder="Enter description" 
             
            />
        </Form.Item>
        </Form>
        </Modal>

    </div>
  )
}

export default Injections
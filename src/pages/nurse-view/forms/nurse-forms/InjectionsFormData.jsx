import { Button, Col, DatePicker, Form, message, Row, Select, Space, TimePicker } from "antd"
import TextArea from "antd/es/input/TextArea"
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { POST_INPATIENT_INJECTION_FAILURE, POST_INPATIENT_INJECTION_SUCCESS, postInpatientInjectionSlice } from "../../../../actions/nurse-actions/postInpatientInjectionSlice";
import { getInpatientInjectionSlice } from "../../../../actions/nurse-actions/getInpatientInjectionSlice";
import { useEffect } from "react";
import { getInjectionNumberSlice } from "../../../../actions/triage-actions/getInjectionNumberSlice";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

const InjectionsFormData = ({ setIsInjectionFormVisible }) => {
  const [ form ] = Form.useForm();
  const { patientDetails } = useLocation().state;
  const dispatch = useDispatch();
  const { loadingInpatientInjection } = useSelector((state) => state.postInpatientInjection);
  const { loadingInjectionNumber, injectionsNumber } = useSelector((state) => state.getInjectionNumber);
  const handleOnFinish = async (values) => {
    try {
  
      // Construct the visitor data
      const injectionsData = {
        myAction: "create",
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
              message.success(`Injection saved successfully!`);
              dispatch(getInpatientInjectionSlice('/data/odatafilter?webservice=QyInpatientInjections&isList=true'));
              setIsInjectionFormVisible(false);
            } else if (result.type === POST_INPATIENT_INJECTION_FAILURE) {
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
      await dispatchVisitorData(injectionsData);
  
    } catch (error) {
      message.error(error.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if(!injectionsNumber?.length){
      dispatch(getInjectionNumberSlice());
    }
  }, [dispatch, injectionsNumber?.length]);

  return (
    <>
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
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item label="Date" name="date"
                    rules={[{ required: true, message: 'Please select date!' }]}
                    hasFeedback
                    >
                    <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Time" name="time"
                    rules={[{ required: true, message: 'Please select date!' }]}
                    hasFeedback
                    >
                    <TimePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
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
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Remarks" name="remarks"
                    hasFeedback
                    >
                    <TextArea type='text' placeholder="Enter description" 

                    />
                    </Form.Item>
                </Col>
            </Row>
        <Form.Item>
            <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}
                    loading={loadingInpatientInjection}
                    disabled={loadingInpatientInjection}
                >
                    Save Injections
                </Button>
                <Button color="danger" variant="outlined" icon={<CloseOutlined />} onClick={() => setIsInjectionFormVisible(false)}>
                    Cancel
                </Button>
            </Space>
            
        </Form.Item>
        </Form>
    </>
  )
}

export default InjectionsFormData
// form validation
InjectionsFormData.propTypes = {
  setIsInjectionFormVisible: PropTypes.bool.isRequired,
};
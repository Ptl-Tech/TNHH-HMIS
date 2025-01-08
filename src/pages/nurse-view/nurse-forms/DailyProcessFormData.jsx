import { Button, Col, Form, Input, message, Row, Space } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE, POST_DAILY_PROCEDURE_OR_PROCESS_SUCCESS, postDailyProcedureOrProcessSlice } from "../../../actions/nurse-actions/postDailyProcedureOrProcessSlice";
import { getQyInpatientProcessProceduresSlice } from "../../../actions/nurse-actions/getQyInpatientProcessProceduresSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const DailyProcessFormData = ({ setIsDailyProcessFormVisible }) => {
    const [ form ] = Form.useForm();
    const { patientDetails } = useLocation().state;
    const dispatch = useDispatch();
    const { loadingDailyProcedure } = useSelector((state) => state.postDailyProcedureOrProcess);

    const handleOnFinish = async (values) => {
        try {
          
          // Construct the visitor data
          const visitorData = {
            myAction: "create",
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
                  message.success(`Daily Process added successfully!`);
                  dispatch(getQyInpatientProcessProceduresSlice());
                  setIsDailyProcessFormVisible(false);
                } else if (result.type === POST_DAILY_PROCEDURE_OR_PROCESS_FAILURE) {
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
          await dispatchDailyProcessData(visitorData);
      
        } catch (error) {
          message.error(error.message || "An unexpected error occurred.");
        }
      };


  return (
    <>    
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
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Form.Item label="Process Code" 
                    rules={[{ required: true, message: 'Please select process!' }]}
                    name="process"
                    hasFeedback
                    >
                    <Input type='text' placeholder="Enter value" />
                </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Process Description" name="processDescription"
                    rules={[{ required: true, message: 'Please select a time!' }]}
                    hasFeedback
                    >
                    <Input type='text' placeholder="Enter description" 

                    />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Form.Item label="Remarks" name="remarks"
                    >
                    <TextArea type='text' placeholder="Enter value" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />}
                        loading={loadingDailyProcedure}
                        disabled={loadingDailyProcedure}
                    >
                        Post Daily Process
                    </Button>
                    <Button color="danger" variant="outlined" icon={<CloseOutlined />} onClick={() => setIsDailyProcessFormVisible(false)}
                    >
                        Cancel
                    </Button>
                </Space>
                
            </Form.Item>
        </Form>
    </>
  )
}

export default DailyProcessFormData
// props validation

DailyProcessFormData.propTypes = {
    setIsDailyProcessFormVisible: PropTypes.bool.isRequired,
};
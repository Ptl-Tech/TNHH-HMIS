import { Button, Col, Form, Input, message, Row, Space } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useDispatch } from "react-redux";
import { POST_SUICIDAL_FORM_FAILURE, POST_SUICIDAL_FORM_SUCCESS, postSuicidalFormSlice } from "../../../../actions/nurse-actions/postSuicidalFormSlice";
import { getSuicidalFormSlice } from "../../../../actions/nurse-actions/getSuicidalFormSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import moment from "moment";

const SuicidalFormData = ({ setIsFormVisible, patientDetails, loadingSuicidalForm, formattedSffNo, form }) => {
    const dispatch = useDispatch();
    const handleOnFinish = async (values) => {
        try {

          const { handingOver, remarks } = values;
  
          const suicidalFormData = {
            myAction: "create",
            admissionNo: patientDetails?.Admission_No,
            handingOver,
            takingOver: formattedSffNo,
            remarks,
            date: moment().format('YYYY-MM-DD'),
            time: moment().format('HH:mm:ss')   
          }
           // Dispatch function to handle API call and feedback
          const dispatchSuicidalFormData = async (data) => {
            await dispatch(postSuicidalFormSlice('/InpatientForms/SuicidalPrecautionForm', data))
              .then((result) => {
                if (result.type === POST_SUICIDAL_FORM_SUCCESS) {
                  message.success(`suicidal precaution form has been saved successfully!`);
                  setIsFormVisible(false);
                  dispatch(getSuicidalFormSlice(patientDetails?.Admission_No));
                } else if (result.type === POST_SUICIDAL_FORM_FAILURE) {
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
          await dispatchSuicidalFormData(suicidalFormData);
  
        }catch (error) {
          message.error(error.message || "An unexpected error occurred.");
        }
  
      }
  return (
    <>
        <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={{
                  date: '',
                  time: '',
                  handingOver: '',
                  takingOver: formattedSffNo,
                  remarks: ''
                  }}
            >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item 
                    label="Handing Over Nurse" 
                    name="handingOver"
                    hasFeedback
                    rules={[
                    {
                        required: true,
                        message: "Handing Over is required.",
                    },
                    {
                        pattern: /^[a-zA-Z ]{3,}$/,
                        message: "Must contain only alphabetic characters and be at least 3 characters long.",
                    }
                    ]}
                    >
                    <Input placeholder="Handing Over Nurse"
                        type="text"
                    />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                <Form.Item 
                label="Remarks" 
                name="remarks"
                hasFeedback
                rules={[
                  {
                    pattern: /^[a-zA-Z0-9 ]{3,}$/,
                    message: "Must contain only alphanumeric characters and be at least 3 characters long.",
                  }
                ]}
                >
                <TextArea placeholder="Enter Remarks" autoSize={{ minRows: 3 }}
                    type="text"
                    
                />
                </Form.Item>
                </Col>
            </Row>
            <Form.Item>
                <Space>
                    <Button type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />
                    }
                    loading={loadingSuicidalForm}
                    disabled={loadingSuicidalForm}     
                    >
                        Save Visitor
                    </Button>
                    <Button color="danger" variant="outlined" icon={<CloseOutlined />} onClick={() => setIsFormVisible(false)}
                    >
                        Cancel
                    </Button>
                </Space>
                
            </Form.Item>
            </Form>
    </>
  )
}

export default SuicidalFormData
// props validation
SuicidalFormData.propTypes = {
  setIsFormVisible: PropTypes.bool.isRequired,
  patientDetails: PropTypes.array.isRequired,
  loadingSuicidalForm: PropTypes.bool.isRequired,
  formattedSffNo: PropTypes.string.isRequired,
  form: PropTypes.object.isRequired
};
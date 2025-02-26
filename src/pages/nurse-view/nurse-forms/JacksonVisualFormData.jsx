import { useDispatch } from "react-redux";
import { POST_JACKSON_VISUAL_FORM_FAILURE, POST_JACKSON_VISUAL_FORM_SUCCESS, postJacksonVisualFormSlice } from "../../../actions/nurse-actions/postJacksonVisualFormSlice";
import { Button, Col, Form, Input, message, Row, Select, Space, Image } from "antd";
import { getJacksonVisualFormSlice } from "../../../actions/nurse-actions/getJacksonVisualFormSlice";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import jacksonVisualImage from "../../../assets/images/jackson-visual-form.jpg";
import dayjs from "dayjs";

const JacksonVisualFormData = ({ patientDetails, setIsFormVisible, loadingJackson }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const handleOnFinish = async (values) => {
      
        try {
          const { score, iv_line } = values;
      
          // Construct the visitor data
          const jacksonData = {
            myAction:"create",
            admissionNo: patientDetails?.Admission_No,
            score,
            date: dayjs().format('YYYY-MM-DD'),
            ivLine: iv_line
          };
      
          // Dispatch function to handle API call and feedback
          const dispatchJacksonVisualFormData = async (data) => {
            console.log('Jackson visual data', data);
            await dispatch(postJacksonVisualFormSlice('/InpatientForms/JacksonVisualForm', data))
              .then((result) => {
                if (result.type === POST_JACKSON_VISUAL_FORM_SUCCESS) {
                  message.success(`Jackson Visual Form saved successfully!`);
                  dispatch(getJacksonVisualFormSlice(patientDetails?.Admission_No));
                } else if (result.type === POST_JACKSON_VISUAL_FORM_FAILURE) {
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
          await dispatchJacksonVisualFormData(jacksonData);
      
        } catch (error) {
          message.error(error.message || "An unexpected error occurred.");
        }
      };
  
  return (
    <>
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <Form
                onFinish={handleOnFinish}
                layout="vertical" 
                form={form}
                initialValues={{
                score: '',
                iv_line: undefined,
                }}
                >          
                <Form.Item 
                label="Score" 
                name="score"
                hasFeedback
                rules={[
                {
                    required: true,
                    message: 'Please input score!',
                },
                ]}
                >
                <Input placeholder="Score"
                type='number'
                />
                </Form.Item>

                <Form.Item
                label="IV Line"    
                name="iv_line"
                hasFeedback
                rules={[
                {
                required: true,
                message: 'Please input IV Line!',
                },
                ]}
                >
                  <Select 
                      placeholder="Select IV Line"
                      options={[
                        { value: '1', label: 'Insertion' },
                        { value: '2', label: 'Removal' },
                      ]}
                  />
                </Form.Item>
                <Form.Item>
                <Space>
                    <Button type="primary" 
                    htmlType="submit" 
                    icon={<SaveOutlined />
                    }
                    loading={loadingJackson}
                    disabled={loadingJackson}     
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
            </Col>
            <Col span={12}>
                <Image 
                src={jacksonVisualImage} 
                width={500} 
                height={230} 
                
                />
            </Col>
        </Row>
    </>
  )
}

export default JacksonVisualFormData
// props validation
JacksonVisualFormData.propTypes = {
    form: PropTypes.object.isRequired,
    patientDetails: PropTypes.array.isRequired,
    setIsFormVisible: PropTypes.bool,
    loadingJackson: PropTypes.bool.isRequired
}
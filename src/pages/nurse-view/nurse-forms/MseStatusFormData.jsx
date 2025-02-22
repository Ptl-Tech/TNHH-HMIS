import { Button, Form, message, Select, Space } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useDispatch } from "react-redux";
import { POST_MENTAL_EXAMINATION_FORM_FAILURE, POST_MENTAL_EXAMINATION_FORM_SUCCESS, postMentalExaminationFormSlice } from "../../../actions/nurse-actions/postMentalExaminationFormSlice";
import { getMentalExaminationFormSlice } from "../../../actions/nurse-actions/getMentalExaminationFormSlice";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const MseStatusFormData = ({ patientDetails, form, setIsFormVisible, loadingMentalStatus }) => {
   const dispatch = useDispatch();
    const handleOnFinish = async (values) => {
        try{
            
          const { status, comments } = values;
          
          const mentalStateExaminationFormData = {
            myAction: "create",
            admissionNo: patientDetails?.Admission_No,
            date: dayjs().format('YYYY-MM-DD'),
            status,
            comments,
          }

  
        // Dispatch function to handle API call and feedback
        const dispatchMentalStateExaminationData = async (data) => {
          await dispatch(postMentalExaminationFormSlice('/InpatientForms/MentalStatusCheckForm', data))
            .then((result) => {
              if (result.type === POST_MENTAL_EXAMINATION_FORM_SUCCESS) {
                message.success(`Mental state examination form saved successfully!`);
                dispatch(getMentalExaminationFormSlice(patientDetails?.Admission_No));
              } else if (result.type === POST_MENTAL_EXAMINATION_FORM_FAILURE) {
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
        await dispatchMentalStateExaminationData(mentalStateExaminationFormData);
  
        }catch(err){
          message.error(err.message || "Internal server error, please try again later.");
        }
      }

  return (
    <>
        <Form
            
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            onFinish={handleOnFinish}
            initialValues={
              {
                status: undefined,
                comments: '',
              }
            }
        >
        <Form.Item
        label="Status"    
        name="status"
        placeholder="Select status"
        hasFeedback
        rules={[
            {
              required: true,
              message: 'Please select status!',
            },
          ]}
        >
            <Select>
                <Select.Option value="good">Good</Select.Option>
                <Select.Option value="average">Average</Select.Option>
                <Select.Option value="bad">Bad</Select.Option>
            </Select>
        </Form.Item>

        <Form.Item 
            label="Comments" 
            name="comments"
            hasFeedback
            rules={[
                {
                  required: true,
                  message: 'Please input comments!',
                },
              ]}
            >
            <TextArea placeholder="Comments"
                autoSize={{ minRows: 3, maxRows: 5 }}
                type="text"
                
            />
        </Form.Item>
        <Form.Item>
            <Space>
                <Button type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />
                }
                loading={loadingMentalStatus}
                disabled={loadingMentalStatus}     
                >
                    Save MSE Form
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

export default MseStatusFormData
// props validations
MseStatusFormData.propTypes = {
    patientDetails: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    setIsFormVisible: PropTypes.bool.isRequired,
    loadingMentalStatus: PropTypes.bool.isRequired
}
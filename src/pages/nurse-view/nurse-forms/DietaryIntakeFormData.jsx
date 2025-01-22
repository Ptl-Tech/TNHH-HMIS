import { Button, Col, Form, Input, message, Row, Select, Space } from "antd"
import TextArea from "antd/es/input/TextArea"
import { useDispatch } from "react-redux";
import { POST_DIETARY_INTAKE_FORM_LINE_FAILURE, POST_DIETARY_INTAKE_FORM_LINE_SUCCESS, postDietaryIntakeFormLineSlice } from "../../../actions/nurse-actions/postDietaryIntakeFormLineSlice";
import { getQyDietaryFormLinesSlice } from "../../../actions/nurse-actions/getQyIPDietaryFormLinesSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const DietaryIntakeFormData = ({ form, patientDetails, filterIpLookupValues, setIsFormVisible, loadingDietaryIntake, loadingIpLookupValues }) => {
    const dispatch = useDispatch();
    const handleOnFinish = async (values) => {
        try {
          const { category, comments } = values;
      
          // Construct the visitor data
          const visitorData = {
            myAction: "create",
            admissionNo: patientDetails?.Admission_No,
            category,
            comments,
          };
      
          // Dispatch function to handle API call and feedback
          const dispatchVisitorData = async (data) => {
            await dispatch(postDietaryIntakeFormLineSlice(data))
              .then((result) => {
                if (result.type === POST_DIETARY_INTAKE_FORM_LINE_SUCCESS) {
                  message.success(`Dietary Intake Form Line saved successfully!`);
                  setIsFormVisible(false);
                  dispatch(getQyDietaryFormLinesSlice());
                } else if (result.type === POST_DIETARY_INTAKE_FORM_LINE_FAILURE) {
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
          await dispatchVisitorData(visitorData);
      
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
            initialValues={
                {
                    category: '',
                    comments: '',
                }
            }
        >
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Form.Item
        label="Select Dietary Category"    
        name="category"
        hasFeedback
        rules={[
            {
                required: true,
                message: 'Please select a category!',
            }
        ]}
        >
          <Select 
          placeholder="Select a category"
          showSearch
          loading={loadingIpLookupValues}
          options={filterIpLookupValues?.map((item) => ({
            value: item.Category,
            label: item.Description,
          }))}
          allowClear

          />
        </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
        <Form.Item 
            label="Comments" 
            name="comments"
            hasFeedback
            rules={[
                {
                    required: true,
                    message: 'Please enter comments!',
                }
            ]}
            >
            <TextArea placeholder="Comments"
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
                loading={loadingDietaryIntake}
                disabled={loadingDietaryIntake}     
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

export default DietaryIntakeFormData
// props validation
DietaryIntakeFormData.propTypes = {
    form: PropTypes.object.isRequired,
    patientDetails: PropTypes.array.isRequired,
    filterIpLookupValues: PropTypes.array.isRequired,
    setIsFormVisible: PropTypes.bool.isRequired,
    loadingDietaryIntake: PropTypes.bool.isRequired,
    loadingIpLookupValues: PropTypes.bool.isRequired
}
import { Button, Col, Form, Input, message, Row, Space } from "antd";
import { useDispatch } from "react-redux";
import { POST_VISITOR_LIST_FAILURE, POST_VISITOR_LIST_SUCCESS, postVisitorListSlice } from "../../../../actions/nurse-actions/postVisitorListSlice";
import { getVisitorsListSlice } from "../../../../actions/nurse-actions/getVisitorsListSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import Loading from "../../../../partials/nurse-partials/Loading";

const VisitorsListFormData = ({ setIsFormVisible, loadingIpVisitors, loadingVisitor, patientDetails }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const handleOnFinish = async (values) => {
        try {
          const { visitorName, idNumber, phoneNumber } = values;
          const visitorData = {
            myAction: "create",
            admissionNo: patientDetails?.Admission_No,
            visitorName,
            idNumber,
            phoneNumber,
          };
      
          // Dispatch function to handle API call and feedback
          const dispatchVisitorData = async (data) => {
            await dispatch(postVisitorListSlice('/InpatientForms/VisitorsListForm', data))
              .then((result) => {
                if (result.type === POST_VISITOR_LIST_SUCCESS) {
                  message.success( result.payload.msg || `Visitor has been saved successfully!`);
                  dispatch(getVisitorsListSlice(patientDetails?.Admission_No));
                  setIsFormVisible(false);
                } else if (result.type === POST_VISITOR_LIST_FAILURE) {
                  message.error(result.payload.msg || "Internal server error, please try again later.");
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
        {
            loadingIpVisitors ? (
                <Loading />
            ):(
            <Form
            
            layout="vertical"
            form={form}
            onFinish={handleOnFinish}
            initialValues={{
              visitorName: '',
              idNumber: '',
              phoneNumber: ''
            }}
        >
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item 
                label="Visitor Name" 
                name="visitorName"
                hasFeedback
                rules={[
                { required: true, message: 'Visitor Name is required' },
                {
                    validator: (_, value) => {
                    const regex = /^[A-Za-z\s]+$/;
                    if (!value || regex.test(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject('Name should only contain letters and spaces');
                    },
                },
                {
                    validator: (_, value) => {
                    const name = value.length;
                    if (name < 3) {
                        return Promise.reject('Name should be at least 3 characters');
                    }
                    return Promise.resolve();
                    },
                }
                
                ]}
                >
                <Input placeholder="Visitor Name"
                    type='text'
                />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item 
                label="ID Number" 
                name="idNumber"
                hasFeedback
                rules={[
                { required: true, message: 'ID Number is required' },
                {
                    validator: (_, value) => {
                    const regex = /^\d{8}$/;
                    if (!value || regex.test(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject('ID Number should contains digits and 8 digits long');
                    },
                },
                ]}
                >
                <Input placeholder="ID Number"
                    type="text"
                />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item 
                label="Phone Number" 
                name="phoneNumber"
                placeholder="e.g 0712345678"
                hasFeedback
                rules={[
                { required: true, message: 'Phone Number is required' },
                {
                    validator: (_, value) => {
                    const regex = /^(?:\+?\d{1,3})?\d{10}$/;
                    if (!value || regex.test(value)) {
                        return Promise.resolve();
                    }
                    return Promise.reject('PPlease enter a valid phone number');
                    },
                },
                ]}
                >
                <Input placeholder="Phone Number"
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
                    loading={loadingVisitor}
                    disabled={loadingVisitor}     
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
            )
        }
    </>
  )
}

export default VisitorsListFormData
// props validation
VisitorsListFormData.propTypes = {
    setIsFormVisible: PropTypes.bool,
    loadingIpVisitors: PropTypes.bool,
    loadingVisitor: PropTypes.bool,
    patientDetails: PropTypes.object
}
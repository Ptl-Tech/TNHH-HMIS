import { Button, Col, DatePicker, Form, message, Row, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SaveOutlined, CloseOutlined, SendOutlined} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getLabRequestSetup } from "../../../../actions/Doc-actions/qyLabTestsSetup";
import PropTypes from "prop-types";
import { postLabRequest } from "../../../../actions/Doc-actions/postLabRequest";


const LabRequestFormData = ({ patientDetails, setIsFormVisible}) => {
    const dispatch = useDispatch();
    const { data: labTestSetupData, loading } = useSelector(
        (state) => state.getlabRequestSetup
      );

    const { loading: loadingLabRequestPost } = useSelector(
        (state) => state.postLabRequest
      );
    const { form } = Form.useForm();

    const handleOnFinish = async (values) => {
        const data = {
            testPackageCode: values?.testPackageCode,
            dueDate: values?.dueDate.format('YYYY-MM-DD'),
            description: values?.description,
            treatmentNo: patientDetails?.CurrentAdmNo,
            myAction: 'create',
            lineNo: 0,
        }

        try{
           const result = await dispatch(postLabRequest(data))
           if(result.type === 'POST_LAB_SUCCESS'){
            message.success('Lab Request Created Successfully');
           }else if(result.type === 'POST_LAB_FAIL'){
            message.error('Lab Request Creation Failed');
           }
        }catch(error){
            message.error(error.message || 'An error occurred while creating the lab request.');
        }
    }

    useEffect(() =>{
        dispatch(getLabRequestSetup());
    }, [dispatch])
  return (
    <>
     <Form
            
            layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                initialValues={{
                    dueDate: '',
                    testPackageCode: '',
                    description: '',

                }}
                onFinish={handleOnFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                         label="Due Date"
                         name="dueDate"
                         rules={[{ required: true, message: 'Please enter the due date!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                         label="Test Package Code"
                         name="testPackageCode"
                         placeholder="Enter test package code" 
                         rules={[{ required: true, message: 'Please enter the package code!' }]}
                        >
                            <Select 
                            type="text" 
                            loading={loading}
                            allowClear
                            showSearch
                            style={{ width: '100%' }}
                            options={
                                labTestSetupData?.map((item, key) => ({
                                    key,
                                    value: item.Code,
                                    label: item.Description,
                                }))
                            }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label="Remarks"
                            name="description"
                        >
                            <TextArea placeholder="Enter remarks" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item>
                    <Space>
                        <Button
                        type="primary" 
                        htmlType="submit" 
                        icon={<SaveOutlined />}
                        loading={loadingLabRequestPost}
                        disabled={loadingLabRequestPost}
                        >
                        Save Lab Request
                        </Button>
                        <Button
                        type="primary" 
                        icon={<SendOutlined />}
                        >
                            Send Request to Lab
                        </Button>
                        <Button
                        color="danger"
                        variant="outlined" 
                        icon={<CloseOutlined />}
                        onClick={() => setIsFormVisible(false)}
                        >
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
     </Form>
    </>
  )
}

export default LabRequestFormData
// props validation
LabRequestFormData.propTypes = {
    patientDetails: PropTypes.object.isRequired,
    setIsFormVisible: PropTypes.bool.isRequired,
  };
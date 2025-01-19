import { Button, Form, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CloseOutlined, SaveOutlined, SendOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const RadiologyRequestFormData = ({ setIsFormVisible }) => {
    const [form] = Form.useForm();
  return (
    <>
        <Form
        layout="vertical" 
        style={{ paddingTop: '10px'}} 
        form={form}
        >

        <Form.Item
        label="Radiology Type"
        name="radiologyType"
        rules={[{ required: true, message: 'Please enter the radiology type!' }]}
        hasFeedback
        >

        <Select
            style={{ width: '100%' }}
            placeholder="Select a laboratory test request name"
            allowClear
            showSearch
            >
            <Select.Option value="option1">Albunine test</Select.Option>
            <Select.Option value="option2">Urine toxicology</Select.Option>
            </Select>

            </Form.Item>

        <Form.Item 
        label="Required Investigation" 
        name="requiredInvestigation"
        rules={[
            {
                validator: (_, value) => {
                if (value && value.length > 200) {
                    return Promise.reject(new Error('Required Investigation cannot exceed 200 characters!'));
                }
                return Promise.resolve();
                },
            }
        ]}
        >
        <TextArea placeholder="Enter required investigation"
            rows={2}
        />
        </Form.Item>
        <Form.Item 
        label="Brief History" 
        name="briefHistory"
        rules={[
            {
                validator: (_, value) => {
                if (value && value.length > 150) {
                    return Promise.reject(new Error('Brief History cannot exceed 150 characters!'));
                }
                return Promise.resolve();
                },
            }
        ]}
        >
        <TextArea placeholder="Enter brief history" name="briefHistory"
            rows={2}
        />
        </Form.Item>
        <Form.Item>
                    <Space>
                        <Button
                        type="primary" 
                        htmlType="submit" 
                        icon={<SaveOutlined />}
                        // loading={loadingLabRequestPost}
                        // disabled={loadingLabRequestPost}
                        >
                        Save Radiologist Request
                        </Button>
                        <Button
                        type="primary" 
                        icon={<SendOutlined />}
                        >
                            Send Request to Radiologist
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

export default RadiologyRequestFormData
// props validation
RadiologyRequestFormData.propTypes = {
    setIsFormVisible: PropTypes.bool.isRequired,
};
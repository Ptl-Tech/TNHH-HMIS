import { Button, Col, DatePicker, Form, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

const DischargeSummaryFormData = ({
  form,
  handleOnFinish,
  isViewing,
  setIsFormVisible,
}) => {
  const handleResetForm = () => {
    form.resetFields();
    setIsFormVisible(false);
  };
  return (
    <Form
      form={form}
      layout="vertical"
      style={{ paddingTop: "10px" }}
      onFinish={handleOnFinish}
      initialValues={{
        investigationsDone: "",
        dischargeInstructions: "",
        management: "",
        reviewDate: null,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="Investigations Done"
            name="investigationsDone"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.length > 150) {
                    return Promise.reject(
                      new Error(
                        "Investigations done cannot exceed 150 characters!"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TextArea placeholder="Enter investigations done" rows={2} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Discharge instructions / Treatments"
            name="dischargeInstructions"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.length > 150) {
                    return Promise.reject(
                      new Error(
                        "Discharge instructions cannot exceed 150 characters!"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TextArea placeholder="Enter discharge instructions" rows={2} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Management"
            name="management"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.length > 150) {
                    return Promise.reject(
                      new Error("Management cannot exceed 150 characters!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TextArea placeholder="Enter management" rows={2} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Review Date" name="reviewDate">
            <DatePicker placeholder="Review Date" style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          {isViewing ? null : (
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Discharge Summary
            </Button>
          )}
          <Button
            color="danger"
            variant="outlined"
            icon={<CloseOutlined />}
            onClick={() => handleResetForm()}
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default DischargeSummaryFormData;
// props validation
DischargeSummaryFormData.propTypes = {
  form: PropTypes.object,
  handleOnFinish: PropTypes.func,
  isViewing: PropTypes.bool,
  loadingCarePlan: PropTypes.bool,
  handleResetForm: PropTypes.func,
  setIsFormVisible: PropTypes.func,
};

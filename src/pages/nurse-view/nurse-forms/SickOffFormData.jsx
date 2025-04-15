import { Button, Col, DatePicker, Form, Input, Row, Space } from "antd";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const SickOffFormData = ({
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
        offDays: "",
        lightOffDays: "",
        management: "",
        sickOffStartDay: "",
        sickOffEndDay: "",
        nextAppointmentDate: "",
        remarks: "",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Form.Item label="Off Duty Days" name="offDays" hasFeedback>
            <Input placeholder="Off Duty Days" type="number" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Light Duty Days" name="lightOffDays" hasFeedback>
            <Input placeholder="Light Duty Days" type="number" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Sick off Start Day"
            name="sickOffStartDay"
            hasFeedback
          >
            <DatePicker
              placeholder="Sick off Start Day"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Sick off End Day" name="sickOffEndDay" hasFeedback>
            <DatePicker
              placeholder="Sick off End Day"
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Next Appointment Date"
            name="nextAppointmentDate"
            hasFeedback
          >
            <DatePicker
              placeholder="Next Appointment Date"
              disabled
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Remarks"
            name="remarks"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.length > 200) {
                    return Promise.reject(
                      new Error("Remarks cannot exceed 200 characters!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TextArea placeholder="Enter remarks" rows={2} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          {isViewing ? null : (
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              Save Sick Off
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

export default SickOffFormData;
// props validation
SickOffFormData.propTypes = {
  form: PropTypes.object,
  handleOnFinish: PropTypes.func,
  isViewing: PropTypes.bool,
  setIsFormVisible: PropTypes.func,
  setIsViewing: PropTypes.func,
};

import { Button, Col, Form, Row, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const CarePlanFormData = ({ setIsFormVisible }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} layout="vertical" style={{ paddingTop: "10px" }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item
            label="Physical Assessment"
            name="physicalAssessment"
            style={{ width: "100%" }}
            rules={[
              {
                required: true,
                message: "Please enter the physical assessment!",
              },
            ]}
          >
            <TextArea
              placeholder="Physical Assessment"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Nursing Diagnosis"
            name="nursingDiagnosis"
            style={{ width: "100%" }}
            rules={[
              {
                required: true,
                message: "Please enter the nursing diagnosis!",
              },
            ]}
          >
            <TextArea
              placeholder="Nursing Diagnosis"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="Implementation"
            name="implementation"
            style={{ width: "100%" }}
          >
            <TextArea
              placeholder="Nursing Implementation"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Rationale"
            name="rationale"
            style={{ width: "100%" }}
          >
            <TextArea
              placeholder="Rationale"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            label="Evaluation"
            name="evaluation"
            style={{ width: "100%" }}
          >
            <TextArea
              placeholder="evaluation"
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save Care Plan
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
  );
};

export default CarePlanFormData;

//props validation
CarePlanFormData.propTypes = {
  setIsFormVisible: PropTypes.bool,
};

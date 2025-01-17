import {
  Button,
  DatePicker,
  Form,
  Modal,
  Select,
  Space,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ProfileOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import ETCTable from "../tables/nurse-tables/ETCTable";

const ECTScan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [form] = Form.useForm();
  return (
    <div>
      <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "30px",
          position: "relative",
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px" }}
        >
          ECT Request
        </Typography.Text>
      </Space>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          paddingBottom: "20px",
        }}
      >
        <Button
          type="primary"
          style={{ width: "100%" }}
          onClick={() => showModal()}
        >
          <PlusOutlined /> Add ECT Request
        </Button>
        <Button color="default" variant="outlined" style={{ width: "100%" }}>
          <FolderViewOutlined /> Preview ECT
        </Button>
      </div>

      <ETCTable showModal={showModal} />

      <Modal
        title="ECT Request"
        open={isModalOpen}
        style={{ top: 10 }}
        
        width={800}
        footer={
          <>
          <Button type="primary" onClick={handleOk}>
              Save 
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
                      </>
        }
      >
        <Form
          layout="vertical"
          style={{ paddingTop: "10px" }}
          form={form}
          autoComplete="off"
        >
          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Item
                label="Procedure"
                name="Operation"
                rules={[
                  { required: true, message: "Please select a procedure!" },
                ]}
                hasFeedback
                style={{ width: "100%" }}

              >
                <Select placeholder="Select an procedure"                size="large"
                >
                  <Select.Option value="General">ECT</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-md-6">
              <Form.Item
                label="Anesthetist/Anesthesiologist"
                name="doctorName"
                rules={[{ required: true, message: "Please select a anesthetist/anesthesiologist!" }]}
                hasFeedback
                style={{ width: "100%" }}
              >
                <Select
                  placeholder="Select a doctor name"
                  style={{ width: "100%" }}
                  size="large"

                >
                  <Select.Option value="General">Dr. John</Select.Option>
                  <Select.Option value="Allergy">Dr. Jane</Select.Option>
                </Select>
              </Form.Item>
            </div>
           
          </div>
          <div className="row">
          <div className="col-12 ">
              <Form.Item
                label="Procedure Dates"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one date!",
                  },
                ]}
                name="dates"
                hasFeedback
              >
                <DatePicker
                  multiple
                  maxTagCount="responsive"
                  size="large"
                   style={{ width: "100%" }}
                  placeholder="Select multiple dates"
                />
              
              </Form.Item>
            </div>
          </div>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description!" }]}
            hasFeedback
          >
            <TextArea placeholder="Enter description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ECTScan;

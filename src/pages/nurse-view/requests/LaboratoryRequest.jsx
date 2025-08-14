import { Button, Form, Modal, Select } from "antd";
import { PlusOutlined, FolderViewOutlined } from "@ant-design/icons";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import SendToLaboratoryTable from "../tables/nurse-tables/SendToLaboratoryTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import LabRequestFormData from "../forms/nurse-forms/LabRequestFormData";
import { useLocation } from "react-router-dom";

const LaboratoryRequest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { patientDetails } = useLocation().state;

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleVitalsButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const [form] = Form.useForm();

  return (
    <div>
      <NurseInnerHeader title="Laboratory Request" />
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
          onClick={handleVitalsButtonVisibility}
        >
          <PlusOutlined /> Add Laboratory Request
        </Button>
        <Button color="default" variant="outlined" style={{ width: "100%" }}>
          <FolderViewOutlined />
          Preview Laboratory Request
        </Button>
      </div>

      {isFormVisible && (
        <LabRequestFormData
          patientDetails={patientDetails}
          setIsFormVisible={setIsFormVisible}
        />
      )}

      {!isFormVisible && <SendToLaboratoryTable />}

      <Modal
        title="Charges"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Send to Laboratory"
      >
        <Form layout="vertical" style={{ paddingTop: "10px" }} form={form}>
          <Form.Item
            label="Laboratory Test Request Name"
            name="laboratoryTestRequestName"
            rules={[
              {
                required: true,
                message: "Please enter the laboratory test request name!",
              },
            ]}
            hasFeedback
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Select a laboratory test request name"
              allowClear
              showSearch
            >
              <Select.Option value="option1">Albunine test</Select.Option>
              <Select.Option value="option2">Urine toxicology</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Brief History"
            name="briefHistory"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.length > 150) {
                    return Promise.reject(
                      new Error("Brief History cannot exceed 150 characters!")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <TextArea
              placeholder="Enter brief history"
              name="briefHistory"
              rows={2}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LaboratoryRequest;

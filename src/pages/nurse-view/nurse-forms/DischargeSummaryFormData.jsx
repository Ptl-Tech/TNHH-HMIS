import { Button, Col, Form, notification, Row, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { SaveOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  getDischargeSummary,
  POST_DISCHARGE_SUMMARY_FAILURE,
  POST_DISCHARGE_SUMMARY_SUCCESS,
  postDischargeSummary,
} from "../../../actions/nurse-actions/postInitiateDischargeSlice";
const DischargeSummaryFormData = ({ form, isViewing, setIsFormVisible }) => {
  const handleResetForm = () => {
    form.resetFields();
    setIsFormVisible(false);
  };
  const { Option } = Select;

  const queryParams = new URLSearchParams(location.search);
  const admissionNo = queryParams.get("AdmNo");
  const dispatch = useDispatch();

  const dischargeSummaryType = [
    { Code: "0", Description: "Clinical Summary" },
    { Code: "1", Description: "Investigation" },
    { Code: "2", Description: "Management" },
    { Code: "3", Description: "Discharge Instructions" },
    { Code: "4", Description: "Recommendation" },
    { Code: "5", Description: "Diagnosis" },
  ];
  const userDetails = useAuth();
  const [selectedDischargeSummaryType, setSelectedDischargeSummaryType] =
    useState(null); // Track selected test package
  const [dischargeSummary, setDischargeSummary] = useState([]); // Track lab requests
  const { loading: loadingPostDischargeSummary } = useSelector(
    (state) => state.postDischargeSummary
  );

  const summary = {
    myAction: "create",
    staffNo: userDetails?.userData?.firstName,
    branchCode: localStorage.getItem("branchCode"),
    recId: "",
    admissionNo,
    type: 0,
    description: "",
  };

  const handleDischargeSummaryChange = (name, value, option) => {
    setSelectedDischargeSummaryType({ code: value, name: option.children });
  };

  const [dischargeDescriptions, setDischargeDescriptions] = useState({});

  const handleAddDischargeSummaryType = () => {
    if (!selectedDischargeSummaryType) {
      notification.error({
        message: "Error",
        description: "Please select a discharge summary type.",
      });
      return;
    }

    const existingSummary = dischargeSummary.find(
      (item) => item.code === selectedDischargeSummaryType.code
    );
    if (existingSummary) {
      notification.error({
        message: "Error",
        description: `Discharge summary type ${selectedDischargeSummaryType.name} already exists.`,
      });
      return;
    }

    setDischargeSummary((prev) => [...prev, selectedDischargeSummaryType]);
    setSelectedDischargeSummaryType(null); // Reset selected test package
    form.setFieldsValue({ dischargeSummaryType: undefined }); // Reset AntD form field
  };

  const handleSave = async () => {
    if (!dischargeSummary.length) return;

    for (const item of dischargeSummary) {
      const payload = {
        ...summary,
        type: item.code,
        description: dischargeDescriptions[item.code] || "",
      };

      if (payload.description === "") {
        notification.error({
          message: "Error",
          description: `Please provide a description for ${item.name}.`,
        });
        return;
      }

      try {
        const response = await dispatch(postDischargeSummary(payload));
        if (response.type === POST_DISCHARGE_SUMMARY_SUCCESS) {
          notification.success({
            message: "Success",
            description: `Discharge summary for ${item.name} saved successfully.`,
          });
          dispatch(getDischargeSummary(admissionNo)); // Refresh the summary data
          setDischargeSummary([]); // Clear the discharge summary after saving
          setDischargeDescriptions({}); // Clear the descriptions
          handleResetForm(); // Reset the form
          isViewing && setIsFormVisible(false); // Close the form if viewing
        } else if (response.type === POST_DISCHARGE_SUMMARY_FAILURE) {
          notification.error({
            message: "Error",
            description: `Failed to save discharge summary for ${item.name}.`,
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: `Failed to save discharge summary for ${item.name}.`,
        });
      }
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      style={{ paddingTop: "10px" }}
      autoComplete="off"
    >
      <div className="d-flex justify-content-between align-items-center gap-3 my-3 flex-wrap">
        <Form.Item
          name="dischargeSummaryType"
          label="Discharge Summary Type"
          rules={[{ required: true }]}
          style={{ flex: 1 }} // 💡 Apply flex here
        >
          <Select
            placeholder="Select Discharge Summary Type"
            showSearch
            onChange={(value, option) =>
              handleDischargeSummaryChange(
                "dischargeSummaryType",
                value,
                option
              )
            }
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            size="large"
          >
            {dischargeSummaryType?.map((item) => (
              <Option key={item.Code} value={item.Code}>
                {item.Description}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={handleAddDischargeSummaryType}
          disabled={!selectedDischargeSummaryType}
        >
          Discharge Summary Type
        </Button>
      </div>

      {dischargeSummary.length > 0 && (
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          {/* Header Row */}
          <Row
            style={{
              background: "#0f5689",
              fontWeight: "bold",
              borderBottom: "1px solid #d9d9d9",
              color: "#ffffff",
            }}
          >
            <Col span={2} style={{ padding: "12px" }}>
              #
            </Col>
            <Col span={8} style={{ padding: "12px" }}>
              Discharge Summary Type
            </Col>
            <Col span={10} style={{ padding: "12px" }}>
              Description
            </Col>
            <Col span={4} style={{ padding: "12px" }}>
              Action
            </Col>
          </Row>

          {/* Data Row */}
          {dischargeSummary?.map((item, index) => (
            <Row
              style={{
                borderBottom: "1px solid #f0f0f0",
                display: "flex",
                alignItems: "center",
              }}
              key={index}
            >
              <Col span={2} style={{ padding: "12px" }}>
                {index + 1}
              </Col>
              <Col span={8} style={{ padding: "12px" }}>
                <TextArea
                  value={item.name}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  name="summaryType"
                  disabled
                  style={{ color: "#0f5689" }}
                />
              </Col>
              <Col span={10} style={{ padding: "12px" }}>
                <TextArea
                  placeholder="Enter summary description"
                  autoSize={{ minRows: 2, maxRows: 2 }}
                  name="summaryDescription"
                  value={dischargeDescriptions[item.code] || ""}
                  onChange={(e) => {
                    setDischargeDescriptions((prev) => ({
                      ...prev,
                      [item.code]: e.target.value,
                    }));
                  }}
                />
              </Col>
              <Col span={4} style={{ padding: "12px" }}>
                <Button
                  color="danger"
                  variant="filled"
                  style={{ color: "red" }}
                  className="d-flex align-items-center justify-content-center"
                  icon={<CloseOutlined style={{ color: "red" }} />}
                  onClick={() => {
                    setDischargeSummary((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                    setDischargeDescriptions((prev) => {
                      const updated = { ...prev };
                      delete updated[item.code];
                      return updated;
                    });
                  }}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          ))}
        </div>
      )}

      {dischargeSummary.length > 0 && (
        <Form.Item style={{ marginTop: "20px" }}>
          <Space>
            {isViewing ? null : (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={loadingPostDischargeSummary}
                disabled={loadingPostDischargeSummary}
              >
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
      )}
    </Form>
  );
};

export default DischargeSummaryFormData;
// props validation
DischargeSummaryFormData.propTypes = {
  form: PropTypes.object,
  isViewing: PropTypes.bool,
  loadingCarePlan: PropTypes.bool,
  handleResetForm: PropTypes.func,
  setIsFormVisible: PropTypes.func,
};

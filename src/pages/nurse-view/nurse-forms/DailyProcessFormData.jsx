import { Button, Form, Space } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";

const DailyProcessFormData = ({
  setIsDailyProcessFormVisible,
  form,
  handleEditorChange,
  editorState,
  handleOnFinish,
  loadingGetIpProcedure,
}) => {
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  return (
    <>
      <Form
        layout="vertical"
        style={{ paddingTop: "10px" }}
        form={form}
        onFinish={handleOnFinish}
        autoComplete="off"
        initialValues={{
          admissionNo: admissionNo,
          remarks: "",
        }}
      >
        <Form.Item
          label="Progress Remarks"
          name="remarks"
          rules={[
            {
              required: true,
              message: "Please enter the daily progress remarks!",
            },
          ]}
        >
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            toolbar={{
              options: ["inline", "blockType", "list", "textAlign", "history"],
            }}
            editorStyle={{
              border: "1px solid #f0f0f0",
              padding: "5px",
              minHeight: "200px",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loadingGetIpProcedure}
              disabled={
                !editorState.getCurrentContent().hasText() ||
                loadingGetIpProcedure
              }
            >
              Post Daily Progress
            </Button>
            <Button
              color="danger"
              variant="outlined"
              icon={<CloseOutlined />}
              onClick={() => setIsDailyProcessFormVisible(false)}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default DailyProcessFormData;
// props validation

DailyProcessFormData.propTypes = {
  setIsDailyProcessFormVisible: PropTypes.bool,
  form: PropTypes.object,
  handleEditorChange: PropTypes.func,
  editorState: PropTypes.object,
  handleOnFinish: PropTypes.func,
  loadingGetIpProcedure: PropTypes.bool,
  setLoadingDailyProcedure: PropTypes.func,
};

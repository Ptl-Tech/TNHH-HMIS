import { Button, Form, Space } from "antd";
import { Editor } from "react-draft-wysiwyg";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const NursingNotesFormData = ({
  form,
  editorState,
  handleEditorChange,
  handleOnFinish,
  loadingNurseNotes,
  setIsNursingNotesFormVisible,
}) => {
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  return (
    <Form
      layout="vertical"
      style={{ paddingTop: "10px" }}
      form={form}
      onFinish={handleOnFinish}
      initialValues={{
        admissionNo: admissionNo,
        nurseNotes: "",
      }}
    >
      <Form.Item
        label="Nurse Notes"
        name="nurseNotes"
        rules={[
          {
            required: true,
            message: "Please enter the notes!",
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
            loading={loadingNurseNotes}
            disabled={
              !editorState.getCurrentContent().hasText() || loadingNurseNotes
            }
          >
            Save Nursing Notes
          </Button>

          <Button
            color="danger"
            variant="outlined"
            icon={<CloseOutlined />}
            onClick={() => setIsNursingNotesFormVisible(false)}
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default NursingNotesFormData;
// props validation
NursingNotesFormData.propTypes = {
  form: PropTypes.object,
  editorState: PropTypes.object,
  handleEditorChange: PropTypes.func,
  handleOnFinish: PropTypes.func,
  loadingNurseNotes: PropTypes.bool,
  setIsNursingNotesFormVisible: PropTypes.func,
};

import React from "react";
import { Form, Row, Col, Button } from "antd";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const DiagnosisFormulationForm = ({
  form,
  editorState,
  setEditorState,
  onFinish,
}) => {
  const handleEditorChange = (state) => {
    setEditorState(state);
    form.setFieldValue("notes", state.getCurrentContent().getPlainText());
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="notes"
            label="Notes"
            rules={[
              { required: true, message: "Please enter notes" },
              {
                validator: (_, value) =>
                  value && value.length > 2000
                    ? Promise.reject("Notes cannot exceed 2000 characters")
                    : Promise.resolve(),
              },
            ]}
          >
            <Editor
              editorState={editorState}
              wrapperClassName="editor-wrapper"
              editorClassName="editor-content"
              toolbar={{
                options: [
                  "inline",
                  "blockType",
                  "list",
                  "textAlign",
                  "history",
                ],
              }}
              editorStyle={{
                border: "1px solid #f0f0f0",
                padding: "10px",
                minHeight: "200px",
              }}              onEditorStateChange={handleEditorChange}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Button type="primary" htmlType="submit">
            Save Notes
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default DiagnosisFormulationForm;

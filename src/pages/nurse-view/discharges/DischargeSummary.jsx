import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Form, Input, message } from "antd";
import { useLocation } from "react-router-dom";
import {
  postDischargeSummary,
  POST_DISCHARGE_SUMMARY_RESET,
} from "../../../actions/nurse-actions/postInitiateDischargeSlice";
import { useForm } from "antd/es/form/Form";

function DischargeSummary({
  type,
  label,
  errorMessage,
  loadingMessage,
  successMessage,
}) {
  const [form] = useForm();
  const FormItem = Form.Item;
  const { TextArea } = Input;

  const dispatch = useDispatch();
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");

  const { data, error, loading } = useSelector(
    (state) => state.postDischargeSummary
  );

  useEffect(() => {
    if (loading && loadingMessage) message.info(loadingMessage);

    if (data?.status === "success") {
      form.resetFields();
      if (successMessage) message.success(successMessage);
    }

    if (error || (data?.status === "failed" && errorMessage))
      message.error(errorMessage);

    if (data?.status === "success" || error || data?.status === "failed")
      dispatch({ type: POST_DISCHARGE_SUMMARY_RESET });
  }, [data, error, loading]);

  const handleOnFinish = (values) => {
    const { description } = values;
    dispatch(
      postDischargeSummary({
        type,
        recId: "",
        admissionNo,
        description,
        myAction: "create",
      })
    );
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleOnFinish}
      initialValues={{ description: "" }}
    >
      <FormItem name={"description"} label={label} rules={[{ required: true }]}>
        <TextArea />
      </FormItem>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}

export default DischargeSummary;

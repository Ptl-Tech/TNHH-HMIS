import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "antd/es/form/Form";
import { Button, Card, Form, Input, message, Tabs } from "antd";

import { NoData } from "../../../components/NoData";

import {
  postDischargeSummary,
  POST_DISCHARGE_SUMMARY_RESET,
} from "../../../actions/nurse-actions/postInitiateDischargeSlice";

function DischargeSummary({
  type,
  label,
  errorMessage,
  dischargeData,
  loadingMessage,
  successMessage,
}) {
  const items = [
    {
      key: "dischargeSummaryForm",
      label: dischargeData?.Description ? `Update ${label}` : `Add ${label}`,
      children: (
        <DischargeSummaryForm
          type={type}
          label={label}
          errorMessage={errorMessage}
          loadingMessage={loadingMessage}
          successMessage={successMessage}
          description={dischargeData?.Description}
        />
      ),
    },
    {
      label: label,
      key: "dischargeSummary",
      children: (
        <DischargeSummaryCard
          label={label}
          description={dischargeData?.Description}
        />
      ),
    },
  ];

  return <Tabs type="card" size="small" items={items} />;
}

function DischargeSummaryForm({
  type,
  label,
  description,
  errorMessage,
  loadingMessage,
  successMessage,
}) {
  const FormItem = Form.Item;
  const { TextArea } = Input;
  const [form] = useForm();

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

    if (data?.status === "success" || data?.status === "failed" || error)
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
      initialValues={{ description: description || "" }}
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

function DischargeSummaryCard({ label, description }) {
  return (
    <Card
      size="small"
      title={label}
      children={
        <div className="p-2">
          <p className="m-0 p-0">
            {description || (
              <NoData content={`No ${label.toLowerCase()} added`} />
            )}
          </p>
        </div>
      }
    />
  );
}

export default DischargeSummary;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Form, Select } from "antd";
import { getdiagnosisSetup } from "../../../actions/Doc-actions/qyDiagnosisSetup";

function DischargeDiagnosis() {
  const FormItem = Form.Item;

  const dispatch = useDispatch();

  const { loading, data: diagnosisData } =
    useSelector((state) => state.getDiagnosisSetup) || {};

  useEffect(() => {
    dispatch(getdiagnosisSetup());
  }, []);

  const handleOnFinish = (values) => {
    console.log({ values });
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleOnFinish}
      initialValues={{ diagnosis: "" }}
    >
      <FormItem
        name={"diagnosis"}
        rules={[{ required: true }]}
        label={"Chose a diagnosis"}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder={"Chose a diagnosis"}
          loading={loading || !Boolean(diagnosisData?.length)}
          options={diagnosisData?.map(
            ({ Code: value, Description: label }) => ({
              label,
              value,
            })
          )}
        />
      </FormItem>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}

export default DischargeDiagnosis;

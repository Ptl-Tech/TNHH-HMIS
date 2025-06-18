import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Card, Button, Form, message, Select, Tabs } from "antd";

import { NoData } from "../../../components/NoData";

import {
  postDischargeDiagnosis,
  POST_DISCHARGE_DIAGNOSIS_RESET,
} from "../../../actions/Doc-actions/postDischargeDiagnosis";
import { getdiagnosisSetup } from "../../../actions/Doc-actions/qyDiagnosisSetup";

function DischargeDiagnosis({ currentInpatient }) {
  const dispatch = useDispatch();
  const admissionNo = new URLSearchParams(useLocation().search).get("AdmNo");

  const { loading, data: diagnosisData } = useSelector(
    (state) => state.getDiagnosisSetup
  );

  useEffect(() => {
    dispatch(getdiagnosisSetup());
  }, []);

  const items = [
    {
      key: "dischargeDiagnosisForm",
      label: currentInpatient?.Final_Diagnosis
        ? "Update diagnosis"
        : "Choose a diagnosis",
      children: (
        <DischargeDiagnosisForm
          loading={loading}
          admissionNo={admissionNo}
          diagnosisData={diagnosisData}
          update={currentInpatient?.Final_Diagnosis}
        />
      ),
    },
    {
      key: "dischargeDiagnosis",
      label: "Discharge Diagnosis",
      children: (
        <DischargeDiagnosisCard data={currentInpatient?.Final_Diagnosis_Name} />
      ),
    },
  ];

  return <Tabs type="card" size="small" items={items} />;
}

function DischargeDiagnosisForm({
  update,
  loading,
  admissionNo,
  diagnosisData,
}) {
  const FormItem = Form.Item;

  const {
    data: postDischargeData,
    error: postDischargeError,
    loading: postDischargeLoading,
  } = useSelector((state) => state.postDischargeDiagnosis) || {};

  useEffect(() => {
    if (postDischargeLoading) message.info("Posting the discharge diagnosis");

    if (postDischargeData?.status === "success") {
      message.success("Diagnosis created successfully");
    }

    if (postDischargeError) message.error(postDischargeError);

    if (postDischargeData?.status === "success" || postDischargeError)
      dispatch({ type: POST_DISCHARGE_DIAGNOSIS_RESET });
  }, [postDischargeData, postDischargeError, postDischargeLoading]);

  const handleOnFinish = (values) => {
    const { diagnosisNo } = values;
    const data = { diagnosisNo, admissionNo };
    dispatch(postDischargeDiagnosis(data));
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleOnFinish}
      initialValues={{ diagnosisNo: update ? update : "" }}
    >
      <FormItem
        name={"diagnosisNo"}
        rules={[{ required: true }]}
        label={update ? "Update diagnosis" : "Choose a diagnosis"}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder={"Choose a diagnosis"}
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

function DischargeDiagnosisCard({ data }) {
  return (
    <Card
      size="small"
      title={"Final Diagnosis"}
      children={
        <div className="p-2">
          {data || <NoData content="No discharge diagnosis made" />}
        </div>
      }
    />
  );
}

export default DischargeDiagnosis;

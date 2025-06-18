import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  Form,
  Tabs,
  Input,
  Button,
  message,
  Divider,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { IoCalendarOutline } from "react-icons/io5";

import useAuth from "../../../hooks/useAuth";
import {
  postDischargeTCA,
  POST_DISCHARGE_TCA_RESET,
} from "../../../actions/Doc-actions/postDischargeTCA";
import { NoData } from "../../../components/NoData";

function AppointmentTCA({ currentInpatient }) {
  const items = [
    {
      key: "appointmentTCAForm",
      label: "Appointment TCA Form",
      children: <AppointmentTCAForm currentInpatient={currentInpatient} />,
    },
    {
      key: "appointmentCard",
      label: "Appointment TCA",
      children: <AppointmentTCACard currentInpatient={currentInpatient} />,
    },
  ];

  return <Tabs size="small" type="card" items={items} />;
}

function AppointmentTCAForm({ currentInpatient }) {
  const { Item: FormItem, useForm } = Form;
  const { TextArea } = Input;
  const [form] = useForm();

  console.log({ currentInpatient });

  const user = useAuth();
  const dispatch = useDispatch();
  const location = useLocation();

  const { doctorID } = user?.userData || {};
  const visitNo = new URLSearchParams(location.search).get("AdmNo");
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const {
    data: postDischargeTCAData,
    error: postDischargeTCAError,
    loading: postDischargeTCALoading,
  } = useSelector((state) => state.postDischargeTCA);

  useEffect(() => {
    if (postDischargeTCALoading) message.info("Posting the Appointment TCA");
    if (postDischargeTCAData?.status === "success") {
      form.resetFields();
      message.success("Appointment TCA posted successfully");
    }
    if (postDischargeTCAError) message.error(postDischargeTCAError);

    if (postDischargeTCAData?.status === "success" || postDischargeTCAError)
      dispatch({ type: POST_DISCHARGE_TCA_RESET });
  }, [postDischargeTCAData, postDischargeTCAError, postDischargeTCALoading]);

  function onFinish(values) {
    const { appointmentDate: date, remarks } = values;
    const appointmentDate = dayjs(date).format("YYYY-MM-DD");
    const data = { appointmentDate, remarks, doctorID, visitNo, patientNo };
    dispatch(postDischargeTCA(data));
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        remarks: currentInpatient?.Remarks || "",
        appointmentDate: currentInpatient?.NextAppointmentDate
          ? dayjs(Date(currentInpatient?.NextAppointmentDate))
          : undefined,
      }}
    >
      <FormItem
        name={"appointmentDate"}
        label={"Appointment Date"}
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: "100%" }} minDate={dayjs(new Date())} />
      </FormItem>
      <FormItem name={"remarks"} label={"Remarks"}>
        <TextArea
          placeholder="Remarks (Optional)"
          defaultValue={currentInpatient?.Remarks}
        />
      </FormItem>

      <Button htmlType="submit" type="primary">
        Submit
      </Button>
    </Form>
  );
}

function AppointmentTCACard({ currentInpatient }) {
  console.log({ currentInpatient });

  return currentInpatient?.NextAppointmentDate ? (
    <Card
      size="small"
      title={
        <div className="d-flex align-items-center gap-2">
          <IoCalendarOutline className="text-main-primary" />
          <Divider
            type="vertical"
            className="m-0 p-0"
            style={{ height: "16px" }}
          />
          <div style={{ fontWeight: "600" }} className="text-secondary">
            {currentInpatient?.NextAppointmentDate}
          </div>
        </div>
      }
      children={
        <div className="p-2">
          <p>{currentInpatient?.Remarks}</p>
        </div>
      }
    />
  ) : (
    <NoData content="No Appointment Made" />
  );
}

export default AppointmentTCA;

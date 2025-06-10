import { Button, DatePicker, Form, Space } from "antd";
import dayjs from "dayjs";

function AppointmentTCA() {
  const { Item: FormItem, useForm } = Form;
  const [form] = useForm();

  function onFinish(values) {
    const { date } = values;
    const dateString = dayjs(date).format("YYYY-MM-DD");

    console.log({ dateString });

    // TODO wait for the API so that you can continue
  }

  return (
    <Space className="d-grid gap-2">
      <h5 className="text-main-primary">Appointment &#40;To Come Again&#41;</h5>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <FormItem name={"date"} label={"Appointment Date"}>
          <DatePicker style={{ width: "320px" }} minDate={dayjs(new Date())} />
        </FormItem>
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </Space>
  );
}

export default AppointmentTCA;

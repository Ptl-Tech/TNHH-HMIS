import { useDispatch } from "react-redux";

import { Button, Form, Input, Space } from "antd";

import { saveDoctorNotes } from "../../../../actions/Doc-actions/saveDoctorNotes";

export const InputForm = ({ treatmentNo, formItem, setEditing }) => {
  const { Other_Specify, Item_ID, Section_ID, Category_ID } = formItem;

  console.log({ formItem });

  const dispatch = useDispatch();

  const FormItem = Form.Item;

  const onFinish = (values) => {
    const { other: textValue } = values;

    setEditing(false);
    dispatch(
      saveDoctorNotes({
        systemId: "",
        itemId: Item_ID,
        myAction: "edit",
        isSelected: true,
        sectionId: Section_ID,
        categoryId: Category_ID,
        encounterNo: treatmentNo,
        specifiedText: textValue,
      })
    );
  };

  return (
    <Form
      name="basic"
      variant={"filled"}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      initialValues={{ other: Other_Specify }}
    >
      <Space direction="vertical">
        <FormItem
          style={{ padding: 0, margin: 0 }}
          layout="vertical"
          label="Other (Specify Value)"
          name="other"
          rules={[
            {
              required: true,
              message: "Please input the other value",
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem label={null} style={{ padding: 0, margin: 0 }}>
          <Button htmlType="submit">Submit</Button>
        </FormItem>
      </Space>
    </Form>
  );
};

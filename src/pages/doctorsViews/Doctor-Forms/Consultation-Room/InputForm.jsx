import { useDispatch } from 'react-redux';

import { Button, Form, Input, Space } from 'antd';

import { saveDoctorNotes } from '../../../../actions/Doc-actions/saveDoctorNotes';

export const InputForm = ({ treatmentNo, formItem, setEditing }) => {
  const { Other_Specify, Item_ID } = formItem;
  const dispatch = useDispatch();

  const FormItem = Form.Item;

  const onFinish = (values) => {
    const { other: textValue, value } = values;

    setEditing(false);
    dispatch(
      saveDoctorNotes({
        myAction: 'edit',
        encounterNo: treatmentNo,
        itemId: value,
        isSelected: true,
        specifiedText: textValue,
      }),
    );
  };

  return (
    <Form
      name="basic"
      variant={'filled'}
      onFinish={onFinish}
      layout="vertical"
      autoComplete="off"
      initialValues={{ other: Other_Specify, value: Item_ID }}
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
              message: 'Please input the other value',
            },
          ]}
        >
          <Input />
        </FormItem>
        <FormItem
          label={null}
          name="value"
          style={{ height: 0, padding: 0, margin: 0 }}
        >
          <Input type={'hidden'} />
        </FormItem>
        <FormItem
          label={null}
          style={{ padding: 0, margin: 0 }}
        >
          <Button htmlType="submit">Submit</Button>
        </FormItem>
      </Space>
    </Form>
  );
};

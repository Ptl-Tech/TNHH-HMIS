import { Form, Input, InputNumber, Select } from "antd";

export const EditableCell = ({
  title,
  record,
  options,
  editing,
  children,
  inputType,
  dataIndex,
  placeholder,
  required = true,
  ...restProps
}) => {
  const { Item: FormItem } = Form;

  const inputNode =
    inputType === "number" ? (
      <InputNumber placeholder={placeholder} />
    ) : inputType === "select" ? (
      <Select options={options} placeholder={placeholder} />
    ) : (
      <Input placeholder={placeholder} />
    );

  return (
    <td {...restProps}>
      {editing ? (
        <FormItem
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: Boolean(required),
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </FormItem>
      ) : (
        children
      )}
    </td>
  );
};

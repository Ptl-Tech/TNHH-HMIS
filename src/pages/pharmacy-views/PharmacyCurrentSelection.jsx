import { Table } from 'antd';
import { EditableCell } from './PharmacyEditableCell';

export const PharmacyCurrentSelection = ({
  data,
  columns,
  summary,
  style = {},
  size = 'small',
}) => {
  return (
    <Table
      bordered
      size={size}
      style={style}
      loading={false}
      dataSource={data}
      columns={columns}
      components={{ body: { cell: EditableCell } }}
      summary={(pageData) => summary(pageData)}
    />
  );
};

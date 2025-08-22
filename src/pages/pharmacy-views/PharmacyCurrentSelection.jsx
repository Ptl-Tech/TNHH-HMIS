import { Space, Table } from "antd";

import { EditableCell } from "./PharmacyEditableCell";

export const PharmacyCurrentSelection = ({
  data,
  columns,
  style = {},
  size = "small",
  loading = false,
  pagination = false,
  summary = undefined,
}) => {

  return (
    <Space direction="vertical" className="d-grid">
      <Table
        bordered
        size={size}
        style={style}
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={pagination}
        components={{ body: { cell: EditableCell } }}
        summary={summary ? (pageData) => summary(pageData) : summary}
      />
    </Space>
  );
};

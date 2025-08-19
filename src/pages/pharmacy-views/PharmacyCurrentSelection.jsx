import { Space, Table, Typography } from "antd";

import { CiMedicalClipboard } from "react-icons/ci";
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
  const { Title } = Typography;

  return (
    <Space direction="vertical" className="d-grid">
      <Title
        level={5}
        className="d-flex align-items-center gap-2 m-0 text-main-primary"
      >
        <CiMedicalClipboard strokeWidth={1} />
        Selected Drugs
      </Title>
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

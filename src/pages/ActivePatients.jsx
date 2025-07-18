import { Table } from "antd";

export const ActivePatients = ({ loading, columns, dataSource }) => {
  return (
    <div>
      <Table
        size="medium"
        loading={loading}
        columns={columns}
        dataSource={(dataSource || []).toReversed()}
      />
      ;
    </div>
  );
};

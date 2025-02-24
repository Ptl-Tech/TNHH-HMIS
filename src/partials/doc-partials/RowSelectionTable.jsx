
import { Table } from "antd";
import PropTypes from "prop-types";

const RowSelectionTable = ({ columns, dataSource, tableProps }) => {

  return (
    <Table
      bordered
      size="small"
      columns={columns}
      dataSource={dataSource}
      pagination={{
        position: ["bottom", "right"],
        showSizeChanger: true,
        pageSize: 10,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      {...tableProps} // Spread additional table props
    />
  );
};

export default RowSelectionTable;
//props validation
RowSelectionTable.propTypes = {
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  onRowSelect: PropTypes.func,
  tableProps: PropTypes.object,
};

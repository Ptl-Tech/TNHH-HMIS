import { useState } from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

/**
 * Reusable RowSelection Component
 * @param {Array} columns - Table column definitions.
 * @param {Array} dataSource - Table data source.
 * @param {Function} onRowSelect - Callback when a row is selected.
 * @param {Object} tableProps - Additional Table props.
 */
const RowSelectionTable = ({ columns, dataSource, onRowSelect, tableProps }) => {
  const [selectedRow, setSelectedRow] = useState([]);

  const rowSelection = {
    type: "radio", // Use checkboxes for selection
    selectedRowKeys: selectedRow.length ? [selectedRow[0]?.key] : [],
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRows.length > 1) {
        const lastSelectedRow = selectedRows[selectedRows.length - 1];
        setSelectedRow([lastSelectedRow]);
        onRowSelect(lastSelectedRow); // Callback with the latest selected row
      } else {
        setSelectedRow(selectedRows);
        onRowSelect(selectedRows[0]);
      }
    },
  };

  return (
    <Table
      bordered
      size="small"
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
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

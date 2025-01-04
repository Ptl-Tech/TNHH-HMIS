import { useState } from "react";

const useSetTableCheckBoxHook = () => {

    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [selectedRow, setSelectedRow] = useState([]);
  
    const rowSelection = {
        selectedRowKeys: selectedRowKey ? [selectedRowKey] : [], // Controlled selection
        onChange: (selectedRowKeys, selectedRows) => {
          if (selectedRowKeys.length > 1) {
            setSelectedRowKey(selectedRowKeys[selectedRowKeys.length - 1]); // Keep the most recently selected row
            setSelectedRow([selectedRows[selectedRows.length - 1]]); // Update the selected row
          } else {
            setSelectedRowKey(selectedRowKeys[0]); // Update the selected row key
            setSelectedRow(selectedRows); // Update the selected row
          }
          setIsButtonDisabled(selectedRowKeys.length === 0); // Enable or disable buttons
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User', // Disable specific rows if needed
        }),
    };

    return {
        selectedRowKey,
        setSelectedRowKey,
        isButtonDisabled,
        setIsButtonDisabled,
        selectedRow,
        setSelectedRow,
        rowSelection,
    }
}

export default useSetTableCheckBoxHook
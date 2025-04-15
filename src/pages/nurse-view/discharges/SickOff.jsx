import { Button, Form } from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import SickOffTable from "../tables/nurse-tables/SickOffTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import useAuth from "../../../hooks/useAuth";
import SickOffFormData from "../nurse-forms/SickOffFormData";

const SickOff = () => {
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]);
  const role = useAuth().userData.departmentName;
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const [form] = Form.useForm();

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
      disabled: record.name === "Disabled User", // Disable specific rows if needed
    }),
  };

  const handleOnClick = () => {
    const record = selectedRow[0];
    console.log(record);
  };

  const handleButtonVisibility = () => {
    setIsViewing(false);
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div>
      <NurseInnerHeader icon={<UserAddOutlined />} title="Sick Off" />

      {!isFormVisible && role === "Doctor" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Button type="primary" onClick={handleButtonVisibility}>
            <PlusOutlined /> Add Sick Off
          </Button>
          <Button
            color="default"
            variant="outlined"
            disabled={!selectedRowKey}
            onClick={() => handleOnClick()}
          >
            <FolderViewOutlined />
            Print Sick Off
          </Button>
        </div>
      )}

      {isFormVisible && (
        <SickOffFormData
          setIsFormVisible={setIsFormVisible}
          form={form}
          isViewing={isViewing}
        />
      )}

      {!isFormVisible && (
        <SickOffTable rowSelection={rowSelection} form={form} />
      )}
    </div>
  );
};

export default SickOff;

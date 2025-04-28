import { Button, Form } from "antd";
import { PlusOutlined, UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import SickOffTable from "../tables/nurse-tables/SickOffTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import useAuth from "../../../hooks/useAuth";
import SickOffFormData from "../nurse-forms/SickOffFormData";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const SickOff = () => {
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedRow, setSelectedRow] = useState([]);
  const role = useAuth().userData.departmentName;
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const location = useLocation();
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");

  const [form] = Form.useForm();

  const { loading: loadingSickOff, data: getSickOff } = useSelector(
    (state) => state.getSickOff
  );

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
        </div>
      )}

      {isFormVisible && (
        <SickOffFormData
          setIsFormVisible={setIsFormVisible}
          form={form}
          isViewing={isViewing}
          admissionNo={admissionNo}
        />
      )}

      {!isFormVisible && (
        <SickOffTable
          rowSelection={rowSelection}
          form={form}
          loadingSickOff={loadingSickOff}
          getSickOff={getSickOff}
        />
      )}
    </div>
  );
};

export default SickOff;

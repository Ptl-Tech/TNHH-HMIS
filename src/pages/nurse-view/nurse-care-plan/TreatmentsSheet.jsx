import { Button } from "antd"
import { PlusOutlined, FileOutlined, RotateRightOutlined } from "@ant-design/icons";
import { useState } from "react";
import TreatmentSheetTable from "../tables/nurse-tables/TreatmentSheetTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";

const TreatmentsSheet = () => {
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

const handleSendToPharmacy = () => {
  const selectedRecord = selectedRow[0];
  console.log(selectedRecord);

}
const handleStopTreatment = () => {
    const selectedRecord = selectedRow[0];
    console.log(selectedRecord);
}

  return (
    <div>
         <NurseInnerHeader icon={<FileOutlined />} title="Treatments Sheet" />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px',  marginTop: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={()=>handleSendToPharmacy()}><PlusOutlined /> Send to Pharmacy</Button>
          <Button color="danger" variant="outlined" style={{ width: '100%' }} disabled={!selectedRowKey} onClick={()=>handleStopTreatment()}><RotateRightOutlined /> Stop Treatment</Button>
        </div>

        <TreatmentSheetTable  rowSelection={rowSelection} />

    </div>
  )
}

export default TreatmentsSheet
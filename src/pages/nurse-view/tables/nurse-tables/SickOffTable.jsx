import { Button, Table } from "antd";
import PropTypes from "prop-types";
import { PrinterOutlined } from "@ant-design/icons";

const SickOffTable = ({ rowSelection, loadingSickOff, getSickOff }) => {
  const columns = [
    {
      title: "Admission No",
      dataIndex: "Admission_No",
      key: "Admission_No",
    },
    {
      title: "Sick off Start Day",
      dataIndex: "Sick_Off_Start_Date",
      key: "Sick_Off_Start_Date",
    },
    {
      title: "Sick off No of Days",
      dataIndex: "Off_Duty_Days",
      key: "Off_Duty_Days",
    },
    {
      title: "Remarks",
      dataIndex: "Off_Duty_Comments",
      key: "Off_Duty_Comments",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          icon={<PrinterOutlined />}
          type="primary"
          // onClick={() => handlePrint(record)}
        >
          Print
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingTop: "10px" }}>
      <Table
        loading={loadingSickOff}
        columns={columns}
        dataSource={getSickOff}
        className="admit-patient-table"
        rowSelection={rowSelection}
      />
    </div>
  );
};

export default SickOffTable;

//props validation
SickOffTable.propTypes = {
  rowSelection: PropTypes.object,
  loadingSickOff: PropTypes.bool,
  getSickOff: PropTypes.array,
};

import { Button, Table } from "antd";
import PropTypes from "prop-types";
import { PrinterOutlined } from "@ant-design/icons";

const SickOffTable = ({
  rowSelection,
  loadingSickOff,
  getSickOff,
  admissionNo,
}) => {
  const isAdmission = !!admissionNo;

  const admissionColumns = [
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
        <Button icon={<PrinterOutlined />} type="primary">
          Print
        </Button>
      ),
    },
  ];

  const treatmentColumns = [
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Sick off Start Day",
      dataIndex: "SickOffStartDate",
      key: "SickOffStartDate",
    },
    {
      title: "Sick off No of Days",
      dataIndex: "OffDutyDays",
      key: "OffDutyDays",
    },
    {
      title: "Remarks",
      dataIndex: "OffDutyComments",
      key: "OffDutyComments",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button icon={<PrinterOutlined />} type="primary">
          Print
        </Button>
      ),
    },
  ];

  return (
    <div style={{ paddingTop: "10px" }}>
      <Table
        loading={loadingSickOff}
        columns={isAdmission ? admissionColumns : treatmentColumns}
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
  admissionNo: PropTypes.string,
};

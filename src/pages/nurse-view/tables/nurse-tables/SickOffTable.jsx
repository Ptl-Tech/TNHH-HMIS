import { Table } from "antd";
import PropTypes from "prop-types";

const SickOffTable = ({ rowSelection, loadingSickOff, getSickOff }) => {
  const columns = [
    {
      title: "Admission No",
      dataIndex: "admissionNo",
      key: "admissionNo",
    },
    {
      title: "Sick off Start Day",
      dataIndex: "sickOffStartDay",
      key: "sickOffStartDay",
    },
    {
      title: "Sick off No of Days",
      dataIndex: "sickOffDays",
      key: "sickOffDays",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <div style={{ paddingTop: "10px" }}>
      <Table
        loading={loadingSickOff}
        columns={columns}
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

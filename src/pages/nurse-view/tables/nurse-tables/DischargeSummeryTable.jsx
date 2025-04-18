import { Table } from "antd";
import PropTypes from "prop-types";

const DischargeSummeryTable = ({ summaryData, loadingGetDischargeSummary }) => {
  console.log("Summary Data:", summaryData);
  const columns = [
    {
      title: "Discharge Code",
      dataIndex: "Discharge_Code",
      key: "Discharge_Code",
    },
    {
      title: "Summary Type",
      dataIndex: "Type",
      key: "Type",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (text, record) => {
        return (
          <span
            style={{
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("Clicked on Action", record);
            }}
          >
            Remove
          </span>
        );
      },
    },
  ];

  return (
    <div style={{ paddingTop: "10px" }}>
      <Table
        columns={columns}
        size="small"
        bordered
        rowKey={(record) => record.SystemId}
        className="admit-patient-table"
        dataSource={summaryData}
        loading={loadingGetDischargeSummary}
      />
    </div>
  );
};

export default DischargeSummeryTable;
// props validation
DischargeSummeryTable.propTypes = {
  summaryData: PropTypes.array,
  loadingGetDischargeSummary: PropTypes.bool,
};

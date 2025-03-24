import { Button, Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const EncounterListTable = ({ filteredList, rowSelection }) => {
  const columns = [
    {
      title: "Encounter Date",
      dataIndex: "TreatmentDate",
      key: "TreatmentDate",
      fixed: "left",
      width: 150,
    },
    {
      title: "Treatment Number",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Primary Doctor",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
    },
    {
      title: "Patient Type",
      dataIndex: "TreatmentType",
      key: "TreatmentType",
    },
    {
      title: "Print Out",
      dataIndex: "PrintOut",
      key: "PrintOut",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button rel="noopener noreferrer" icon={<FilePdfOutlined />}>
          Discharge summary
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Table
        style={{ marginTop: "30px" }}
        rowKey={"TreatmentNo"}
        columns={columns}
        dataSource={filteredList}
        pagination={false}
        rowSelection={rowSelection}
      />
    </div>
  )
}

export default EncounterListTable
// props validation
EncounterListTable.propTypes = {
  filteredList: PropTypes.array,
  rowSelection: PropTypes.object
}
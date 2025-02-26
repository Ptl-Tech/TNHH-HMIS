import { Table } from "antd";

const BedTransferTable = () => {
  const columns = [
    {
        title: "Room",
        dataIndex: "Room",
        key: "Room",
    },
    {
      title: "Bed No",
      dataIndex: "Bed_No",
      key: "Bed_No",
    },
    {
      title: "Patient Name",
      dataIndex: "Patient_Name",
      key: "Patient_Name",
    },
    {
      title: "Admission Date",
      dataIndex: "Admission_Date",
      key: "Admission_Date",
    },
  ];
  const data = [];
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default BedTransferTable;

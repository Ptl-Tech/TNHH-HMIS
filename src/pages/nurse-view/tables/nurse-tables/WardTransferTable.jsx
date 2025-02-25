import { Table } from "antd";


const WardTransferTable = () => {
    const columns = [
        {
            title: "Ward Number",
            dataIndex: "Ward_Number",
            key: "Ward_Number",
        },
        {
          title: "Ward Name",
          dataIndex: "Ward_Name",
            key: "Ward_Name",
        },
        {
          title: "Action",
          dataIndex: "Action",
          key: "Action",
        },
      ];
      const data = [];
  return (
    <div>
    <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default WardTransferTable
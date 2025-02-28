import { Table } from "antd";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import BedsDrawer from "../../BedsDrawer";

const WardTransferTable = ({ getWards, loadingWards, currentWard }) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState();
  const [record, setRecord] = useState(null);

  console.log("wards", getWards);
  // remove the current ward from the ward list
  const filteredWards = useMemo(()=>{
    return getWards.filter((ward)=>(
        ward?.Ward_Code !== currentWard
    ))
  }, [getWards, currentWard])
  const showLargeDrawer = (record) => {
    setSize("large");
    setOpen(true);
    setRecord(record);
  };
  const onClose = () => {
    setRecord(null);
    setOpen(false);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Ward Number",
      dataIndex: "Ward_Code",
      key: "Ward_Code",
    },
    {
      title: "Ward Name",
      dataIndex: "Ward_Name",
      key: "Ward_Name",
      render: (text) => (
        <span
          style={{ fontSize: "14px", fontWeight: "bold", color: "#0f5689" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <button
            style={{
              backgroundColor: "#0f5689",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "none",
            }}
            onClick={() => showLargeDrawer(record)}
          >
            Select Ward
          </button>
        );
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        rowKey={() => Math.random().toString(36).substr(2, 9)}
        dataSource={filteredWards}
        size="small"
        pagination={false}
        bordered
        loading={loadingWards}
      />

      <BedsDrawer
        open={open}
        size={size}
        onClose={onClose}
        record={record}
        setOpen={setOpen}
      />
    </div>
  );
};

export default WardTransferTable;
// props validation
WardTransferTable.propTypes = {
  getWards: PropTypes.array,
  loadingWards: PropTypes.bool,
  currentWard: PropTypes.string,
};

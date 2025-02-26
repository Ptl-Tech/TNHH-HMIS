import {
  Button,
  Drawer,
  message,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPgBedsDetailsSlice } from "../../actions/nurse-actions/getPgBedsSlice";
import { SendOutlined, CloseOutlined } from "@ant-design/icons";
import { postReleaseBedSlice } from "../../actions/nurse-actions/postReleaseBedSlice";
import Loading from "../../partials/nurse-partials/Loading";
import useBedTransferHook from "../../hooks/useBedTransferHook";

const BedsDrawer = ({ open, onClose, size, record, setOpen }) => {
  console.log("record table", record);
  const dispatch = useDispatch();
  const { loadingBeds, loadingAdmittedPatients, combinedPatientsBed } =
    useBedTransferHook(record?.Ward_Code);

  const handleBedTransfer = (record) => {
    const result = dispatch(postReleaseBedSlice(record));
    if (result.type === "POST_RELEASE_BED_SUCCESS") {
      dispatch(getPgBedsDetailsSlice(record?.Ward));
      message.success("Patient transferred successfully");
      setOpen(false)
    } else {
      message.error("Failed to transfer patient");
      setOpen(false)
    }
  };

  useEffect(() => {
    dispatch(getPgBedsDetailsSlice(record?.Ward));
  }, [dispatch, record?.Ward]);

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Room",
      dataIndex: "Room_No",
      key: "Room_No",
    },
    {
      title: "Bed No",
      dataIndex: "BedNo",
      key: "BedNo",
    },
    {
      title: "Patient Name",
      dataIndex: "Patient_Name",
      key: "Patient_Name",
      render: (_, record) => {
        if (record?.Patient_Name && record?.Occupied === true) {
          return (
            <Typography.Text style={{ color: "#0f5689" }}>
              Blocked for: {record?.Patient_Name}
            </Typography.Text>
          );
        } else {
          return (
            <Tooltip title="Transfer patient to this bed">
              <Button
                icon={<SendOutlined />}
                onClick={() => handleBedTransfer(record)}
              >
                Transfer Patient
              </Button>
            </Tooltip>
          );
        }
      },
    },
    {
      title: "Admission Date",
      dataIndex: "Admission_Date",
      key: "Admission_Date",
      render: (_, record) => {
        if (record?.Admission_Date && record?.Occupied === true) {
          return record?.Admission_Date;
        } else {
          return (
            <Tooltip title="Transfer patient to this bed">
              <Button
                icon={<SendOutlined />}
                onClick={() => handleBedTransfer(record)}
              >
                Transfer Patient
              </Button>
            </Tooltip>
          );
        }
      },
    },
  ];
  return (
    <Drawer
      title={`Rooms and Beds for ${record?.Ward_Name} Ward`}
      placement="right"
      size={size}
      onClose={onClose}
      open={open}
      closable={false}
      maskClosable={false}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      }
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end", // Aligns to the left
            padding: "10px 16px",
          }}
        >
          <Button type="primary" icon={<CloseOutlined />} onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div>
        {loadingBeds || loadingAdmittedPatients ? (
          <Loading />
        ) : (
          <Table
            columns={columns}
            rowKey={() => Math.random().toString(36).substr(2, 9)}
            dataSource={combinedPatientsBed}
            size="small"
            bordered
          />
        )}
      </div>
    </Drawer>
  );
};

export default BedsDrawer;
// props validation
BedsDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  size: PropTypes.string,
  record: PropTypes.object,
  setOpen: PropTypes.bool,
};

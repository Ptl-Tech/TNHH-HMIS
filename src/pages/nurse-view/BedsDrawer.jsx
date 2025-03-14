import {
  Button,
  Drawer,
  message,
  Space,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPgBedsDetailsSlice } from "../../actions/nurse-actions/getPgBedsSlice";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import {
  getQyBedTransferLines,
  postBedTransferLineSlice,
} from "../../actions/nurse-actions/postReleaseBedSlice";
import Loading from "../../partials/nurse-partials/Loading";
import useBedTransferHook from "../../hooks/useBedTransferHook";
import BedTransferLinesTable from "./tables/nurse-tables/BedTransferLinesTable";
import { useLocation } from "react-router-dom";

const BedsDrawer = ({ open, onClose, size, record, setOpen }) => {
  const dispatch = useDispatch();
  const { loadingBeds, loadingAdmittedPatients, combinedPatientsBed } =
    useBedTransferHook(record?.Ward_Code);
  const [activeBedTab, setActiveBedTab] = useState("1");
  const location = useLocation();
  const patientDetail = location.state?.patientDetails || {};
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const { loading: loadingQyBedTransferLines, data: bedTransferLines } =
    useSelector((state) => state.getQyBedTransferLine);

  const handleBedTransfer = async (record) => {
    try {
      const bedTransferData = {
        myAction: "create",
        recId: "",
        admissionNo: patientDetail?.Admission_No,
        newWard: record?.WardNo,
        newBedNo: record?.BedNo,
        currentWard: patientDetail?.Ward,
        currentBedNo: patientDetail?.Bed,
      };

      // Dispatch bed transfer
      await dispatch(postBedTransferLineSlice(bedTransferData)).then((res) => {
        const { status, msg } = res?.payload || {};

        if (status === "success") {
          message.success(msg || "Successfully saved new bed transfer details");
          setActiveBedTab("2");
        } else {
          message.error(msg || "Failed to save bed transfer details");
        }
      });
    } catch (error) {
      message.error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    dispatch(getPgBedsDetailsSlice(record?.Ward));
  }, [dispatch, record?.Ward]);

  useEffect(() => {
    dispatch(getQyBedTransferLines(admissionNo));
  }, [dispatch, admissionNo]);

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
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => handleBedTransfer(record)}
              >
                Post this Bed
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
          return "-";
        }
      },
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: bedTransferLines?.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };
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
        <Tabs activeKey={activeBedTab} onChange={(key) => setActiveBedTab(key)}>
          <Tabs.TabPane tab="Assign New Ward and Bed" key="1">
            {loadingBeds || loadingAdmittedPatients ? (
              <Loading />
            ) : (
              <Table
                columns={columns}
                rowKey={() => Math.random().toString(36).substr(2, 9)}
                dataSource={combinedPatientsBed}
                size="small"
                bordered
                pagination={{
                  ...pagination,
                  total: bedTransferLines?.length,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: ["bottom", "right"],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  onChange: (page, pageSize) =>
                    handleTableChange({
                      current: page,
                      pageSize,
                      total: pagination.total,
                    }),
                  onShowSizeChange: (current, size) =>
                    handleTableChange({
                      current,
                      pageSize: size,
                      total: pagination.total,
                    }),
                }}
              />
            )}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Save New Ward and Bed" key="2">
            <BedTransferLinesTable
              bedTransferLines={bedTransferLines}
              loadingQyBedTransferLines={loadingQyBedTransferLines}
              patientNo={patientNo}
              dispatch={dispatch}
              setOpen={setOpen}
            />
          </Tabs.TabPane>
        </Tabs>
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

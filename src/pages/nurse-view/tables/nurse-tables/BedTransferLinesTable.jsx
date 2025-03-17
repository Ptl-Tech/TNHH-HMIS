import { Button, message, Table, Tag } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { SaveOutlined } from "@ant-design/icons";
import {
  postSaveBedTransferLineSlice,
} from "../../../../actions/nurse-actions/postReleaseBedSlice";
import { useSelector } from "react-redux";

const BedTransferLinesTable = ({
  bedTransferLines,
  loadingQyBedTransferLines,
  patientNo,
  dispatch,
  setOpen
}) => {
  const { loading: loadingPostTransferBed } = useSelector(
    (state) => state.postSaveBedTransfer
  );
  const handleBedTransfer = async (record) => {
    const bedTransferData = {
      myAction: "create",
      recId: record?.SystemId,
      admissionNo: record?.AdmissionNo,
      patientNo,
    };

    await dispatch(postSaveBedTransferLineSlice(bedTransferData)).then(
      (res) => {
        const { status, msg } = res?.payload || {};

        const messages = {
          success: msg || "Bed transfer successful",
          failed: msg || "Failed to transfer patient",
        };
        setOpen(false);
        message[status === "success" ? "success" : "error"](
          messages[status] || "Unexpected error, please try again"
        );
      }
    );
  };

  const columns = [
    {
      title: "AdmissionNo",
      dataIndex: "AdmissionNo",
      key: "AdmissionNo",
    },
    {
      title: "Current Bed No",
      dataIndex: "CurrentBedNo",
      key: "CurrentBedNo",
    },
    {
      title: "Current Ward No",
      dataIndex: "CurrentWard",
      key: "CurrentWard",
    },
    {
      title: "New Bed No",
      dataIndex: "NewBedNo",
      key: "NewBedNo",
    },
    {
      title: "New Ward No",
      dataIndex: "NewWard",
      key: "NewWard",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (_, record) => (
        <Tag color={record?.Posted ? "green" : "red"}>
          {record.Posted ? "Posted" : "New"}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            disabled={loadingPostTransferBed}
            onClick={() => handleBedTransfer(record)}
          >
            Transfer Bed
          </Button>
        );
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
    <Table
      columns={columns}
      rowKey={() => Math.random().toString(36).substr(2, 9)}
      loading={loadingQyBedTransferLines}
      dataSource={bedTransferLines}
      size="middle"
      scroll={{ x: "max-content" }}
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
  );
};

export default BedTransferLinesTable;
// prop types
BedTransferLinesTable.propTypes = {
  bedTransferLines: PropTypes.array,
  loadingQyBedTransferLines: PropTypes.bool,
  patientNo: PropTypes.string,
  dispatch: PropTypes.func,
  setOpen: PropTypes.bool
};

import { Button, Table, Tooltip, Typography } from "antd";
import PropTypes from "prop-types";
import { SaveOutlined } from "@ant-design/icons";
import Loading from "../../../../partials/nurse-partials/Loading";
import { useState } from "react";

const BedTransferTable = ({
  handleBedTransfer,
  combinedPatientsBed,
  loadingBeds,
  loadingAdmittedPatients,
  loadingBedTransferLines,
}) => {
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
            <Typography.Text style={{ color: "#b96000" }}>
              Blocked for: {record?.Patient_Name}
            </Typography.Text>
          );
        } else {
          return (
            <Tooltip title="Transfer patient to this bed">
              <Button
                type="primary"
                icon={<SaveOutlined />}
                disabled={loadingBedTransferLines}
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
          return new Date(record?.Admission_Date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
          );
        } else {
          return (
            // current date
            '-'
          );
        }
      },
    },
  ];
  const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: combinedPatientsBed?.length,
    });
  
    const handleTableChange = (newPagination) => {
      setPagination(newPagination); // Update pagination settings
    };
  return (
    <div>
      {loadingBeds || loadingAdmittedPatients ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          rowKey={(record, index) => index + 1}
          dataSource={combinedPatientsBed}
          size="small"
          bordered
          pagination={{
            ...pagination,
            total: combinedPatientsBed?.length,
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
    </div>
  );
};

export default BedTransferTable;
// props validation
BedTransferTable.propTypes = {
  handleBedTransfer: PropTypes.func,
  combinedPatientsBed: PropTypes.array,
  loadingBeds: PropTypes.bool,
  loadingAdmittedPatients: PropTypes.bool,
  loadingBedTransferLines: PropTypes.bool,
};

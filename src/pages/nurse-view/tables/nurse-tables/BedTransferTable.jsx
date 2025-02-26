import { Button, Table, Tooltip, Typography } from "antd";
import PropTypes from "prop-types";
import { SendOutlined } from "@ant-design/icons";
import Loading from "../../../../partials/nurse-partials/Loading";

const BedTransferTable = ({
  handleBedTransfer,
  combinedPatientsBed,
  loadingBeds,
  loadingAdmittedPatients,
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
  );
};

export default BedTransferTable;
// props validation
BedTransferTable.propTypes = {
  handleBedTransfer: PropTypes.func,
  combinedPatientsBed: PropTypes.array,
  loadingBeds: PropTypes.bool,
  loadingAdmittedPatients: PropTypes.bool,
};

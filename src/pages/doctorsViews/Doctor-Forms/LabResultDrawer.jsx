import { Button, Drawer, Space, Table } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { PrinterOutlined } from "@ant-design/icons";

const LabResultDrawer = ({
  open,
  onClose,
  size,
  record,
  handleViewResults,
  procedure
}) => {
  const [result, setResult] = useState([]);

  const columns = [
    {
      title: "Test Name",
      dataIndex: "TestName",
      key: "TestName",
    },
    {
      title: "Laboratory Number",
      dataIndex: "LaboratoryNumber",
      key: "LaboratoryNumber",
    },
    {
      title: "Test Code",
      dataIndex: "TestCode",
      key: "TestCode",
    },
    {
      title: "Result",
      dataIndex: "Result",
      key: "Result",
    },
  ];
  return (
    <Drawer
      title={`${procedure} Test Results for Patient ${record?.TreatmentNo}`}
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
          <Button type="primary" icon={<PrinterOutlined />} onClick={() => handleViewResults(record)}>
            Print Result
          </Button>
        </div>
      }
    >
      <Table columns={columns} dataSource={result} />
    </Drawer>
  );
};

export default LabResultDrawer;
// props validation
LabResultDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  size: PropTypes.string,
  record: PropTypes.object,
  handleViewResults: PropTypes.func,
  procedure: PropTypes.string,
};

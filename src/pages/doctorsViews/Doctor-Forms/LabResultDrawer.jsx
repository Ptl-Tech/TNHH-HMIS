import { Button, Drawer, Space } from "antd";
import PropTypes from "prop-types";
import { PrinterOutlined } from "@ant-design/icons";
import PDFViewer from "../../../components/PDFView";

const LabResultDrawer = ({
  open,
  onClose,
  size,
  record,
  handleViewResults,
  procedure,
  currentReportData
}) => {

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
      <PDFViewer base64String={currentReportData?.base64} height="100%"/>

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
  currentReportData: PropTypes.array,
};

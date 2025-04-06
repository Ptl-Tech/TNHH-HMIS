import React, { useEffect } from "react";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import { Skeleton, Button, Table, Modal } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import PrintReceipt from "./PrintReceipt";

const PatientReceiptLines = ({ activeVisitNo, onClose, visible }) => {
  const dispatch = useDispatch();
  const { loading: receiptLinesLoading, data: receiptLines } = useSelector(
    (state) => state.getReceiptLines
  );

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getReceiptLines(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const handlePrintReceipt = (receiptNo) => {
    console.log(`Print Receipt ${receiptNo}`);
    // Implement the print functionality here
  };

  const columns = [
    {
      title: "Receipt No",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Transaction Name",
      dataIndex: "TransactionName",
      key: "TransactionName",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render: (amount) => `KSh ${amount.toFixed(2)}`,
    },
    {
      title: "Pay Mode",
      dataIndex: "PayMode",
      key: "PayMode",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <PrintReceipt receiptNo={record.No} />
      ),
    },
  ];

  return (
    <Modal
      title="Receipt Lines"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 5, zIndex: 1000 }}
    >
      {receiptLinesLoading ? (
        <Skeleton active />
      ) : (
        <Table
          dataSource={receiptLines}
          columns={columns}
          size="small"
          bordered
          rowKey="SystemId"
          pagination={
            receiptLines.length > 10 ? { pageSize: 10 } : false
          } // Optional, if you don't want pagination
        />
      )}
    </Modal>
  );
};

export default PatientReceiptLines;

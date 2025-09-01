import React, { useEffect } from "react";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import { Skeleton, Button, Table, Modal, Drawer, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import PrintReceipt from "./PrintReceipt";
import { getReceiptPage } from "../../../actions/Charges-Actions/getReceiptPage";

const PatientReceiptLines = ({ activeVisitNo }) => {
  const dispatch = useDispatch();

  const { data: receiptHeader = [], loading } = useSelector(
    (state) => state.getReceiptPage
  );

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getReceiptPage(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const columns = [
    {
      title: "Receipt No",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Amount",
      dataIndex: "Total_Amount",
      key: "Total_Amount",
      render: (Total_Amount) => `KSh ${Total_Amount?.toFixed(2)}`,
    },
    {
      title: "Amount Paid",
      dataIndex: "Amount_Recieved",
      key: "Amount_Recieved",
      render: (Amount_Recieved) => `KSh ${Amount_Recieved?.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => <PrintReceipt receiptNo={record.No} />,
    },
  ];

  if (loading) return <Skeleton active />;

  return (
    <div className="mt-2">
    <Typography.Title level={5}>Receipts</Typography.Title>
    <Table
      bordered
      size="small"
      columns={columns}
      rowKey="SystemId"
      dataSource={receiptHeader.filter(({ Posted }) => Posted)}
      pagination={receiptHeader.length > 10 ? { pageSize: 10 } : false}
    />
    </div>
  );
};

export default PatientReceiptLines;

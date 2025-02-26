import React, { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { getReceiptHeader } from "../../actions/Charges-Actions/getReceiptHeader";
import { printReceipt } from "../../actions/Charges-Actions/printReceipt"; 
import { Table, Typography, Modal, Button } from "antd";
import PDFViewer from "../../components/PDFView";
import { IoPrintOutline } from "react-icons/io5";

const ViewReceipt = ({ visitNo, visible, onClose }) => {
  const dispatch = useDispatch();
  const { data: receiptHeader } = useSelector((state) => state.getReceiptHeaderLines);
  const [pdfBase64, setPdfBase64] = useState("");
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [loadingRow, setLoadingRow] = useState(null); // Track loading state per row

  useEffect(() => {
    if (visitNo) {
      dispatch(getReceiptHeader(visitNo));
    }
  }, [dispatch, visitNo]);

  const handlePrintReceipt = (record) => {
    setLoadingRow(record.No); // Set loading for the clicked row

    const invoiceData = {
      receiptNo: record.No,
    };

    dispatch(printReceipt(invoiceData)).then((response) => {
      setLoadingRow(null); // Reset loading after the action completes
      if (response?.data?.base64) {
        setPdfBase64(response.data.base64);
        setShowPDFModal(true);
      }
    }).catch(() => {
      setLoadingRow(null); // Reset on error
    });
  };

  const columns = [
    {
      title: "Receipt No",
      dataIndex: "No",
      key: "No",
      sorter: (a, b) => a.No - b.No,
      defaultSortOrder: "descend",
    },
    {
      title: "Received Amount",
      dataIndex: "Amount_Recieved",
      key: "Amount_Recieved",
      sorter: (a, b) => a.Amount_Recieved - b.Amount_Recieved,
    },
    {
      title: "Total Amount",
      dataIndex: "Total_Amount",
      key: "Total_Amount",
      sorter: (a, b) => a.Total_Amount - b.Total_Amount,
    },
    {
      title: "Payment Mode",
      dataIndex: "Pay_Mode",
      key: "Pay_Mode",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button 
          onClick={() => handlePrintReceipt(record)} 
          loading={loadingRow === record.No} 
          icon={<IoPrintOutline />}
        >
          Print Receipt
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Modal visible={visible} onCancel={onClose} style={{ top: 20 }} width={700}>
        <Typography.Title level={4}>Receipt Details</Typography.Title>
        <Table 
  dataSource={[...(receiptHeader || [])].sort((a, b) => b.No - a.No)} 
  columns={columns} 
  rowKey="No" 
/>
      </Modal>

      <Modal title="Receipt PDF" open={showPDFModal} onCancel={() => setShowPDFModal(false)} style={{ top: 2 }}>
        {pdfBase64 && <PDFViewer base64String={pdfBase64} />}
      </Modal>
    </div>
  );
};

export default ViewReceipt;

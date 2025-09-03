import {
  Badge,
  Button,
  Drawer,
  message,
  Modal,
  Spin,
  Table,
  Tabs,
  Typography,
} from "antd";
import React, { useEffect } from "react";
import PatientReceiptLines from "./PatientReceiptLines";
import PatientHeader from "../../reception-views/PatientHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  getInvoiceList,
  getUnpostedInvoiceList,
} from "../../../actions/Charges-Actions/getInvoiceList";
import { generateSHAInvoice } from "../../../actions/Charges-Actions/postGenerateInvoice";
import PrintReceipt from "./PrintReceipt";
import { getPastEncounterBillingList } from "../../../actions/Charges-Actions/getBillingList";
import {
  PrintFinalInvoice,
  PrintInterimInvoice,
} from "../InsurancePatients/InvoicePrinting";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { postsalesInvoice } from "../../../actions/Charges-Actions/postSalesInvoice";
import { SHAInvoicePrintout } from "../InsurancePatients/SHAInvoicePrintout";
import { render } from "@react-pdf/renderer";

export function GenerateSHAInvoice({ patientNo, activeVisitNo }) {
  const dispatch = useDispatch();
  const [modal, contextHolder] = Modal.useModal();
  const { loading } = useSelector((state) => state.generateSHAInvoice);

  const handleGenerateSHAInvoice = async () => {
    if (!patientNo || !activeVisitNo) {
      message.error("Patient number or visit number is missing.");
      return;
    }

    const payload = { patientNo, encounterNo: activeVisitNo };

    try {
      const response = await dispatch(generateSHAInvoice(payload));
      console.log("SHA Invoice response:", response);

      if (response?.status === 200) {
        message.success("SHA Invoice generated successfully");
        dispatch(getUnpostedInvoiceList(activeVisitNo));
      } else {
        // ✅ Handle backend error correctly
        message.error(
          response?.response?.data?.errors || "Failed to generate SHA Invoice"
        );
      }
    } catch (error) {
      console.error("Error generating SHA Invoice:", error);

      message.error(
        error.response?.data?.errors || // Backend errors
          error.response?.data?.message ||
          error.message ||
          "Unexpected error occurred"
      );
    }
  };

  const showConfirm = () => {
    modal.confirm({
      title: "Generate SHA Invoice",
      content:
        "Please confirm you have allocated SHA for this patient before generating the invoice.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: handleGenerateSHAInvoice,
    });
  };

  return (
    <>
      <Button
        size="middle"
        onClick={showConfirm}
        disabled={loading}
        loading={loading}
        block
      >
        Generate SHA Invoice
      </Button>

      {/* Must render this for modal to work */}
      {contextHolder}
    </>
  );
}
function FetchUnpostedInvoices({ patientNo, activeVisitNo }) {
  const dispatch = useDispatch();

  const { data: UnpostedInvoices = [], loading } = useSelector(
    (state) => state.getUnpostedInvoiceList
  );
  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getUnpostedInvoiceList(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const handlePostInvoice = async (record) => {
    const payload = {
      invoiceNo: record.No,
      patientNo: patientNo,
    };
    await dispatch(postsalesInvoice(payload))
      .then((status) => {
        message.success("Invoice posted successfully");
        dispatch(getUnpostedInvoiceList(activeVisitNo));
        dispatch(getPatientCharges(activeVisitNo));
        dispatch(getPastEncounterBillingList(activeVisitNo));
      })
      .catch((error) => {
        message.error("Failed to post invoice");
      });
  };
  const columns = [
    {
      title: "Invoice No",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Amount",
      dataIndex: "AmountIncludingVAT",
      key: "AmountIncludingVAT",
      render: (AmountIncludingVAT) => `KSh ${AmountIncludingVAT?.toFixed(2)}`,
    },
    {
      title: "Insurance",
      dataIndex: "SelltoCustomerName",
      key: "SelltoCustomerName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button onClick={() => handlePostInvoice(record)}>Post Invoice</Button>
      ),
    },
  ];

  return (
    <>
      <Table
        bordered
        size="small"
        columns={columns}
        rowKey="SystemId"
        dataSource={UnpostedInvoices}
        loading={loading}
        pagination={{ pageSize: 15 }}
      />
    </>
  );
}

function FetchCurrenEncounterPaymentDetails({ patientNo, activeVisitNo }) {
  const dispatch = useDispatch();
  const { loading, data } = useSelector(
    (state) => state.getPatientBillingHistory
  );
  const { receipts, salesInvoices } = data || {};
  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getPastEncounterBillingList(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const receiptColumns = [
    {
      title: "Receipt No",
      dataIndex: "receiptNo",
      key: "receiptNo",
      render: (text) => (
        <span style={{ fontWeight: "600", color: "#0f5689" }}>{text}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
     render: (text) => `KSh ${text?.toFixed(2)}`
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Transaction Code",
      dataIndex: "transactionCode",
      key: "transactionCode",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => <PrintReceipt receiptNo={record.receiptNo} />,
    },
  ];

  const invoiceColumns = [
    {
      title: "Invoice No",
      dataIndex: "invoiceNo",
      key: "invoiceNo",
      render: (text) => (
        <span style={{ fontWeight: "600", color: "#0f5689" }}>{text}</span>
      ),
    },
    {
      title: "Invoice Date",
      dataIndex: "invoiceDate",
      key: "invoiceDate",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
      title: "Insurance Name",
      dataIndex: "insuranceName",
      key: "insuranceName",
      render: (text) => text || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
     render: (text) => `KSh ${text?.toFixed(2)}`
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <SHAInvoicePrintout
          activeVisitNo={activeVisitNo}
          patientNo={patientNo}
        />
      ),
    },
  ];


  const PostedInvoices = salesInvoices?.map((invoice) => ({
    ...invoice,
    key: invoice.invoiceNo,
  }));

  return (
    <>
      <Typography.Title level={4}>Receipts</Typography.Title>
      <Table
        bordered
        size="small"
        columns={receiptColumns}
        rowKey="receiptNo"
        dataSource={receipts}
        loading={loading}
        pagination={{ pageSize: 15 }}
      />
      <Tabs defaultActiveKey="1" style={{ marginTop: 20 }}>
        <Tabs.TabPane
          key="1"
          tab={
            <span>
              Unposted Invoices <Badge
          count={useSelector((state) => state.getUnpostedInvoiceList.data?.length || 0)}
          offset={[8, -2]}
        />
            </span>
          }
        >
          <FetchUnpostedInvoices
            patientNo={patientNo}
            activeVisitNo={activeVisitNo}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>Posted Invoices <Badge count={PostedInvoices?.length} offset={[8, -2]} /></span>} key="2">
          <Table
            bordered
            size="small"
            columns={invoiceColumns}
            rowKey="invoiceNo"
            dataSource={PostedInvoices}
            loading={loading}
            pagination={{ pageSize: 15 }}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}


export function PaymentDetails({ patientNo, activeVisitNo, visible, onClose }) {
  return (
    <Drawer
      title="Payment Details"
      width={750}
      onClose={onClose}
      visible={visible}
      extra={
        <PrintInterimInvoice
          patientNo={patientNo}
          activeVisitNo={activeVisitNo}
        />
      }
    >
      <FetchCurrenEncounterPaymentDetails
        patientNo={patientNo}
        activeVisitNo={activeVisitNo}
      />
    </Drawer>
  );
}

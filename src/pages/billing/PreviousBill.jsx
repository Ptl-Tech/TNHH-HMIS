import React, { useEffect, useState, useMemo } from "react";
import { Button, Drawer, Table, Divider, Typography, Spin } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { MdAttachFile } from "react-icons/md";

import PrintReceipt from "./CashPatients/PrintReceipt";
import {
  PrintFinalInvoice,
  PrintInterimInvoice,
} from "./InsurancePatients/InvoicePrinting";
import {
  getBillingList,
  getPastEncounterBillingList,
  getPatientPastEncounterBilling,
} from "../../actions/Charges-Actions/getBillingList";
import { getPatientCharges } from "../../actions/Charges-Actions/getPatientCharges";
import { getReceiptPage } from "../../actions/Charges-Actions/getReceiptPage";

import PatientHeader from "../reception-views/PatientHeader";

const formatKES = (amount) => {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return "KES 0.00";
  return parsed.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  });
};

const PreviousBill = ({ visible, patientNo, onClose }) => {
  const dispatch = useDispatch();

  const { loading: encountersLoading, data: encountersData } = useSelector(
    (state) => state.getPatientPastEncounterBillingList
  );
  const { loading: billingListLoading, data: billingList } = useSelector(
    (state) => state.getBillingList
  );
  const { loading: patientBillingLoading, data: patientBilling } = useSelector(
    (state) => state.getPatientBillingHistory
  );

  const [encounterDrawerVisible, setEncounterDrawerVisible] = useState(false);
  const [activeVisitNo, setActiveVisitNo] = useState(null);

  const salesInvoices = patientBilling?.salesInvoices || [];
  const receipts = patientBilling?.receipts || [];

  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientPastEncounterBilling(patientNo));
      dispatch(getBillingList());
    } else {
      dispatch(getPatientPastEncounterBilling(null)); // Reset
    }
  }, [dispatch, patientNo]);

  const handleViewEncounter = (visitNo) => {
    setActiveVisitNo(visitNo);
    dispatch(getPatientCharges(visitNo));
    dispatch(getPastEncounterBillingList(visitNo));
    dispatch(getReceiptPage(visitNo));
    setEncounterDrawerVisible(true);
  };

  const enrichedEncounters = useMemo(() => {
    if (!Array.isArray(encountersData)) return [];
    return encountersData
      .map((item) => ({
        ...item,
        PatientType:
          billingList?.find((b) => b.PatientNo === item.Patient_No)?.PatientType || "N/A",
      }))
      .filter((item) => item.Visit_No?.trim())
      .reduce((acc, curr) => {
        acc.set(curr.Visit_No, curr);
        return acc;
      }, new Map());
  }, [encountersData, billingList]);

  const columns = [
    {
      title: "Encounter No",
      dataIndex: "Visit_No",
      key: "Visit_No",
      render: (text) => (
        <span style={{ fontWeight: "600", color: "#0f5689" }}>{text}</span>
      ),
    },

    // {
    //   title: "Patient Type",
    //   dataIndex: "PatientType",
    //   key: "PatientType",
    // },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleViewEncounter(record.Visit_No)}
          icon={<MdAttachFile size={21} />}
        >
          View Encounter
        </Button>
      ),
    },
  ];

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
      render: (text) => formatKES(text),
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
      dataIndex: "Insurance_Name",
      key: "Insurance_Name",
      render: (text) => text || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "Amount",
      key: "Amount",
      render: (text) => formatKES(text),
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <PrintFinalInvoice patientNo={patientNo} activeVisitNo={activeVisitNo} />
      ),
    },
  ];

  const normalizedReceipts = useMemo(
    () =>
      Array.isArray(receipts)
        ? receipts.map((r) => ({
            receiptNo: r.receiptNo || "N/A",
            receiptDate: r.receiptDate
              ? new Date(r.receiptDate).toLocaleDateString()
              : "N/A",
            amount: r.amount || 0,
            paymentMode: r.paymentMode || "N/A",
            transactionCode: r.transactionCode || "N/A",
          }))
        : [],
    [receipts]
  );

  const normalizedInvoices = useMemo(
    () =>
      Array.isArray(salesInvoices)
        ? salesInvoices.map((inv) => ({
            invoiceNo: inv.invoiceNo || "N/A",
            invoiceDate: inv.invoiceDate
              ? new Date(inv.invoiceDate).toLocaleDateString()
              : "N/A",
            Insurance_Name: inv.insuranceName || "N/A",
            Amount: inv.amount || 0,
          }))
        : [],
    [salesInvoices]
  );

  return (
    <>
      <Drawer
        placement="right"
        width={1200}
        onClose={onClose}
        open={visible}
        maskClosable={false}
        title={<h5 style={{ color: "#0f5689" }}>Previous Encounter Billing Details</h5>}
        extra={
          <Button onClick={onClose} icon={<CloseOutlined />} danger>
            Close
          </Button>
        }
      >
        <Spin spinning={encountersLoading || billingListLoading}>
          <Table
            columns={columns}
            dataSource={Array.from(enrichedEncounters.values())}
            rowKey="Visit_No"
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Drawer>

      <Drawer
        placement="right"
        width={1000}
        onClose={() => setEncounterDrawerVisible(false)}
        open={encounterDrawerVisible}
        maskClosable={false}
        title={
          <h4 style={{ color: "#0f5689" }}>
            Encounter Details - {activeVisitNo}
          </h4>
        }
        extra={
          <Button
            onClick={() => setEncounterDrawerVisible(false)}
            icon={<CloseOutlined />}
            danger
          >
            Close
          </Button>
        }
      >
        <PatientHeader activeVisitNo={activeVisitNo} patientNo={patientNo} />
        <div className="mt-3">
          <Typography.Title level={5}>List of Receipts</Typography.Title>
          <Spin spinning={patientBillingLoading}>
            <Table
              columns={receiptColumns}
              dataSource={normalizedReceipts}
              rowKey="receiptNo"
              pagination={{ pageSize: 12 }}
            />
          </Spin>

          <Divider />

          <Typography.Title level={5}>List of Invoices</Typography.Title>
          <Spin spinning={patientBillingLoading}>
            <Table
              columns={invoiceColumns}
              dataSource={normalizedInvoices}
              rowKey="invoiceNo"
              pagination={{ pageSize: 12 }}
            />
          </Spin>
        </div>
      </Drawer>
    </>
  );
};

export default PreviousBill;

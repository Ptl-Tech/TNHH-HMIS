import React, { useEffect, useState } from "react";
import { Button, Drawer, Table, Divider, Typography } from "antd";
import {CloseOutlined} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import PrintReceipt from "./CashPatients/PrintReceipt";
import {
  PrintFinalInvoice,
  PrintInterimInvoice,
} from "./InsurancePatients/InvoicePrinting";
import {
  getBillingList,
  getPatientPastEncounterBilling,
} from "../../actions/Charges-Actions/getBillingList";
import { getPatientCharges } from "../../actions/Charges-Actions/getPatientCharges";
import { getReceiptPage } from "../../actions/Charges-Actions/getReceiptPage";
import { render } from "@react-pdf/renderer";
import { MdAttachFile } from "react-icons/md";
import PatientInfo from "../nurse-view/nurse-patient-file/PatientInfo";
import useFetchPatientDetailsHook from "../../hooks/useFetchPatientDetailsHook";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import useFetchPatientVisitDetailsHook from "../../hooks/useFetchPatientVisitDetailsHook";
import PatientHeader from "../reception-views/PatientHeader";

const PreviousBill = ({ visible, patientNo, onClose  }) => {
  const dispatch = useDispatch();
console.log(patientNo);

  const { loading, data } = useSelector(
    (state) => state.getPatientPastEncounterBillingList
  );
  const { loading: billingLoading, patients: billingData } = useSelector(
    (state) => state.getBillingList
  );

  // 💡 Encounter view drawer state
  const [encounterDrawerVisible, setEncounterDrawerVisible] = useState(false);
  const [activeVisitNo, setActiveVisitNo] = useState(null);

  const { data: patientReceipts, loading: receiptLoading } = useSelector(
    (state) => state.getReceiptPage
  );

  const {
    loading: patientInvoicesLoading,
    error,
    data: patientInvoices,
  } = useSelector((state) => state.getPatientCharges);

   const { loadingPatientVisitDetails, patientVisitDetails } =
    useFetchPatientVisitDetailsHook(activeVisitNo);
  
  useEffect(() => {
    if (patientNo) {
      dispatch(getPatientPastEncounterBilling(patientNo));
      dispatch(getBillingList());
    }else{
    //reset state
      dispatch(getPatientPastEncounterBilling(null));
    }
  }, [dispatch, patientNo]);

  //ensure no empty or null dsata in receipts
  const receiptData = patientReceipts?.filter(
    (item) => item.No && item.No.trim() !== ""
  );

  const invoiceData = patientInvoices?.filter(
    (item) => item.Invoice_Number && item.Invoice_Number.trim() !== ""
  );

  // Open child drawer and fetch data
  const handleViewEncounter = (visitNo) => {
    setActiveVisitNo(visitNo);
    dispatch(getPatientCharges(visitNo));
    dispatch(getReceiptPage(visitNo));
    setEncounterDrawerVisible(true);
  };

  const enrichedEncounters =
    data?.map((item) => {
      const match = billingData?.find((b) => b.PatientNo === item.Patient_No);
      return {
        ...item,
        PatientType: match?.PatientType || "N/A",
      };
    }) || [];

  const uniqueEncounters = Array.from(
    new Map(
      enrichedEncounters
        .filter((item) => item.Visit_No && item.Visit_No.trim() !== "")
        .map((item) => [item.Visit_No, item])
    ).values()
  );

  const columns = [
    {
      title: "Encounter No",
      dataIndex: "Visit_No",
      key: "Visit_No",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
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
      dataIndex: "No",
      key: "No",
      sorter: (a, b) => a.No - b.No,
      //render in bold text
      render: (text) => (
        <span style={{ fontWeight: "semibold", color: "#0f5689" }}>{text}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "Total_Amount",
      key: "Total_Amount",
      render: (amt) => `KSh ${amt?.toFixed(2)}`,
    },
    {
      title: "Amount Paid",
      dataIndex: "Amount_Recieved",
      key: "Amount_Recieved",
      render: (amt) => `KSh ${amt?.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => <PrintReceipt receiptNo={record.No} />,
    },
  ];

  const invoiceColumns = [
    {
      title: "Invoice No",
      dataIndex: "Invoice_Number",
      key: "Invoice_Number",
      sorter: (a, b) => a.Invoice_Number - b.Invoice_Number,
      render: (text) => (
        <span style={{ fontWeight: "semibold", color: "#0f5689" }}>{text}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "Total_Amount",
      key: "Total_Amount",
      render: (amt) => `KSh ${amt?.toFixed(2)}`,
    },
    
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <PrintInterimInvoice
          patientNo={patientNo}
          activeVisitNo={activeVisitNo}
        />
      ),
    },
  ];

  return (
    <>
      <Drawer
        placement="right"
        width={1200}
        onClose={onClose}
        open={visible}
        maskClosable={false}
        title={
          <h5 style={{ color: "#0f5689" }}>
            Previous Encounter Billing Details
          </h5>
        }
        extra={<Button onClick={onClose} icon={<CloseOutlined />} danger>Close</Button>}

      >
        <Table
          columns={columns}
          dataSource={uniqueEncounters}
          loading={loading || billingLoading}
          rowKey="Visit_No"
          pagination={{ pageSize: 10 }}
        />
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
                extra={<Button onClick={() => setEncounterDrawerVisible(false)} icon={<CloseOutlined />} danger>Close</Button>}

      >
        <PatientHeader
            activeVisitNo={activeVisitNo}
            patientNo={patientNo}
          />
          <div className="mt-3">
<Typography.Title level={5}>List of Receipts</Typography.Title>
        <Table
          columns={receiptColumns}
          dataSource={receiptData}
          loading={receiptLoading}
          rowKey="No"
          pagination={{ pageSize: 12 }}
        />
        <Divider />
        <Typography.Title level={5}>List of Invoices</Typography.Title>
        <Table
          columns={invoiceColumns}
          dataSource={invoiceData}
          loading={patientInvoicesLoading}
          rowKey="Invoice_Number"
          pagination={{ pageSize: 12 }}
        />
          </div>
      </Drawer>
    </>
  );
};

export default PreviousBill;

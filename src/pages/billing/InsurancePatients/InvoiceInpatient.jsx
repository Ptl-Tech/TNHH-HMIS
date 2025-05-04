import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { Button, Dropdown, Card, Menu, message } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MoreOutlined,
  PrinterOutlined,
  WalletTwoTone,
  DollarOutlined,
} from "@ant-design/icons";
import useFetchPatientVisitDetailsHook from "../../../hooks/useFetchPatientVisitDetailsHook";
import SplitReceipt from "../SplitReceipt";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import { postReceipt } from "../../../actions/Charges-Actions/postReceipt";
import PatientCharges from "../CashPatients/PatientCharges";
import MpesaPayment from "../CashPatients/MpesaPayment";
import InsurancePaymentSection from "./InsurancePaymentSection";
import AllocateRebates from "../AllocateRebates";
import AllocateDiscount from "../AllocateDiscount";
import { PrintFinalInvoice, PrintInterimInvoice } from "./InvoicePrinting";
import { postGenerateInvoice } from "../../../actions/Charges-Actions/postGenerateInvoice";
import ReopenCharges from "./ReopenCharges";
import { postsalesInvoice } from "../../../actions/Charges-Actions/postSalesInvoice";
import ClosePatientBill from "../ClosePatientBill";
import SplitPayments from "../CashPatients/SplitPayments";
import PatientReceiptLines from "../CashPatients/PatientReceiptLines";
const InvoiceInpatient = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");
  const { loading, error, data } = useSelector(
    (state) => state.getPatientCharges
  );
  const {
    loading: generateInvoiceLoading,
    error: generateInvoiceError,
    data: generateInvoice,
  } = useSelector((state) => state.generateInvoice);
  const { loading: receiptLinesLoading, data: receiptLines } = useSelector(
    (state) => state.getReceiptLines
  );

  const { loadingPatientVisitDetails, patientVisitDetails } =
    useFetchPatientVisitDetailsHook(activeVisitNo);
  const {
    loading: patientBillLoading,
    error: patientBillError,
    data: patientBillData,
  } = useSelector((state) => state.getSingleBill);
  const { loading: postSalesInvoiceLoading } = useSelector(
    (state) => state.postSalesInvoice
  );

  //states
  const [RebatesModal, setRebatesModal] = useState(false);
  const [DiscountModal, setDiscountModal] = useState(false);
  const [splitAmountModal, setSplitAmountModal] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getSinglePatientBill(activeVisitNo));
      dispatch(getReceiptLines(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const handleCancel = () => {
    setRebatesModal(false);
    setDiscountModal(false);
    setSplitAmountModal(false);
  };
  const showReceiptModal = () => {
    setReceiptModalVisible(true);
  };
  const handlegenerateInvoice = async () => {
    const payload = {
      patientNo: patientBillData[0]?.PatientNo,
    };
    await dispatch(postGenerateInvoice(payload)).then((status) => {
      if (status) {
        message.success(`Invoice generated ${status}fully`, 5);
        dispatch(getPatientCharges(activeVisitNo));
      }
    });
  };

  const handlePaymentProcessing = async () => {
    if (!Array.isArray(data) || data.length === 0) {
      return;
    }

    const lastInvoice = data[data.length - 1];
    const payload = {
      patientNo: patientBillData[0]?.PatientNo,
      invoiceNo: lastInvoice?.Invoice_Number,
    };

    await dispatch(postsalesInvoice(payload)).then((status) => {
      // Assuming a successful post returns data; adjust the check per your API response.
      if (status && status == "success") {
        message.success("Invoice Posted successfully", 5);
        dispatch(getPatientCharges(activeVisitNo));
      }
    });
  };

  // Actions menu
  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === "rebates_action") {
          setRebatesModal(true); // Show receipt modal
        } else if (key === "discount_action") {
          setDiscountModal(true);
        } else if (key === "split_amount") {
          setSplitAmountModal(true);
        } else if (key === "receipt_action") {
          showReceiptModal();
        } else if (key === "visit_action") {
          // Handle other actions here
        }
      }}
    >
      <Menu.Item key="visit_action">
        <PrintFinalInvoice patientNo={patientBillData[0]?.PatientNo} />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="split_amount">Split Payment</Menu.Item>

      <Menu.Item key="rebates_action">Allocate SHIF Rebates</Menu.Item>
      <Menu.Item key="discount_action">Allocate Patient Discount</Menu.Item>
      <Menu.Item key="receipt_action">Receipt Lines</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="close_bill">
        <ClosePatientBill/>
      </Menu.Item>
      {/* <Menu.Item key="request_admission">Waive Charges</Menu.Item> */}
    </Menu>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Button
          type="link"
          onClick={() => navigate(-1)}
          icon={<ArrowLeftOutlined />}
        >
          Go back
        </Button>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button type="primary" icon={<MoreOutlined />}>
            <span className="ant-dropdown-link fw-bold">Actions</span>
          </Button>
        </Dropdown>
      </div>
      <div className="d-flex flex-column">
        <Card
          title={
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <UserOutlined />
                <span>Patient Details</span>
              </div>
            </div>
          }
          className="mb-3"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, auto)",
              gridTemplateRows: "auto auto", // Two rows
              gap: "12px 20px",
              fontSize: "14px",
              fontWeight: "400",
              color: "black",
              padding: "10px",
            }}
          >
            {/* First row */}
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
              Patient Name:{" "}
              <span className="fw-bold">{patientBillData[0]?.Names}</span>
            </p>
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
              Gender: {patientBillData[0]?.Gender}
            </p>
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
              Age in Years:{" "}
              {` (${Math.floor(
                (Date.now() -
                  new Date(patientBillData[0]?.DateOfBirth).getTime()) /
                  (1000 * 60 * 60 * 24 * 365.25)
              )} years)`}
            </p>
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
              Patient ID: <span className="fw-bold">{patientBillData[0]?.CurrentAdmNo}</span>
            </p>
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
                Visit Type: {patientBillData[0]?.Inpatient ? <span className="fw-bold">Inpatient</span> : <span className="fw-bold">Outpatient</span>}
              </p>

              {/* Second row */}
              <p className="mb-0" style={{ gridColumn: "span 2" }}>
                Payment Mode: {patientBillData[0]?.PatientType}
              </p>

            <p className="text-primary" style={{ gridColumn: "span 2" }}>
              <DollarOutlined /> Bill Balance: KSh{" "}
              {patientBillData[0]?.Balance?.toFixed(2) || "0.00"}
            </p>

            {/* Receipt no section */}
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
              Invoice No:{" "}
              <span style={{ fontWeight: "semibold", color: "blue" }}>
                {Array.isArray(data) && data.length > 0
                  ? data[data.length - 1].Invoice_Number
                  : "N/A"}
              </span>
            </p>
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
              Date:{" "}
              {Array.isArray(data) && data.length > 0
                ? new Date(data[data.length - 1].Date).toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "short", // Optional, for day of the week
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )
                : "N/A"}
            </p>
          </div>
        </Card>
        <div className="d-flex justify-content-end gap-3 my-3">
          <Button
            type="primary"
            onClick={handlegenerateInvoice}
            loading={generateInvoiceLoading}
            disabled={generateInvoiceLoading}
          >
            Generate Invoice
          </Button>
          <ReopenCharges
            patientNo={patientBillData[0]?.PatientNo}
            activeVisitNo={activeVisitNo}
          />
          <PrintInterimInvoice
            patientNo={patientBillData[0]?.PatientNo}
            activeVisitNo={activeVisitNo}
          />
        </div>
        <PatientCharges activeVisitNo={activeVisitNo} />
        <div className="row gap-3 gap-md-0">
          {/* Left Side (Split Receipt) */}
          <div className="col-12 col-md-8">
            <InsurancePaymentSection
              patientNo={patientBillData[0]?.PatientNo}
            />
          </div>

          {/* Right Side (Amount Details + Buttons) */}
          <div className="col-12 col-md-4">
            <Card className="shadow-sm p-3">
              <div className="d-flex flex-column gap-2">
                {/* <div className="d-flex justify-content-between">
                  <p className="fw-bold">Total Amount:</p>
                  <p>KSh {patientBillData[0]?.Balance?.toFixed(2) || "0.00"}</p>
                </div> */}
                {/* <div className="d-flex justify-content-between">
                  <p className="fw-bold">Amount  Paid:</p>
                  <p className="text-primary fw-semibold">
                    KSh{" "}
                    {Array.isArray(data) && data.length > 0
                      ? data[data.length - 1]?.Amount?.toFixed(2) || "0.00"
                      : "0.00"}
                  </p>{" "}
                </div> */}
                {/* <div className="d-flex justify-content-between">
                  <p className="fw-bold">Discount:</p>
                  <p>KSh {data?.Discount?.toFixed(2) || "0.00"}</p>
                </div> */}
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Balance:</p>
                  <p className="text-danger fw-semibold">
                    KSh {patientBillData[0]?.Balance?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button type="default" danger>
                  Discard
                </Button>
                <Button
                  type="primary"
                  onClick={handlePaymentProcessing}
                  loading={postSalesInvoiceLoading}
                  disabled={postSalesInvoiceLoading}
                >
                  Process Invoice
                </Button>
              </div>

              <AllocateRebates
                visible={RebatesModal}
                onClose={handleCancel}
                patientNo={patientBillData[0]?.PatientNo}
              />
              <AllocateDiscount
                visible={DiscountModal}
                onClose={handleCancel}
                patientNo={patientBillData[0]?.PatientNo}
              />
              <SplitPayments
                receiptNo={
                  Array.isArray(receiptLines) && receiptLines.length > 0
                    ? receiptLines[receiptLines.length - 1].No
                    : "N/A"
                }
                open={splitAmountModal}
                onCancel={handleCancel}
                activeVisitNo={activeVisitNo || ""}
                amount={patientBillData[0]?.Balance?.toFixed(2) || "0.00"}
              />
              <PatientReceiptLines
                activeVisitNo={activeVisitNo}
                visible={receiptModalVisible}
                onClose={() => setReceiptModalVisible(false)}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceInpatient;

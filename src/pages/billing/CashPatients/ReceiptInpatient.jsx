import React, { act, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { Button, Dropdown, Card, Menu } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MoreOutlined,
  PrinterOutlined,
  WalletTwoTone,
  DollarOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import useFetchPatientVisitDetailsHook from "../../../hooks/useFetchPatientVisitDetailsHook";
import PatientCharges from "./PatientCharges";
import SplitReceipt from "../SplitReceipt";
import PaymentSection from "./PaymentSection";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";
import MpesaPayment from "./MpesaPayment";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";
import { postReceipt } from "../../../actions/Charges-Actions/postReceipt";
import PatientReceiptLines from "./PatientReceiptLines";
import PrintReceipt from "./PrintReceipt";
import ClosePatientBill from "../ClosePatientBill";
import SplitPayments from "./SplitPayments";
import { getReceiptPage } from "../../../actions/Charges-Actions/getReceiptPage";
import InsurancePaymentSection from "../InsurancePatients/InsurancePaymentSection";
import { PrintInterimInvoice } from "../InsurancePatients/InvoicePrinting";
const ReceiptInpatient = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");

  const { loading, error, data } = useSelector(
    (state) => state.getPatientCharges
  );
  const { loading: receiptLinesLoading, data: receiptLines } = useSelector(
    (state) => state.getReceiptLines
  );
  const { data: receiptHeader } = useSelector((state) => state.getReceiptPage);

  const {
    loading: postReceiptLoading,
    error: postReceiptError,
    data: postReceiptData,
  } = useSelector((state) => state.processReceipt);

  // hooks
  const { loadingPatientVisitDetails, patientVisitDetails } =
    useFetchPatientVisitDetailsHook(activeVisitNo);
  const {
    loading: patientBillLoading,
    error: patientBillError,
    data: patientBillData,
  } = useSelector((state) => state.getSingleBill);

  //states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [splitAmountModal, setSplitAmountModal] = useState(false);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getSinglePatientBill(activeVisitNo));
      dispatch(getReceiptLines(activeVisitNo));
      dispatch(getReceiptPage(activeVisitNo));
    }
   
  }, [dispatch, activeVisitNo]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setReceiptModalVisible(false);
    setSplitAmountModal(false);
  };

  const showReceiptModal = () => {
    setReceiptModalVisible(true);
  };

  const InitiateSplitPayment = () => {
    setSplitAmountModal(true);
    //setreceiptNo("")
  };

  const handleBalanceCalculation = () => {
    if (!Array.isArray(receiptLines) || receiptLines.length === 0) {
      return;
    }

    const totalAmount = receiptLines.reduce((total, receipt) => {
      return total + receipt.Total_Amount;
    }, 0);

    return totalAmount;
  };

  const handlePaymentProcessing = async () => {

    if (!Array.isArray(receiptHeader) || receiptHeader.length === 0) {
      return;
    }

    const lastReceipt = receiptHeader[receiptHeader.length - 1];

    const payload = {
      recId: "",
      patientNo: patientBillData[0]?.PatientNo,
      receiptNo: lastReceipt?.No,
    };

    try {
      const status = await dispatch(postReceipt(payload));

      if (status === "success") {
        // setIsModalVisible(false);
        // Optionally refresh receiptLines
        dispatch(getReceiptLines(activeVisitNo));
        dispatch(getSinglePatientBill(activeVisitNo));
      }
    } catch (error) {
      message.error("Failed to post receipt. Please try again.");
    }
  };

  // Actions menu
  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === "visit_action") {
          showReceiptModal(); // Show receipt modal
        } else if (key === "split_amount") {
          InitiateSplitPayment();
        }
      }}
    >
      <Menu.Item key="visit_action">Show Receipt Details</Menu.Item>
      <Menu.Item key="split_amount">Split Payment</Menu.Item>
      <Menu.Item key="request_admission">Waive Charge</Menu.Item>
      <Menu.Divider />     
      <Menu.Item key="close_bill">
        <ClosePatientBill/>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
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
                <span className="fw-bold">
                  {patientBillData[0]?.Names}
                </span>
              </p>
              <p className="mb-0" style={{ gridColumn: "span 2" }}>
                Gender: {patientBillData[0]?.Gender}
              </p>
              <p className="mb-0" style={{ gridColumn: "span 2" }}>
                Age in Years:{" "}
                {` (${Math.floor(
                    (Date.now() - new Date(patientBillData[0]?.DateOfBirth
                    ).getTime()) /
                    (1000 * 60 * 60 * 24 * 365.25)
                    )} years)`}
              </p>
              <p className="mb-0" style={{ gridColumn: "span 2" }}>
                Patient ID: {patientBillData[0]?.PatientNo}
              </p>
              <p className="mb-0" style={{ gridColumn: "span 2" }}>
                Visit Type: {patientBillData[0]?.Inpatient ? "Inpatient" : "N/a"}
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
                Receipt No:
                <span style={{ fontWeight: "semibold", color: "blue" }}>
                  {" "}
                  {Array.isArray(receiptLines) && receiptLines.length > 0
                    ? receiptLines[receiptLines.length - 1].No
                    : "N/A"}
                </span>
              </p>
              {/* <p className="mb-0" style={{ gridColumn: "span 2" }}>
                Date:{" "}
                {Array.isArray(receiptLines) && receiptLines.length > 0
                  ? new Date(
                      receiptLines[receiptLines.length - 1].Date
                    ).toLocaleDateString("en-GB", {
                      weekday: "short", // Optional, for day of the week
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </p> */}
            </div>
          </Card>
          <div className="d-flex justify-content-end gap-3 my-3">
            <PrintReceipt
              receiptNo={
                Array.isArray(receiptLines) && receiptLines?.length > 0
                  ? receiptLines[receiptLines?.length - 1]?.No
                  : "N/A"
              }
            />
 <PrintInterimInvoice
            patientNo={patientBillData[0]?.PatientNo}
            activeVisitNo={activeVisitNo}
          />
            {/* <Button type="primary" icon={<WalletTwoTone />} iconPosition="end" onClick={() => setIsModalVisible(true)}>
            MPESA Payment
          </Button> */}
          </div>
          <PatientCharges activeVisitNo={activeVisitNo} />
          <div className="row gap-3 gap-md-0">
            {/* Left Side (Split Receipt) */}
            <div className="col-12 col-md-8">
              <InsurancePaymentSection patientNo={patientBillData[0]?.PatientNo} />
            </div>

            {/* Right Side (Amount Details + Buttons) */}
            <div className="col-12 col-md-4">
              <Card className="shadow-sm p-3">
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold">Amount to be Paid :</p>
                    <p className="text-danger fw-bold">
                      KSh {patientBillData[0]?.Balance?.toFixed(2) ?? "0.00"}
                    </p>
                  </div>

                  {/* <div className="d-flex justify-content-between">
                    <p className="fw-bold">Amount Received:</p>
                    <p className="text-success fw-bold">
                      KSh{" "}
                      {Array.isArray(receiptHeader) && receiptHeader.length > 0
                        ? receiptHeader[
                            receiptHeader.length - 1
                          ]?.Amount_Recieved?.toFixed(2) || "0.00"
                        : "0.00"}
                    </p>
                  </div> */}
                  {/* <div className="d-flex justify-content-between">
                    <p className="fw-bold">Discount:</p>
                    <p>KSh {patientBillData?.Discount?.toFixed(2) || "0.00"}</p>
                  </div> */}
                  {/* <div className="d-flex justify-content-between">
                    <p className="fw-bold">Balance:</p>
                    <p className="fw-bold  text-danger">
                      KSh{" "}
                      {Array.isArray(receiptHeader) && receiptHeader.length > 0
                        ? (
                            (receiptHeader[receiptHeader.length - 1]
                              ?.Total_Amount || 0) -
                            (receiptHeader[receiptHeader.length - 1]
                              ?.Amount_Recieved || 0)
                          ).toFixed(2)
                        : "0.00"}
                    </p>
                  </div> */}
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  {/* <Button type="default" danger>
                    Discard
                  </Button> */}
                  <Button
                    type="primary"
                    onClick={handlePaymentProcessing}
                    disabled={postReceiptLoading}
                    loading={postReceiptLoading}
                    block
                  >
                    Post Receipt
                  </Button>
                </div>
                <MpesaPayment
                  visible={isModalVisible}
                  onClose={handleCancel}
                  activeVisitNo={activeVisitNo}
                />
                <PatientReceiptLines
                  activeVisitNo={activeVisitNo}
                  visible={receiptModalVisible}
                  onClose={handleCancel}
                />
                <SplitPayments
                  receiptNo={
                    Array.isArray(receiptHeader) && receiptHeader.length > 0
                      ? receiptHeader[receiptHeader.length - 1].No
                      : "N/A"
                  }
                  open={splitAmountModal}
                  onCancel={handleCancel}
                  activeVisitNo={activeVisitNo || ""}
                  amount={patientBillData[0]?.Balance?.toFixed(2) || "0.00"}
                  patientNo={patientBillData[0]?.PatientNo}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReceiptInpatient;

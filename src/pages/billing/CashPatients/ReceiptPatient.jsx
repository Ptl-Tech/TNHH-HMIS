import React, { useEffect, useState } from "react";
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
const ReceiptPatient = () => {
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

  const handlePaymentProcessing = async () => {
    if (!Array.isArray(receiptLines) || receiptLines.length === 0) {
      return;
    }

    const lastReceipt = receiptLines[receiptLines.length - 1];

    const payload = {
      recId: "",
      patientNo: patientVisitDetails?.PatientNo,
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
      console.error("Error processing receipt:", error);
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

      <Menu.Divider />
      <Menu.Item key="request_admission">Waive Charge</Menu.Item>
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
              <ClosePatientBill />
            </div>
          }
          className="mb-3"
        ><div
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
            {patientVisitDetails?.SearchNames.toUpperCase()}
          </span>
        </p>
        <p className="mb-0" style={{ gridColumn: "span 2" }}>
          Gender: {patientVisitDetails?.Gender}
        </p>
        <p className="mb-0" style={{ gridColumn: "span 2" }}>
          Age in Years: {patientVisitDetails?.AgeinYears}
        </p>
        <p className="mb-0" style={{ gridColumn: "span 2" }}>
          Patient ID: {patientVisitDetails?.PatientNo}
        </p>
        <p className="mb-0" style={{ gridColumn: "span 2" }}>
          Visit Type: {patientVisitDetails?.AppointmentType}
        </p>

        {/* Second row */}
        <p className="mb-0" style={{ gridColumn: "span 2" }}>
          Payment Mode: {patientVisitDetails?.SettlementType}
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
        <p className="mb-0" style={{ gridColumn: "span 2" }}>
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
        </p>
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

          {/* <Button type="primary" icon={<WalletTwoTone />} iconPosition="end" onClick={() => setIsModalVisible(true)}>
            MPESA Payment
          </Button> */}
        </div>
        {/* <PatientCharges activeVisitNo={activeVisitNo} /> */}
        <div className="row gap-3 gap-md-0">
          {/* Left Side (Split Receipt) */}
          <div className="col-12 col-md-8">
            <PaymentSection patientNo={patientVisitDetails?.PatientNo} />
          </div>

          {/* Right Side (Amount Details + Buttons) */}
           <div className="col-12 col-md-4">
            <Card className="shadow-sm p-3">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Total Amount Paid :</p>
                  <p>
                    KSh{" "}
                    {Array.isArray(receiptHeader) && receiptHeader.length > 0
                      ? receiptHeader[
                          receiptHeader.length - 1
                        ]?.Total_Amount?.toFixed(2) || "0.00"
                      : "0.00"}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Amount Received:</p>
                  <p className="text-success fw-bold">
                    KSh{" "}
                    {Array.isArray(receiptHeader) && receiptHeader.length > 0
                      ? receiptHeader[
                          receiptHeader.length - 1
                        ]?.Amount_Recieved?.toFixed(2) || "0.00"
                      : "0.00"}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Discount:</p>
                  <p>KSh {patientBillData?.Discount?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Balance:</p>
                  <p className="text-danger">
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
                  disabled={postReceiptLoading}
                  loading={postReceiptLoading}
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
                  Array.isArray(receiptLines) && receiptLines.length > 0
                    ? receiptLines[receiptLines.length - 1].No
                    : "N/A"
                }
                open={splitAmountModal}
                onCancel={handleCancel}
                activeVisitNo={activeVisitNo || ""}
                amount={patientBillData[0]?.Balance?.toFixed(2) || "0.00"}
              />
            </Card>
          </div> 
        </div>
      </div>
    </div>
   </>
  );
};

export default ReceiptPatient;
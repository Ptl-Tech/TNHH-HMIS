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
const InvoicePatient = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");
  const { loading, error, data } = useSelector(
    (state) => state.getPatientCharges
  );
  const { loading: generateInvoiceLoading, error: generateInvoiceError, data : generateInvoice } = useSelector(
    (state) => state.generateInvoice
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
  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getSinglePatientBill(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);

  const handleCancel = () => {
    setRebatesModal(false);
    setDiscountModal(false);
  };

  const handlegenerateInvoice = async () => {
    const payload = {
      patientNo: patientVisitDetails?.PatientNo,
    };
    await dispatch(postGenerateInvoice(payload)).then((status) => {
      if (status) {
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
      patientNo: patientVisitDetails?.PatientNo,
      invoiceNo: lastInvoice?.Invoice_Number,
    };

    await dispatch(postsalesInvoice(payload)).then((status) => {
      // Assuming a successful post returns data; adjust the check per your API response.
      if (status && status == "success") {
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
        }
      }}
    >
      <Menu.Item key="visit_action">
        <PrintFinalInvoice patientNo={patientVisitDetails?.PatientNo} />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="rebates_action">Allocate SHIF Rebates</Menu.Item>
      <Menu.Item key="discount_action">Allocate Patient Discount</Menu.Item>

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
            <div className="d-flex align-items-center gap-2">
              <UserOutlined />
              <span>Patient Details</span>
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
              Patient Name: {patientVisitDetails?.SearchNames}
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
              Invoice No:              <span style={{ fontWeight: "semibold", color: "blue" }}>
              {Array.isArray(data) && data.length > 0
                  ? data[data.length - 1].Invoice_Number
                  : "N/A"}
                                </span>

            </p>
            <p className="mb-0" style={{ gridColumn: "span 2" }}>
              Date:{" "}{Array.isArray(data) && data.length > 0
                ? new Date(
                    data[data.length - 1].Date
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
          <Button type="primary" onClick={handlegenerateInvoice} loading={generateInvoiceLoading} disabled={generateInvoiceLoading}>Generate Invoice</Button>
          <ReopenCharges patientNo={patientVisitDetails?.PatientNo} activeVisitNo={activeVisitNo} />
          <PrintInterimInvoice
            patientNo={patientVisitDetails?.PatientNo}
            activeVisitNo={activeVisitNo}
          />
        </div>
        <PatientCharges activeVisitNo={activeVisitNo} />
        <div className="row gap-3 gap-md-0">
          {/* Left Side (Split Receipt) */}
          <div className="col-12 col-md-8">
            <InsurancePaymentSection
              patientNo={patientVisitDetails?.PatientNo}
            />
          </div>

          {/* Right Side (Amount Details + Buttons) */}
          <div className="col-12 col-md-4">
            <Card className="shadow-sm p-3">
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Total Amount:</p>
                  <p>KSh {patientBillData[0]?.Balance?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Total Paid:</p>
                  <p className="text-success fw-bold">
                    KSh{" "}
                    {Array.isArray(data) && data.length > 0
                      ? data[data.length - 1]?.Amount?.toFixed(
                          2
                        ) || "0.00"
                      : "0.00"}
                  </p>                </div>
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Discount:</p>
                  <p>KSh {data?.Discount?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Balance:</p>
                  <p className="text-danger">
                    KSh {data?.Balance?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button type="default" danger>
                  Discard
                </Button>
                <Button type="primary" onClick={handlePaymentProcessing} loading={postSalesInvoiceLoading} disabled={postSalesInvoiceLoading}>
                  Process Invoice
                </Button>
              </div>

              <AllocateRebates
                visible={RebatesModal}
                onClose={handleCancel}
                patientNo={patientVisitDetails?.PatientNo}
              />
              <AllocateDiscount
                visible={DiscountModal}
                onClose={handleCancel}
                patientNo={patientVisitDetails?.PatientNo}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePatient;

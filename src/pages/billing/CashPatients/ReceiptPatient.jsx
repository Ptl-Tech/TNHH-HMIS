import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { Button, Dropdown, Card, Menu } from "antd";
import {
  ArrowLeftOutlined,
  UserOutlined,
  MoreOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import useFetchPatientVisitDetailsHook from "../../../hooks/useFetchPatientVisitDetailsHook";
import PatientCharges from "./PatientCharges";
import SplitReceipt from "../SplitReceipt";
const ReceiptPatient = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");
  const { loading, error, data } = useSelector(
    (state) => state.getPatientCharges
  );

  const { loadingPatientVisitDetails, patientVisitDetails } =
    useFetchPatientVisitDetailsHook(activeVisitNo);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getPatientCharges(activeVisitNo));
    }
  }, [dispatch, activeVisitNo]);
  console.log(patientVisitDetails);
// Actions menu
  const menu = (
    <Menu onClick={({ key }) => key === "visit_action" && setView(true)}>
      <Menu.Item key="visit_action">
        {/* {activeVisitNo ? "View Visit Details" : "Create Visit"} */}
        Show Receipt Details
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="request_admission" ghost > Waive Charge</Menu.Item>
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
          <Button type="dashed"  icon={<MoreOutlined />}>
            <span className="ant-dropdown-link fw-bold">Actions</span>
          </Button>
        </Dropdown>
      </div>
      <div className="d-flex flex-column">
        <Card title="Patient Information" className="mb-3">
          <div className="d-flex flex-column  mb-3 ">
            <UserOutlined className="me-2 fs-3 " />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, auto)",
                gap: "12px 20px",
                fontSize: "14px",
                fontWeight: "400",
                color: "black",
                padding: "10px",
              }}
            >
              <p className="mb-0">
                Patient Name: {patientVisitDetails?.SearchNames}
              </p>
              <p className="mb-0">Gender: {patientVisitDetails?.Gender}</p>
              <p className="mb-0">
                Age in Years: {patientVisitDetails?.AgeinYears}
              </p>
              <p className="mb-0">
                Patient ID:{patientVisitDetails?.PatientNo}
              </p>
              <p className="mb-0">
                Visit Type: {patientVisitDetails?.AppointmentType}
              </p>
              <p className="mb-0">
                Payment Mode: {patientVisitDetails?.SettlementType}
              </p>
              <p className="mb-0">
                Billing Point: {patientVisitDetails?.WaitingAt}
              </p>
            </div>
          </div>
        </Card>
        <div className="d-flex justify-content-end gap-3 my-3">
        <Button type="primary">Initiate Payment</Button>
        <Button type="default" icon={<PrinterOutlined />}>Print Bill</Button>
      </div>
        <PatientCharges activeVisitNo={activeVisitNo} />
        <div className="row">
        {/* Left Side (Split Receipt) */}
        <div className="col-12 col-md-7">
          <SplitReceipt />
        </div>

        {/* Right Side (Amount Details + Buttons) */}
        <div className="col-12 col-md-5">
          <Card className="shadow-sm p-3">
            <div className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between">
                <p className="fw-bold">Total Amount:</p>
                <p>KSh {data?.TotalAmount?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="fw-bold">Total Paid:</p>
                <p>KSh {data?.TotalPaid?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="fw-bold">Discount:</p>
                <p>KSh {data?.Discount?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="d-flex justify-content-between">
                <p className="fw-bold">Balance:</p>
                <p className="text-danger">KSh {data?.Balance?.toFixed(2) || "0.00"}</p>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button type="default" danger>Discard</Button>
              <Button type="primary">Process Payment</Button>
            </div>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ReceiptPatient;

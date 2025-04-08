import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appmntList } from "../../actions/patientActions";
import { getBillingList } from "../../actions/Charges-Actions/getBillingList";
import {
  Tabs,
  Table,
  Button,
  Input,
  Row,
  Col,
  Typography,
  Space,
  Menu,
  Dropdown,
} from "antd";
import { EyeOutlined, DollarOutlined } from "@ant-design/icons";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import ProcessPayment from "./ProcessPayment";
import AddCharges from "./AddCharges";
import useAuth from "../../hooks/useAuth";
import InpatientCash from "./InpatientCash";
import InpatientCorporate from "./InpatientCorporate";

const { TabPane } = Tabs;

const ActiveInpatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const staffNo = useAuth().userData.no;

  // Redux state data
  const { loading, patients: visitData } = useSelector(
    (state) => state.appmntList
  );
  const { patients: billingData } = useSelector(
    (state) => state.getBillingList
  );

  // Local state
  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [selectedPatientAmount, setSelectedPatientAmount] = useState("");

  // Lists for cash & corporate patients
  const [cashPatients, setCashPatients] = useState([]);
  const [corporatePatients, setCorporatePatients] = useState([]);
  const [filteredCashPatients, setFilteredCashPatients] = useState([]);
  const [filteredCorporatePatients, setFilteredCorporatePatients] = useState(
    []
  );

  const [activeComponent, setActiveComponent] = useState("cash"); // Default to cash patients

  // Modals
  const [isGenerateReceiptModalVisible, setIsGenerateReceiptModalVisible] =
    useState(false);
  const [addChargeModal, setAddChargeModal] = useState(false);

  // To update patient balance in the list when new charges are added
  const [updatedAmounts, setUpdatedAmounts] = useState({});

  // Track which tab is active: "1" for Cash, "2" for Corporate
  const [activeTab, setActiveTab] = useState("1");

  // For cash patients, we allow row selection to display external actions.
  const [patientNo, setPatientNo] = useState(null);
  const [visitNo, setVisitNo] = useState(null);
  useEffect(() => {
    dispatch(appmntList());
    dispatch(getBillingList());
  }, [dispatch]);

  useEffect(() => {
    if (visitData && billingData) {
      const formattedBillingList = visitData.map((patient) => {
        const matchingPatient = billingData.find(
          (p) => p.PatientNo === patient.PatientNo
        );
        return {
          ...patient,
          Balance: matchingPatient?.Balance || 0,
          OpenInsuranceBalance: matchingPatient?.Open_Insurance_Amount || 0,
          Inpatient: matchingPatient?.Inpatient,
        };
      });

      const sortedList = formattedBillingList.sort(
        (a, b) => new Date(b.AppointmentDate) - new Date(a.AppointmentDate)
      );

      const cash = sortedList.filter(
        (patient) =>
          patient.PatientType === "Cash" && patient.Inpatient === false
      );
      const corporate = sortedList.filter(
        (patient) =>
          patient.PatientType === "Corporate" && patient.Inpatient === false
      );

      setCashPatients(cash);
      setCorporatePatients(corporate);

      setFilteredCashPatients(cash);
      setFilteredCorporatePatients(corporate);
    }
  }, [visitData, billingData]);

  const handleSearch = (e, field) => {
    const value = e.target.value.toLowerCase();
    const updatedSearchParams = { ...searchParams, [field]: value };
    setSearchParams(updatedSearchParams);

    const filteredCash = cashPatients.filter(
      (patient) =>
        (!updatedSearchParams.SearchNames ||
          patient.Names.toLowerCase().includes(
            updatedSearchParams.SearchNames
          )) &&
        (!updatedSearchParams.AppointmentNo ||
          patient.AppointmentNo.toLowerCase().includes(
            updatedSearchParams.AppointmentNo
          ))
    );

    const filteredCorporate = corporatePatients.filter(
      (patient) =>
        (!updatedSearchParams.SearchNames ||
          patient.Names.toLowerCase().includes(
            updatedSearchParams.SearchNames
          )) &&
        (!updatedSearchParams.AppointmentNo ||
          patient.AppointmentNo.toLowerCase().includes(
            updatedSearchParams.AppointmentNo
          ))
    );

    setFilteredCashPatients(filteredCash);
    setFilteredCorporatePatients(filteredCorporate);
  };

  const handleClose = () => {
    setIsGenerateReceiptModalVisible(false);
    setAddChargeModal(false);
  };

  const showPaymentModal = (record) => {
    // Always use the record's current or updated balance
    const currentBalance =
      updatedAmounts[record.AppointmentNo] !== undefined
        ? updatedAmounts[record.AppointmentNo]
        : record.Balance;
    setSelectedPatientAmount(currentBalance);
    setIsGenerateReceiptModalVisible(true);
  };

  const showAddChargesModal = (record) => {
    setAddChargeModal(true);
    setPatientNo(record.PatientNo);
    setVisitNo(record.AppointmentNo);
  };

  const handleBalanceUpdate = (patientNo, newBalance) => {
    setUpdatedAmounts((prev) => ({
      ...prev,
      [patientNo]: newBalance,
    }));
  };

  const handleViewPatientReceips = (record) => {
    navigate(
      `/Reception/Patient-Receipts/Patient?VisitNo=${record?.AppointmentNo}`
    );
  };

  const menu = (record) => (
    <Menu>
      <Menu.Item key="1">
        {activeTab === "2" && (
          <Button
            type="ghost"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(
                `/Reception/invoice/Patient?PatientNo=${record.PatientNo}`,
                {
                  state: { patientData: record },
                }
              )
            }
          >
            View
          </Button>
        )}
      </Menu.Item>
      <Menu.Item key="2">
        <Button type="ghost" onClick={() => showAddChargesModal(record)}>
          <FaFileInvoice /> Add Charges
        </Button>
      </Menu.Item>
      {activeTab === "1" && (
        <>
          <Menu.Item key="3">
            <Button type="ghost" onClick={() => showPaymentModal(record)}>
              <DollarOutlined /> Make Payment
            </Button>
          </Menu.Item>
          <Menu.Item key="4">
            <Button
              type="ghost"
              onClick={() => handleViewPatientReceips(record)}
            >
              <FaEye /> View
            </Button>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const baseColumns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "brown" }}>{text}</span>
      ),
    },
    {
      title: "Patient Name",
      dataIndex: "Names",
      key: "Names",
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
      render: (text) => (
        <span style={{ fontWeight: "bold", color: "blue" }}>{text}</span>
      ),
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Appointment Date",
      dataIndex: "AppointmentDate",
      key: "AppointmentDate",
      render: (text) => {
        const date = new Date(text);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      },
    },
    {
      title: "Appointment Time",
      dataIndex: "AppointmentTime",
      key: "AppointmentTime",
      render: (text, record) => {
        const dateTimeString = `${record.AppointmentDate}T${record.AppointmentTime}`;
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      key: "Balance",
      sorter: (a, b) => a.Balance - b.Balance,
      render: (text, record) => {
        const newBalance = updatedAmounts[record.AppointmentNo] ?? text;
        const balanceColor =
          newBalance === 0 ? "green" : newBalance !== text ? "red" : "black";
        return (
          <span style={{ fontWeight: "bold", color: balanceColor }}>
            KSh {newBalance.toFixed(2)}
          </span>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Dropdown overlay={menu(record)} trigger={["click"]}>
            <Button
              style={{ color: "#0f5689", fontSize: "16px", fontWeight: "bold" }}
            >
              ...
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h4 className="text-center p-3 text-dark">Inpatient Billing List</h4>
   
      <div className="d-flex flex-row gap-2 my-3">
        <Button
          type={activeComponent === "cash" ? "primary" : "default"}
          onClick={() => setActiveComponent("cash")}
          style={{ width:'100%' }}
        >
          Cash Patients
        </Button>
        <Button
          type={activeComponent === "insurance" ? "primary" : "default"}
          onClick={() => setActiveComponent("insurance")}
          style={{ width:'100%' }}

        >
          Insurance Patients
        </Button>
      </div>

      {/* Conditionally render components */}
      {activeComponent === "cash" ? <InpatientCash /> : <InpatientCorporate />}
      <ProcessPayment
        visible={isGenerateReceiptModalVisible}
        onClose={handleClose}
        amount={selectedPatientAmount}
        patientNo={patientNo}
      />

      <AddCharges
        visible={addChargeModal}
        onClose={handleClose}
        patientNo={patientNo}
        visitNo={visitNo}
        setTotalAmount={(amount) => {
          const key = selectedCashRow?.AppointmentNo;
          if (key) {
            setUpdatedAmounts((prev) => ({
              ...prev,
              [key]: (prev[key] || 0) + amount,
            }));
          }
        }}
      />
    </div>
  );
};

export default ActiveInpatient;

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
} from "antd";
import { EyeOutlined, DollarOutlined } from "@ant-design/icons";
import { FaEye, FaFileInvoice } from "react-icons/fa";
import ProcessPayment from "./ProcessPayment";
import AddCharges from "./AddCharges";
import useAuth from "../../hooks/useAuth";

const { TabPane } = Tabs;

const ActiveOutPatients = () => {
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
  const [filteredCorporatePatients, setFilteredCorporatePatients] = useState([]);
  
  // Modals
  const [isGenerateReceiptModalVisible, setIsGenerateReceiptModalVisible] =
    useState(false);
  const [addChargeModal, setAddChargeModal] = useState(false);
  
  // To update patient balance in the list when new charges are added
  const [updatedAmounts, setUpdatedAmounts] = useState({});
  
  // Track which tab is active: "1" for Cash, "2" for Corporate
  const [activeTab, setActiveTab] = useState("1");
  
  // For cash patients, we allow row selection to display external actions.
  const [selectedCashRow, setSelectedCashRow] = useState(null);

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
          patient.Names.toLowerCase().includes(updatedSearchParams.SearchNames)) &&
        (!updatedSearchParams.AppointmentNo ||
          patient.AppointmentNo.toLowerCase().includes(updatedSearchParams.AppointmentNo))
    );

    const filteredCorporate = corporatePatients.filter(
      (patient) =>
        (!updatedSearchParams.SearchNames ||
          patient.Names.toLowerCase().includes(updatedSearchParams.SearchNames)) &&
        (!updatedSearchParams.AppointmentNo ||
          patient.AppointmentNo.toLowerCase().includes(updatedSearchParams.AppointmentNo))
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
  };

  const handleBalanceUpdate = (patientNo, newBalance) => {
    setUpdatedAmounts((prev) => ({
      ...prev,
      [patientNo]: newBalance,
    }));
  };

  const handleViewPatientReceips=(record) => {
    navigate(`/reception/Patient-Receipts/Patient?VisitNo=${record?.AppointmentNo}`);
   
  }

  // Base columns common to both tables
  const baseColumns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
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
      render: (text, record) => {
        const newBalance =
          updatedAmounts[record.AppointmentNo] !== undefined
            ? updatedAmounts[record.AppointmentNo]
            : text;
        return (
          <span style={{ color: newBalance !== text ? "red" : "black" }}>
            KSh {newBalance.toFixed(2)}
          </span>
        );
      },
    },
  ];

  // For corporate patients, add an inline action column.
  const corporateColumns = [
    ...baseColumns,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() =>
            navigate(`/reception/invoice/Patient?PatientNo=${record.PatientNo}`, {
              state: { patientData: record },
            })
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  // For cash patients, always render external action buttons.
  // The buttons are disabled until a row is selected.
  const renderCashActions = () => (
    <Space size="middle" style={{ marginTop: "20px" }}>
      <Button
        type="primary"
        onClick={() => showPaymentModal(selectedCashRow)}
        disabled={!selectedCashRow}
      >
        <DollarOutlined /> Make Payment
      </Button>
      <Button
        type="default"
        onClick={() => showAddChargesModal(selectedCashRow)}
        disabled={!selectedCashRow}
      >
        <FaFileInvoice /> Add Charges
      </Button>
      <Button
        type="primary"
        onClick={()=>handleViewPatientReceips(selectedCashRow)}
        disabled={!selectedCashRow}
      >
        <FaEye /> View Charges
      </Button>
    </Space>
  );

  // Row selection configuration for cash patients
  const cashRowSelection = {
    type: "radio",
    selectedRowKeys: selectedCashRow ? [selectedCashRow.PatientNo] : [],
    onChange: (_, selectedRows) => {
      setSelectedCashRow(selectedRows[0]);
    },
  };

  return (
    <div>
      <h4 className="text-center p-3 text-dark">Outpatient Billing List</h4>
      <Typography.Text
        style={{
          color: "#003F6D",
          fontWeight: "bold",
          marginBottom: "16px",
        }}
      >
        Search by:
      </Typography.Text>
      <Row gutter={16} className="mt-2">
        <Col span={12}>
          <Typography.Text
            style={{ color: "#003F6D", fontWeight: "bold", marginBottom: "16px" }}
          >
            Patient Names
          </Typography.Text>
          <Input
            placeholder="Patient Names"
            value={searchParams.SearchNames}
            onChange={(e) => handleSearch(e, "SearchNames")}
          />
        </Col>
        <Col span={12}>
          <Typography.Text
            style={{ color: "#003F6D", fontWeight: "bold", marginBottom: "16px" }}
          >
            Appointment Number:
          </Typography.Text>
          <Input
            placeholder="Appointment Number"
            value={searchParams.AppointmentNo}
            onChange={(e) => handleSearch(e, "AppointmentNo")}
          />
        </Col>
      </Row>

      {/* For Cash Patients, render external action buttons (always visible) */}
      {activeTab === "1" && (
        <div style={{ marginBottom: 16 }}>{renderCashActions()}</div>
      )}

      <Tabs onChange={(key) => setActiveTab(key)} defaultActiveKey="1">
        <TabPane tab="Cash Patients" key="1">
          <Table
            rowSelection={cashRowSelection}
            columns={baseColumns} // No inline actions; actions come from the external area.
            dataSource={filteredCashPatients.map((patient) => ({
              ...patient,
              key: patient.PatientNo,
            }))}
            pagination={{ pageSize: 25 }}
            size="small"
          />
        </TabPane>
        <TabPane tab="Corporate Patients" key="2">
          <Table
            // For corporate patients, we show inline actions so no rowSelection is needed.
            columns={corporateColumns}
            dataSource={filteredCorporatePatients.map((patient) => ({
              ...patient,
              key: patient.PatientNo,
            }))}
            pagination={{ pageSize: 25 }}
            size="small"
          />
        </TabPane>
      </Tabs>

      <ProcessPayment
        visible={isGenerateReceiptModalVisible}
        onClose={handleClose}
        amount={selectedPatientAmount}
        patientNo={selectedCashRow?.PatientNo}
      />

      <AddCharges
        visible={addChargeModal}
        onClose={handleClose}
        // For cash patients, use the selected row’s AppointmentNo.
        visitNo={selectedCashRow?.AppointmentNo}
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

export default ActiveOutPatients;

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
import TabPane from "antd/es/tabs/TabPane";
import ProcessPayment from "./ProcessPayment";
import AddCharges from "./AddCharges";
import PostedReceipts from "./PostedReceipts";

const InsurancePatients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients: billingData } = useSelector(
    (state) => state.getBillingList
  );

  const [InsurancePatients, setInsurancePatients] = useState([]);
  const [patientNo, setPatientNo] = useState(null);
  const [visitNo, setVisitNo] = useState(null);
  const [filteredInsurancePatients, setFilteredInsurancePatients] = useState([]);

  // Modals
  const [isGenerateReceiptModalVisible, setIsGenerateReceiptModalVisible] =
    useState(false);
  const [addChargeModal, setAddChargeModal] = useState(false);

  // To update patient balance in the list when new charges are added
  const [updatedAmounts, setUpdatedAmounts] = useState({});
  const [selectedPatientAmount, setSelectedPatientAmount] = useState("");
  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  // Track which tab is active: "1" for Insurance, "2" for Corporate
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    dispatch(getBillingList());
    dispatch(appmntList());
  }, [dispatch]);

  useEffect(() => {
    if (billingData && billingData.length > 0) {

      const sortedList = billingData.sort(
        (a, b) => new Number(b.ActiveVisitNo) - new Number(a.ActiveVisitNo)
      );

      const Insurance = sortedList.filter(
        (patient) =>
          patient.PatientType === "Corporate" && patient.Activated && patient.Inpatient === false 
      );

      setInsurancePatients(Insurance);

      setFilteredInsurancePatients(Insurance);
    }
  }, [billingData]);

  const handleSearch = (e, field) => {
    const value = e.target.value.toLowerCase();
    const updatedSearchParams = { ...searchParams, [field]: value };
    setSearchParams(updatedSearchParams);

    const filteredInsurance = InsurancePatients.filter(
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

    setFilteredInsurancePatients(filteredInsurance);
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
      `/reception/invoice/Patient?PatientNo=${record?.PatientNo}`,
{      state: { patientData: record },
}    );
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
                `/reception/invoice/Patient?Patient=${record.PatientNo}`,
                {
                  state: { patientData: record },
                }
              )
            }
          >
            View Charges
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
      dataIndex: "ActiveVisitNo",
      key: "ActiveVisitNo",
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
           <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() =>
              navigate(
                `/reception/invoice/Patient?PatientNo=${record.PatientNo}`,
                {
                  state: { patientData: record },
                }
              )
            }
          >
            View Charges
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
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
                        style={{
                          color: "#003F6D",
                          fontWeight: "bold",
                          marginBottom: "16px",
                        }}
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
                        style={{
                          color: "#003F6D",
                          fontWeight: "bold",
                          marginBottom: "16px",
                        }}
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
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Insurance Patients" key="1">
          <Table
            columns={baseColumns} // No inline actions; actions come from the external area.
            dataSource={filteredInsurancePatients.map((patient) => ({
              ...patient,
              key: patient.PatientNo,
              sorter: patient.Balance,
            }))}
            pagination={{ pageSize: 25 }}
            size="small"
          />
        </TabPane>
        {/* <TabPane tab="Receipt List" key="2">
          <PostedReceipts />
        </TabPane> */}
      </Tabs>
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
          const key = { visitNo };
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

export default InsurancePatients;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appmntList } from "../../actions/patientActions";
import { getBillingList } from "../../actions/Charges-Actions/getBillingList";
import {
  Tabs,
  Table,
  Dropdown,
  Menu,
  Button,
  Input,
  Row,
  Col,
  Typography,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { FaFileInvoice } from "react-icons/fa";
import ProcessPayment from "./ProcessPayment";

const { TabPane } = Tabs;
const { Search } = Input;

const ActiveOutPatients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, patients: visitData } = useSelector(
    (state) => state.appmntList
  );
  const { patients: billingData } = useSelector(
    (state) => state.getBillingList
  );

  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
const[selectedpatientNo, setSelectedPatientNo] = useState('')
  const [cashPatients, setCashPatients] = useState([]);
  const [corporatePatients, setCorporatePatients] = useState([]);
  const [filteredCashPatients, setFilteredCashPatients] = useState([]);
  const [filteredCorporatePatients, setFilteredCorporatePatients] = useState(
    []
  );

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
          Inpatient: matchingPatient?.Inpatient || false,
        };
      });

      const sortedList = formattedBillingList.sort(
        (a, b) => new Date(b.AppointmentDate) - new Date(a.AppointmentDate)
      );

      const cash = sortedList.filter(
        (patient) => patient.PatientType === "Cash"
      );
      const corporate = sortedList.filter(
        (patient) => patient.PatientType === "Corporate"
      );

      setCashPatients(cash);
      setCorporatePatients(corporate);

      setFilteredCashPatients(cash);
      setFilteredCorporatePatients(corporate);
    }
  }, [visitData, billingData]);

  const handleSearch = (e, field) => {
    const value = e.target.value.toLowerCase();
    const updatedSearchParams = {
      ...searchParams,
      [field]: value,
    };
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

  const showModal = (patientNo) => {
    setIsModalVisible(true);
    setSelectedPatientNo(patientNo)
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPatientNo(null);
  };
  

  const patientColumns = [
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
      render: (text) => `KSh ${text.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const menu = (
          <Menu>
            {/* <Menu.Item
              key="view"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(`/reception/invoice/Patient?PatientNo=${record.PatientNo}`, {
                  state: { patientData: record },
                })
              }
            >
              View
            </Menu.Item> */}
            <Menu.Item
              key="Receipt Payment"
              icon={<FaFileInvoice />}
              onClick={() => showModal(record.PatientNo)}
            >
              Generate Receipt
            </Menu.Item>
            <Menu.Item
              key="edit"
              icon={<EditOutlined />}
              onClick={() => console.log("Editing", record)}
            >
              View
            </Menu.Item>
            <Menu.Item
              key="print"
              icon={<FilePdfOutlined />}
              onClick={() => console.log("Printing", record)}
            >
              Print Invoice
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="primary" size="small">
              <span
                className="fw-bold text-white"
                style={{ cursor: "pointer", fontSize: "16px" }}
              >
                ...
              </span>
              <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

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

      <Tabs defaultActiveKey="1">
        <TabPane tab="Cash Patients" key="1">
          <Table
            columns={patientColumns}
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
            columns={patientColumns}
            dataSource={filteredCorporatePatients.map((patient) => ({
              ...patient,
              key: patient.PatientNo,
            }))}
            pagination={{ pageSize: 25 }}
            size="small"
          />
        </TabPane>
      </Tabs>
      <ProcessPayment visible={isModalVisible} onClose={handleModalClose} patientNo={selectedpatientNo} />
    </div>
  );
};

export default ActiveOutPatients;

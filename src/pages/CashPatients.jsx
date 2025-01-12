import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Table,
  Typography,
  Tooltip,
  Modal,
  
  Tabs,
} from "antd";
import { EyeOutlined, TeamOutlined } from "@ant-design/icons";
import { appmntList, listPatients } from "../actions/patientActions";
import { useNavigate } from "react-router-dom";
import { getPatientDetails } from "../actions/triage-actions/getPatientDetailsSlice";
import useAuth from "../hooks/useAuth";
import { postInterimInvoice } from "../actions/Charges-Actions/printInterimInvoice";
import TabPane from "antd/es/tabs/TabPane";
import { getBillingList } from "../actions/Charges-Actions/getBillingList";

const CashPatients = () => {
  
  const { loading, patients: visitData } = useSelector(
    (state) => state.appmntList
  );
  const { loading: billingLoading, patients: billingData } = useSelector(
    (state) => state.getBillingList
  );
  const {
    loading: patientDetailsLoading,
    error: patientDetailsError,
    patientDetails,
  } = useSelector((state) => state.getPatientDetails);
  const { loading: invoiceProcessingLoading, error: invoiceProcessingError } =
    useSelector((state) => state.postInterimInvoice);

  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filteredOutpatients, setFilteredOutpatients] = useState([]);
  const [filteredInpatients, setFilteredInpatients] = useState([]);
  const [formattedBillingTable, setFormattedBillingTable] = useState([]);

  const [searchParams, setSearchParams] = useState({
    SearchNames: "",
    AppointmentNo: "",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [billingModalVisible, setBillingModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientBalanceDetails, setPatientBalanceDetails] = useState(null);
  const staffNo = useAuth().userData.No;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(appmntList());
    dispatch(getBillingList());
  }, [dispatch]);


  const formattedBillingList= visitData.map((patient) =>{
    const matchingPatient=billingData.find((p) => p.PatientNo === patient.PatientNo);
    return {
      ...patient,
      PatientNo: patient.PatientNo,
      Balance: matchingPatient?.Balance,      
      OpenInsuranceBalance:matchingPatient?.Open_Insurance_Amount,
      Inpatient:matchingPatient?.Inpatient
    };

  });
  console.log("Formatted Billing List:", formattedBillingList);

 
  useEffect(() => {
    if (selectedPatient) {
      dispatch(getPatientDetails(selectedPatient.PatientNo));
    }
  }, [selectedPatient]);

  // Update patientBalanceDetails when patientDetails changes
  useEffect(() => {
    if (
      patientDetails &&
      selectedPatient?.PatientNo === patientDetails.PatientNo
    ) {
      setPatientBalanceDetails(patientDetails);
    }
  }, [patientDetails, selectedPatient]);

 
  useEffect(() => {
    if (formattedBillingList) {
      // Sort the list based on the AppointmentDate (latest first)
      const sortedList = [...formattedBillingList].sort((a, b) => {
        const dateA = new Date(a.AppointmentDate);
        const dateB = new Date(b.AppointmentDate);
        return dateB - dateA; // For descending order
      });
  
      setFilteredOutpatients(
        sortedList.filter(
          (patient) =>
            patient.PatientType === "Cash" && !patient.Inpatient
        )
      );
      setFilteredInpatients(
        sortedList.filter(
          (patient) =>
            patient.PatientType === "Cash" && patient.Inpatient
        )
      );
    }
  }, [formattedBillingList]);
  

  
  const handleSearchChange = (e, key) => {
    const value = e.target.value.toLowerCase();
    setSearchParams((prev) => ({ ...prev, [key]: value }));

    const filtered = formattedBillingTable.filter((patient) => {
      const matchesName = patient.Names?.toLowerCase().includes(
        searchParams.SearchNames.toLowerCase()
      );
      const matchesAppointmentNo = patient.AppointmentNo?.toLowerCase().includes(
        searchParams.AppointmentNo.toLowerCase()
      );

      return matchesName && matchesAppointmentNo;
    });

    setFormattedBillingTable(filtered);
  };
  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const showModal = (patient) => {
    setSelectedPatient(patient);
    setBillingModalVisible(true);
  };

  const handleBillingSubmit = () => {
    setBillingModalVisible(false);

    if (patientBalanceDetails) {
      const invoiceData = {
        PatientNo: patientBalanceDetails.PatientNo,
        visitNo: patientBalanceDetails.ActiveVisitNo,
        staffNo,
      };

      dispatch(postInterimInvoice(invoiceData));
    } else {
      console.error("Patient balance details not available.");
    }
  };
  const outpatientColumns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Name",
      dataIndex: "Names", // Corrected key to match patient object
      key: "Names",
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
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
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
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
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {/* <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
              View Details
            </Button>
          </Tooltip> */}
          <Tooltip title="Bill and Clear">
            <Button type="primary" onClick={() => showModal(record)}>
              Bill
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];
  const inpatientColumns = [
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Name",
      dataIndex: "Names", // Corrected key to match patient object
      key: "Names",
    },
    {
      title: "Appointment No",
      dataIndex: "AppointmentNo",
      key: "AppointmentNo",
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
      title: "Gender",
      dataIndex: "Gender",
      key: "Gender",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Tooltip title="View Details">
            <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
              View Details
            </Button>
          </Tooltip>
          <Tooltip title="Bill and Clear">
            <Button type="primary" onClick={() => showModal(record)}>
              Bill
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const startIdx = (pagination.current - 1) * pagination.pageSize;
  const endIdx = startIdx + pagination.pageSize;
  const paginatedData = filteredPatients.slice(startIdx, endIdx);

  return (
    <div>
      <h4 className="text-center p-3 text-dark">
        <TeamOutlined style={{ marginRight: "8px", fontSize: "24px" }} />
        Cash Patient List
      </h4>

      <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Patient Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={12}>
            <Input
              placeholder="Patient Names"
              value={searchParams.SearchNames}
              onChange={(e) => handleSearchChange(e, "SearchNames")}
            />
          </Col>
          <Col span={12}>
            <Input
              placeholder="Appointment Number"
              value={searchParams.AppointmentNo}
              onChange={(e) => handleSearchChange(e, "AppointmentNo")}
            />
          </Col>
        </Row>
      </Card>

      <div className="mt-4">
      <Tabs defaultActiveKey="1" size="large" type="card">
        <TabPane tab="Outpatients list" key="1">
          <Table
            columns={outpatientColumns}
            dataSource={filteredOutpatients.map((patient) => ({
              ...patient,
              key: patient.AppointmentNo,
            }))}
            pagination={{
              total: filteredOutpatients.length,
              current: pagination.current,
              pageSize: pagination.pageSize,
              onChange: handlePaginationChange,
            }}
            bordered
            size="small"
          />
        </TabPane>
        <TabPane tab="Inpatients list" key="2">
          <Table
            columns={inpatientColumns}
            dataSource={filteredInpatients.map((patient) => ({
              ...patient,
              key: patient.AppointmentNo,
            }))}
            pagination={{
              total: filteredInpatients.length,
              current: pagination.current,
              pageSize: pagination.pageSize,
              onChange: handlePaginationChange,
            }}
            bordered
            size="small"
          />
        </TabPane>
      </Tabs>
      </div>

      <Modal
        title="Billing Details"
        visible={billingModalVisible}
        onCancel={() => setBillingModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setBillingModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleBillingSubmit}>
            Print Invoice
          </Button>,
        ]}
        width={600} // Adjust width for better UI
      >
        {patientBalanceDetails ? (
          <>
            <Card className="card-header" style={{ borderRadius: 8 }}>
              {/* <Typography.Title level={4} style={{ color: "#003F6D" }}>
                Patient Details
              </Typography.Title> */}
              <Row gutter={[16, 16]}>
                <Col span={12} className="pt-3 px-3">
                  <Typography.Text strong>Patient Name:</Typography.Text>
                  <Typography.Text>
                    {patientBalanceDetails?.Names || "N/A"}
                  </Typography.Text>
                </Col>
                <Col span={12} className="pt-3 px-3">
                  <Typography.Text strong>Patient No:</Typography.Text>
                  <Typography.Text>
                    {patientBalanceDetails?.PatientNo || "N/A"}
                  </Typography.Text>
                </Col>
                <Col span={12} className="px-3 pb-3">
                  <Typography.Text strong>Inpatient:</Typography.Text>
                  <Typography.Text>
                    {patientBalanceDetails?.Inpatient ? "Yes" : "No"}
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
            <Card
              className="card-header mb-4 mt-4 "
              style={{ borderRadius: 8 }}
            >
              <Typography.Title level={5} style={{ color: "#003F6D" }}>
                Insurance Details
              </Typography.Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Typography.Text strong>Insurance Name:</Typography.Text>
                  <Typography.Text>
                    {patientBalanceDetails?.Insurance_Name || "N/A"}
                  </Typography.Text>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>Insurance No:</Typography.Text>
                  <Typography.Text>
                    {patientBalanceDetails?.Insurance_No || "N/A"}
                  </Typography.Text>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={12} className="py-3">
                  <Typography.Text strong>
                    Open Insurance Amount:
                  </Typography.Text>
                  <Typography.Text>
                    {patientBalanceDetails?.Open_Insurance_Amount || "0.00"}
                  </Typography.Text>
                </Col>
                <Col span={12} className="py-3">
                  <Typography.Text strong>Balance:</Typography.Text>
                  <Typography.Text>
                    {patientBalanceDetails?.Balance || "0.00"}
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          </>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Typography.Text>Loading patient details...</Typography.Text>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .row-warning {
          background-color: #faad14 !important;
        }
      `}</style>
    </div>
  );
};
{
  /* <style jsx>{`
  .patient-info-card {
    margin-top: 20px;
    background-color: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
  }
  .card-header {
    background-color: #f0f2f5;
    border-radius: 8px;
  }
  .ant-card-body {
    padding: 16px;
  }
`}</style>; */
}
export default CashPatients;

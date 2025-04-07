import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Menu, Space, Table, Button } from "antd";
import { getPostedCharges } from "../../actions/Charges-Actions/getPostedReceipts";
import { appmntList } from "../../actions/patientActions";
import { IoEyeOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import AddCharges from "./AddCharges";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import moment from "moment";

const PostedReceipts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook to navigate
  const { loading, data: chargesData } = useSelector((state) => state.getPostedCharges);
  const { loading: visitLoading, patients: visitData } = useSelector((state) => state.appmntList);
  
  // State for modal visibility and selected record data
  const [addChargeModal, setAddChargeModal] = useState(false);
  const [patientNo, setPatientNo] = useState(null);
  const [visitNo, setVisitNo] = useState(null);

  useEffect(() => {
    dispatch(getPostedCharges());
    dispatch(appmntList());
  }, [dispatch]);

  // Combine appointment list with charge data
  const formattedList =
    chargesData
      ?.filter((charge) => charge.Transaction_Type === "ZRECEIPT") // Only keep "ZRECEIPT" transactions
      .map((charge) => {
        // Find the matching appointment based on Appointment_No
        const matchingPatient = visitData?.find((patient) => patient.AppointmentNo === charge.Appointment_No);

        return {
          key: charge.AuxiliaryIndex1, // Unique key
          receiptNo: charge.Code,
          date:charge.Date,
          transactionName: charge.Transaction_Type,
          chargeName: charge.Description,
          quantity: charge.Quantity,
          amount: Math.abs(charge.Amount), // Remove negative sign
          totalAmount: Math.abs(charge.Total_Amount), // Remove negative sign
          patientName: matchingPatient?.Names || "Unknown", // Assign patient name if found
          PatientNo: matchingPatient?.PatientNo, // Added for modal logic
          AppointmentNo: matchingPatient?.AppointmentNo, // Added for modal logic
        };
      }) || [];

  // Menu for the action column
  const menu = (record) => (
    <Menu>
      <Menu.Item key="1">
        <Button
          type="ghost"
          icon={<IoEyeOutline />}
          onClick={() => handleViewPatientReceipts(record)}
        >
          View
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button
          type="ghost"
          onClick={() => showAddChargesModal(record)}
        >
          <FaEdit /> Edit
        </Button>
      </Menu.Item>
    </Menu>
  );

  // Columns definition for the table
  const columns = [
    {
      title: "Receipt No",
      dataIndex: "receiptNo",
      key: "receiptNo",
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Transaction Name",
      dataIndex: "transactionName",
      key: "transactionName",
    },
    {
      title: "Charge Name",
      dataIndex: "chargeName",
      key: "chargeName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        return moment(text).format("DD/MM/YYYY"); // Format using moment.js
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Dropdown overlay={menu(record)} trigger={['click']}>
            <Button style={{ color: '#0f5689', fontSize: '16px', fontWeight: 'bold' }}>...</Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Navigate to View Receipt page
  const handleViewPatientReceipts = (record) => {
    //navigate with record in state
    navigate(`/Reception/Patient-Receipts/Patient?ReceiptNo=${record?.receiptNo}`,{
      state:{patientData:record}
    });
  };

  // Show modal to edit charge details
  const showAddChargesModal = (record) => {
    setAddChargeModal(true);
    setPatientNo(record.PatientNo);
    setVisitNo(record.AppointmentNo);
  };

  // Close the modal
  const handleClose = () => {
    setAddChargeModal(false);
    setPatientNo(null);
    setVisitNo(null);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={formattedList} // Use the merged and filtered list
        pagination={{ pageSize: 25 }}
        size="small"
        loading={loading || visitLoading}
      />

      <AddCharges
        visible={addChargeModal}
        onClose={handleClose} // Pass the close function
        patientNo={patientNo}
        visitNo={visitNo}
      />
    </div>
  );
};

export default PostedReceipts;

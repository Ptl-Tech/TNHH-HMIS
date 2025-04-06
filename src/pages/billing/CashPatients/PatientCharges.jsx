import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { Typography, Table, Spin, Alert, Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AddChargesDrawer from "./AddChargesDrawer";
import { deletePatientCharges } from "../../../actions/Charges-Actions/deleteCharges";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";
import { getReceiptLines } from "../../../actions/Charges-Actions/getReceiptLines";

const { confirm } = Modal;

const PatientCharges = ({ activeVisitNo }) => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(
    (state) => state.getPatientCharges
  );
 const { loading: deleteLoading } = useSelector(
    (state) => state.deletePatientCharges
  );
    const {
      loading: patientBillLoading,
      error: patientBillError,
      data: patientBillData,
    } = useSelector((state) => state.getSingleBill);
  
  const [visible, setVisible] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getPatientCharges(activeVisitNo));
    } else {
      // Clear or reset data when activeVisitNo is empty
      dispatch({ type: 'CLEAR_PATIENT_CHARGES' });  // Assuming you have a Redux action for clearing data
    }
  }, [dispatch, activeVisitNo]);
  
  // Handle Add Charge
  const handleAddChargeView = () => {
    setEditingCharge(null); // Ensure the form is empty for new entries
    setVisible(true);
  };

  // Handle Edit Charge
  const handleEditCharge = (record) => {
    setEditingCharge(record); // Pass selected row data to drawer
    setVisible(true);
  };

  const handleDeleteCharge = (record) => {
    const payload = {
      myAction: "delete",
      recId: record.SystemId,
      visitNo: activeVisitNo,  // Ensure visitNo is correctly passed
      transactionType: record.Transaction_Type,
      charge: record.Code,
      quantity: 0,
      remarks: "Deleted charge",
    };
  
    confirm({
      title: "Are you sure you want to delete this charge?",
      icon: <ExclamationCircleOutlined />,
      content: `Transaction Type: ${record.Transaction_Type}, Amount: KES ${record.Total_Amount.toFixed(2)}`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          console.log("Deleting charge:", record);
          const status = await dispatch(deletePatientCharges(payload));
  
          if (status) {
            await dispatch(getPatientCharges(activeVisitNo)); // Refresh charges
            await dispatch(getSinglePatientBill(activeVisitNo)); // Refresh bill balance
          }
        } catch (error) {
          console.error("Error deleting charge:", error);
        }
      },
      loading: deleteLoading,
    });
  };
  const filteredData = activeVisitNo && data ? data.filter(item => item.Transaction_Type !== "ZRECEIPT") : [];
 

  const columns = [
    {
      title: "Transaction Type",
      dataIndex: "Transaction_Type",
      key: "Transaction_Type",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Total Amount",
      dataIndex: "Total_Amount",
      key: "Total_Amount",
      render: (amount) => `KES ${amount.toFixed(2)}`,
    },

    {
      title: "Amount Paid",
      dataIndex: "Amount_Paid",
      key: "Amount_Paid",
      render: (amount) => `KES ${amount.toFixed(2)}`,
    },
    {
        title: "Status",
        dataIndex: "Posted",
        key: "Posted",
        render: (posted) => (
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              fontWeight: "bold",
              color: posted ? "#52c41a" : "#ff4d4f",
              background: posted ? "none" : "none",
              border: posted ? "none" : "none",
            }}
          >
            {posted ? "Posted" : "Pending"}
          </span>
        ),
      },
      
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            style={{ marginRight: 8 }}
            onClick={() => handleEditCharge(record)}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCharge(record)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
       <div className="d-flex flex-column">
       <Typography.Text
          strong
          underline
          style={{ fontSize: "18px", color: "#0f5689", marginBottom: "12px" }}
        >
          Line Items
        </Typography.Text>
        <span style={{ fontSize: "14px", color: "#888", fontStyle: "italic" }}>Items to billed</span>

       </div>
        <Button type="primary" onClick={handleAddChargeView}>
          Add Charge
        </Button>
      </div>

      <div>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
        ) : error ? (
          <Alert
            message="Error loading patient charges"
            description={error}
            type="error"
            showIcon
          />
        ) : !activeVisitNo || filteredData?.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            No billing records found.
          </p>
        ) : (
          <Table
            bordered
            style={{ marginTop: "10px", borderRadius: "8px" }}
            columns={columns}
            dataSource={filteredData}
            size="small"
            pagination={{ pageSize: 5 }}
          />
        )}
      </div>

      {/* Drawer for Adding & Editing Charges */}
      <AddChargesDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        activeVisitNo={activeVisitNo || ""}
        editingCharge={editingCharge} // Pass selected charge for editing
      />
    </div>
  );
};

export default PatientCharges;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Table, Spin, Alert, Button, Modal, Tabs } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import AddChargesDrawer from "./AddChargesDrawer";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { deletePatientCharges } from "../../../actions/Charges-Actions/deleteCharges";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";

const { confirm } = Modal;
const { TabPane } = Tabs;

const formatKES = (amount) => {
  const parsed = parseFloat(amount);
  if (isNaN(parsed)) return "KES 0.00";
  return parsed.toLocaleString("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  });
};

const PatientCharges = ({ activeVisitNo }) => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(
    (state) => state.getPatientCharges
  );
  const { loading: deleteLoading } = useSelector(
    (state) => state.deletePatientCharges
  );

  const [visible, setVisible] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);

  useEffect(() => {
    if (activeVisitNo) {
      dispatch(getPatientCharges(activeVisitNo));
    } else {
      dispatch({ type: "CLEAR_PATIENT_CHARGES" });
    }
  }, [dispatch, activeVisitNo]);

  const handleAddChargeView = () => {
    setEditingCharge(null);
    setVisible(true);
  };

  const handleEditCharge = (record) => {
    setEditingCharge(record);
    setVisible(true);
  };

  const handleDeleteCharge = (record) => {
    const payload = {
      myAction: "delete",
      recId: record.SystemId,
      visitNo: activeVisitNo,
      transactionType: record.Transaction_Type,
      charge: record.Code,
      quantity: 0,
      remarks: "Deleted charge",
    };

    confirm({
      title: "Are you sure you want to delete this charge?",
      icon: <ExclamationCircleOutlined />,
      content: `Transaction Type: ${
        record.Transaction_Type
      }, Amount: KES ${record.Total_Amount.toFixed(2)}`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const status = await dispatch(deletePatientCharges(payload));
          if (status) {
            await dispatch(getPatientCharges(activeVisitNo));
            await dispatch(getSinglePatientBill(activeVisitNo));
          }
        } catch (error) {
          message.error("Error deleting charge. Please try again.");
        }
      },
      loading: deleteLoading,
    });
  };

  const filteredData =
    activeVisitNo && data
      ? data.filter((item) => item.Transaction_Type !== "ZRECEIPT")
      : [];

  const pendingCharges = data.filter((charge) => !charge.Posted);
  const postedCharges = data.filter((charge) => charge.Posted);

  const columns = [
    {
      title: "Transaction Type",
      dataIndex: "Transaction_Type",
      key: "Transaction_Type",
      filters: [
        ...new Set(data.map((item) => item.Transaction_Type)),
      ].map((type) => ({ text: type, value: type })),
    
      onFilter: (value, record) => record.Transaction_Type === value,
      filterSearch: true,
      width: 150,
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      width: 250,
      ellipsis: true,
      filters: [
        ...new Set(data.map((item) => item.Description)),
      ].map((desc) => ({ text: desc, value: desc })),
      onFilter: (value, record) => record.Description === value,
      filterSearch: true,
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
      render: (text) => formatKES(text),
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    // {
    //   title: "Amount Paid",
    //   dataIndex: "Amount_Paid",
    //   key: "Amount_Paid",
    //   render: (amount) => `KES ${amount.toFixed(2)}`,
    // },
    {
      title: "Status",
      dataIndex: "Posted",
      key: "Posted",
      render: (posted) => (
        <span
          style={{ fontWeight: "bold", color: posted ? "#52c41a" : "#ff4d4f" }}
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
            disabled={record.Posted}
          >
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCharge(record)}
            disabled={record.Posted}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  const renderTable = (dataSource) => {
    const isPosted = dataSource.every((charge) => charge.Posted);

    const dynamicColumns = columns.filter((col) => col.key !== "action");

    const columnsToRender = isPosted ? dynamicColumns : columns;

    return (
      <Table
        bordered
        style={{ marginTop: "10px", borderRadius: "8px" }}
        columns={columnsToRender}
        dataSource={dataSource}
        size="small"
        pagination={{ pageSize: 15 }}
        rowKey="SystemId"
        locale={{ emptyText: "No charges found" }}
      />
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex flex-column"></div>
        <Button
          type="primary"
          onClick={handleAddChargeView}
          disabled={!activeVisitNo}
        >
          <PlusOutlined />
          Add Charge
        </Button>
      </div>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : error ? (
        <Alert
          message="Error loading patient charges"
          description={error}
          type="error"
          showIcon
        />
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Pending Charges" key="1">
            <div id="pending-charges-table">{renderTable(pendingCharges)}</div>
          </TabPane>
          <TabPane tab="Posted Charges" key="2">
            <div id="posted-charges-table">{renderTable(postedCharges)}</div>
          </TabPane>
        </Tabs>
      )}

      <AddChargesDrawer
        visible={visible}
        onClose={() => setVisible(false)}
        activeVisitNo={activeVisitNo || ""}
        editingCharge={editingCharge}
      />
    </div>
  );
};

export default PatientCharges;

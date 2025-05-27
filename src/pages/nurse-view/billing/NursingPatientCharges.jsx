import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Table, Spin, Alert, Button, Modal, Tabs } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";
import { deletePatientCharges } from "../../../actions/Charges-Actions/deleteCharges";
import { getSinglePatientBill } from "../../../actions/Charges-Actions/getSinglePatientBill";
import AddServices from "./AddServices";
import { FaCoins } from "react-icons/fa6";

const { confirm } = Modal;
const { TabPane } = Tabs;

const NursingPatientCharges = () => {
  const dispatch = useDispatch();
    const activeVisitNo = new URLSearchParams(location.search).get("AdmNo");
console.log("Active Visit No:", activeVisitNo);
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
      content: `Transaction Type: ${record.Transaction_Type}, Charge: ${record.Description}`,
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

  const pendingCharges = filteredData.filter((charge) => !charge.Posted);
  const postedCharges = filteredData.filter((charge) => charge.Posted);

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
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      render: (date) => new Date(date).toLocaleDateString("en-GB"),
    },
    
    // {
    //   title: "Status",
    //   dataIndex: "Posted",
    //   key: "Posted",
    //   render: (posted) => (
    //     <span
    //       style={{ fontWeight: "bold", color: posted ? "#52c41a" : "#ff4d4f" }}
    //     >
    //       {posted ? "Posted" : "Pending"}
    //     </span>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            type="default"
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
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center mb-2">
            <FaCoins style={{ fontSize: "22px", color: "#0f5689" }} />
          <Typography.Text
            strong
            underline
            style={{ fontSize: "14px", color: "#0f5689", marginLeft: "8px" }}
          >
         </Typography.Text>
            </div>
          <span
            style={{ fontSize: "14px", color: "#888", fontStyle: "italic" }}
          >
            Billing Items
          </span>
        </div>
        <Button
          type="primary"
          onClick={handleAddChargeView}
          disabled={!activeVisitNo}
          icon={<PlusOutlined />}
          style={{ marginBottom: "16px" }}
        >
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
          <TabPane tab="Patient Charges" key="1">
            <div id="pending-charges-table">{renderTable(pendingCharges)}</div>
          </TabPane>          
        </Tabs>
      )}

      <AddServices
        visible={visible}
        onClose={() => setVisible(false)}
        activeVisitNo={activeVisitNo || ""}
        editingCharge={editingCharge}
      />
    </div>
  );
};

export default NursingPatientCharges;

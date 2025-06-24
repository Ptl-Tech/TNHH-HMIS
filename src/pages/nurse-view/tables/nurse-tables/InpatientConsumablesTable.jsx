import {
  Button,
  Checkbox,
  Input,
  message,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInPatientQyPrescriptionLineSlice } from "../../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import useAuth from "../../../../hooks/useAuth";
import {
  POST_PATIENT_CONSUMABLES_FAILURE,
  POST_PATIENT_CONSUMABLES_SUCCESS,
  postPatientConsumablesSlice,
} from "../../../../actions/nurse-actions/postPatientConsumablesSlice";
import { getPgOpenPatientConsumablesSlice } from "../../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";
import { EditOutlined, DeleteOutlined, DeleteFilled } from "@ant-design/icons";
import { parse } from "dotenv";
const InpatientConsumablesTable = ({
  consumables,
  loadingGetPgOpenPatientConsumables,
}) => {
  const dispatch = useDispatch();
  const userDetails = useAuth();
  console.log({ consumables });
  const admissionNo = new URLSearchParams(window.location.search).get("AdmNo");
  const { loading: loadingPrescriptions, data: prescriptions } = useSelector(
    (state) => state.getInPatientPrescriptionLine
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewOrderSheet, setViewOrderSheet] = useState(false);

  useEffect(() => {
    dispatch(getInPatientQyPrescriptionLineSlice(admissionNo));
    dispatch(getPgOpenPatientConsumablesSlice(admissionNo));
  }, [dispatch, admissionNo]);

  useEffect(() => {
  const hasConsumables = consumables.some(
    (item) => item.Admission_No === admissionNo
  );
  setViewOrderSheet(hasConsumables);
}, [consumables, admissionNo]);

  console.log({ consumables });
  const handleCheckboxChange = (record) => {
    console.log("Checkbox changed for record:", record);
    const exists = selectedRows.find((r) => r.Drug_No === record.Drug_No);
    if (exists) {
      setSelectedRows(selectedRows.filter((r) => r.Drug_No !== record.Drug_No));
    } else {
      setSelectedRows([...selectedRows, record]);
    }
  };

  const handleCompleteOrder = async () => {
    const payloads = selectedRows.map((item) => ({
      myAction: "create",
      admissionNo: item.Admission_No,
      recId: "",
      branchCode: userDetails?.userData?.shortcut_Dimension_1_Code,
      prescriptionDose: parseInt(item.Quantity, 10) || 0,
      drugNo: item.Drug_No,
      staffNo: userDetails.userData.no,
    }));

    for (const payload of payloads) {
      const res = await dispatch(
        postPatientConsumablesSlice("/Nurse/NurseOrderSheet", payload)
      );
      if (res.type === POST_PATIENT_CONSUMABLES_SUCCESS) {
        message.success(`Order created for ${payload.drugNo}`);
      } else {
        message.error(`Failed for ${payload.drugNo}`);
      }
    }

    setSelectedRows([]);
    dispatch(getPgOpenPatientConsumablesSlice(admissionNo));
  };

  const handleViewOrderSheet = () => {
    setViewOrderSheet(!viewOrderSheet);
    if (!viewOrderSheet) {
      loadingGetPgOpenPatientConsumables &&
        dispatch(getPgOpenPatientConsumablesSlice(admissionNo));
    }
  };

  const handledeleteItem = (record) => {
    const consumableData = {
      myAction: "delete",
      admissionNo: record.Admission_No,
      recId: record.SystemId,
      branchCode:
        userDetails?.userData?.shortcut_Dimension_1_Code || branchCode,
      prescriptionDose: 0, // Assuming you want to set this to 0 when deleting
      drugNo: record.Drug_No,
      staffNo: userDetails.userData.no,
    };

    dispatch(
      postPatientConsumablesSlice("/Nurse/NurseOrderSheet", consumableData)
    )
      .then((result) => {
        if (result.type === POST_PATIENT_CONSUMABLES_SUCCESS) {
          message.success("Consumable deleted successfully!");
          dispatch(getPgOpenPatientConsumablesSlice(admissionNo));
        } else {
          message.error(
            result?.payload?.message || "Failed to delete consumable."
          );
        }
      })
      .catch((error) => {
        message.error(error?.message || "An unexpected error occurred.");
      });
  };

  const prescriptitonColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
      fixed: "left",
      width: 50,
    },
    {
      title: "Admission No",
      dataIndex: "Admission_No",
      key: "Admission_No",
      fixed: "left",
      width: 150,
      render: (text) => (
        <Typography.Text style={{ color: "#0f5689", fontWeight: "bold" }}>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: "Drug No",
      dataIndex: "Drug_No",
      key: "Drug_No",
    },
    {
      title: "Drug Name",
      dataIndex: "Drug_Name",
      key: "Drug_Name",
    },
    {
      title: "Dosage",
      dataIndex: "Dosage",
      key: "Dosage",
    },
    {
      title: "Frequency",
      dataIndex: "Frequency",
      key: "Frequency",
    },
    {
      title: "Duration",
      dataIndex: "Number_of_Days",
      key: "Number_of_Days",
    },
    {
      title: "Take",
      dataIndex: "Take",
      key: "Take",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "Unit",
      dataIndex: "Unit_Of_Measure",
      key: "Unit_Of_Measure",
    },
    {
      title: "Route",
      dataIndex: "Route",
      key: "Route",
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      fixed: "right",
      width: 100,
    },
    {
      title: "System ID",
      dataIndex: "SystemId",
      key: "SystemId",
    },
    {
      title: "Select Drug",
      dataIndex: "select",
      key: "select",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Checkbox
          checked={selectedRows.some((r) => r.Drug_No === record.Drug_No)}
          onChange={() => handleCheckboxChange(record)}
        />
      ),
    },
  ];
  const consumableColumns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Adm No",
      dataIndex: "Admission_No",
      key: "Admission_No",
      fixed: "left",
      width: 100,
    },
    {
      title: "Drug No",
      dataIndex: "Drug_No",
      key: "Drug_No",
    },
    {
      title: "Drug Name",
      dataIndex: "Drug_Name",
      key: "Drug_Name",
      render: (_, record) => {
        return (
          <Typography.Text style={{ color: "#0f5689" }}>
            {record.Drug_Name}
          </Typography.Text>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "myAction",
      key: "myAction",
      render: (_, record) => {
        return (
          <>
            {/* <Button type="primary">
              <EditOutlined />{" "}
            </Button> */}
            <Button
              type="default"
              style={{ marginLeft: "10px" }}
              onClick={() => handledeleteItem(record)}
              danger
            >
              <DeleteFilled />
            </Button>
          </>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: consumables?.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination); // Update pagination settings
  };
  const filteredConsumables = consumables.filter(
    (c) => c.Admission_No === admissionNo
  );
  return (
    <div style={{ padding: "20px" }}>
      <Typography.Title level={4}>Inpatient Prescriptions</Typography.Title>

      {loadingPrescriptions ? (
        <Spin />
      ) : (
        <Table
          rowKey="SystemId"
          scroll={{ x: "max-content" }}
          columns={prescriptitonColumns}
          dataSource={prescriptions
            .map((prescription, index) => ({
              ...prescription,
              index: index + 1,
            }))
            .sort((a, b) => a.Drug_No - b.Drug_No)}
          className="admit-patient-table"
          bordered
          size="middle"
          pagination={{
            ...pagination,
            total: prescriptions?.length,
            showSizeChanger: true,
            showQuickJumper: true,
            position: ["bottom", "right"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) =>
              handleTableChange({
                current: page,
                pageSize,
                total: pagination.total,
              }),
            onShowSizeChange: (current, size) =>
              handleTableChange({
                current,
                pageSize: size,
                total: pagination.total,
              }),
            style: {
              marginTop: "30px",
            },
          }}
        />
      )}

      <div style={{ marginTop: "15px" }}>
        <Typography.Text>
          {selectedRows.length} item(s) selected
        </Typography.Text>
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            disabled={selectedRows.length === 0}
            onClick={handleCompleteOrder}
          >
            Complete Order
          </Button>
          <Button onClick={handleViewOrderSheet}>
            {viewOrderSheet ? "Hide" : "View"} Order Sheet
          </Button>
        </div>
      </div>

      {viewOrderSheet && (
        <>
          <Typography.Title level={5} style={{ marginTop: "30px" }}>
            Order Sheet
          </Typography.Title>
          <Table
            rowKey="SystemId"
            scroll={{ x: "max-content" }}
            columns={consumableColumns}
            dataSource={filteredConsumables
              .map((consumable, index) => ({ ...consumable, index: index + 1 }))
              .sort((a, b) => a.Order_No - b.Order_No)}
            className="admit-patient-table"
            bordered
            size="middle"
            loading={loadingGetPgOpenPatientConsumables}
            pagination={{
              ...pagination,
              total: consumables?.length,
              showSizeChanger: true,
              showQuickJumper: true,
              position: ["bottom", "right"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              onChange: (page, pageSize) =>
                handleTableChange({
                  current: page,
                  pageSize,
                  total: pagination.total,
                }),
              onShowSizeChange: (current, size) =>
                handleTableChange({
                  current,
                  pageSize: size,
                  total: pagination.total,
                }),
              style: {
                marginTop: "30px",
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default InpatientConsumablesTable;
//props validation
InpatientConsumablesTable.propTypes = {
  consumables: PropTypes.array.isRequired,
  loadingGetPgOpenPatientConsumables: PropTypes.bool.isRequired,
};

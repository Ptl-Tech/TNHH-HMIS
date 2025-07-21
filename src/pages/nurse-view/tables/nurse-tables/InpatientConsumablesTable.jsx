import {
  Button,
  Checkbox,
  Input,
  message,
  Select,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInPatientQyPrescriptionLineSlice } from "../../../../actions/Doc-actions/QyPrescriptionLinesSlice";
// import useAuth from "../../../../hooks/useAuth";
import {
  POST_PATIENT_CONSUMABLES_FAILURE,
  POST_PATIENT_CONSUMABLES_SUCCESS,
  postPatientConsumablesSlice,
} from "../../../../actions/nurse-actions/postPatientConsumablesSlice";
import { getPgOpenPatientConsumablesSlice } from "../../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";
import {
  EditOutlined,
  DeleteOutlined,
  DeleteFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { parse } from "dotenv";
import { frequencyOptions } from "../../../pharmacy-views/pharmacy-utils";
const InpatientConsumablesTable = ({
  consumables,
  loadingGetPgOpenPatientConsumables,
}) => {
  const dispatch = useDispatch();
  const userDetails = null;
  console.log({ consumables });
  const admissionNo = new URLSearchParams(window.location.search).get("AdmNo");
  const { loading: loadingPrescriptions, data: prescriptions } = useSelector(
    (state) => state.getInPatientPrescriptionLine
  );
  const [selectedRows, setSelectedRows] = useState([]);
  const [viewOrderSheet, setViewOrderSheet] = useState(false);
  const [editingRowKey, setEditingRowKey] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

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
  useEffect(() => {
  if (prescriptions?.length && consumables?.length) {
    const matched = prescriptions.filter((p) =>
      consumables.some((c) => c.Drug_No === p.Drug_No && c.Admission_No === admissionNo)
    );
    setSelectedRows(matched);
  }
}, [prescriptions, consumables, admissionNo]);


  const handleCheckboxChange = (record) => {
    const exists = selectedRows.find((r) => r.Drug_No === record.Drug_No);
    if (exists) {
      setSelectedRows(selectedRows.filter((r) => r.Drug_No !== record.Drug_No));
    } else {
      setSelectedRows([...selectedRows, record]);
    }
  };

  const handleCompleteOrder = async () => {
// Check if any rows are selected
    if (selectedRows.length === 0) {
      message.warning("Please select at least one drug to order.");
      return;
    }
    //check if drugs are already in the order sheet and skip them in payload when creating new orders
    const existingDrugs = consumables
      .filter((item) => item.Admission_No === admissionNo)
      .map((item) => item.Drug_No);
    const newSelectedRows = selectedRows.filter(
      (item) => !existingDrugs.includes(item.Drug_No)
    );
    const payloads = newSelectedRows.map((item) => ({
      myAction: "create",
      admissionNo: item.Admission_No,
      recId: "",
      branchCode: userDetails?.userData?.shortcut_Dimension_1_Code,
      quantity: parseInt(item.Quantity, 10) || 0,
      prescriptionDose: 3,
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

    // {
    //   title: "Drug No",
    //   dataIndex: "Drug_No",
    //   key: "Drug_No",
    // },
    {
      title: "Drug Name",
      dataIndex: "Drug_Name",
      key: "Drug_Name",
    },
    {
      title: "Dosage",
      dataIndex: "Prescription_Dose",
      key: "Prescription_Dose",
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
      title: "#",
      dataIndex: "index",
      key: "index",
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
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      render: (quantity, record) => {
        if (editingRowKey === record.SystemId) {
          return (
            <Input
              type="number"
              value={editedRowData.Quantity}
              onChange={(e) =>
                setEditedRowData({ ...editedRowData, Quantity: e.target.value })
              }
              min={0}
            />
          );
        }
        return quantity;
      },
      width: 25,
    },

    {
      title: "Prescription Dose",
      dataIndex: "Prescription_Dose",
      key: "Prescription_Dose",
      width: 200,
      render: (dose, record) => {
        if (editingRowKey === record.SystemId) {
          return (
            <Select
              value={editedRowData.Prescription_Dose}
              onChange={(value) =>
                setEditedRowData({
                  ...editedRowData,
                  Prescription_Dose: value,
                })
              }
              style={{ width: "100%" }}
            >
              {frequencyOptions.map((p) => (
                <Select.Option key={p.value} value={p.value}>
                  {p.label}
                </Select.Option>
              ))}
            </Select>
          );
        }

        // Normalize empty string or null/undefined to 0
        const normalizedDose =
          dose === "" || dose === null || dose === undefined ? 0 : dose;

        const found = frequencyOptions.find(
          (opt) => opt.value === normalizedDose || opt.label === normalizedDose
        );

        return found ? found.label : "No Prescription";
      },
    },

    {
      title: "Action",
      dataIndex: "myAction",
      key: "myAction",
      render: (_, record) => {
        if (editingRowKey === record.SystemId) {
          return (
            <>
              <Button
                type="primary"
                onClick={async () => {
                  let doseValue = editedRowData.Prescription_Dose;

                  if (!doseValue || typeof doseValue === "string") {
                    const selectedDose = frequencyOptions.find(
                      (item) => item.label === record.Prescription_Dose
                    );
                    doseValue = selectedDose ? selectedDose.value : 0; // fallback to 0 if not matched
                  }

                  const updatedData = {
                    myAction: "edit",
                    admissionNo: record.Admission_No,
                    recId: record.SystemId,
                    branchCode:
                      userDetails?.userData?.shortcut_Dimension_1_Code,
                    quantity: editedRowData.Quantity,
                    prescriptionDose: parseInt(doseValue, 10) || 0,
                    drugNo: editedRowData.Drug_No,
                    staffNo: userDetails.userData.no,
                  };

                  try {
                    const res = await dispatch(
                      postPatientConsumablesSlice(
                        "/Nurse/NurseOrderSheet",
                        updatedData
                      )
                    );

                    if (res.type === POST_PATIENT_CONSUMABLES_SUCCESS) {
                      message.success(
                        `Order updated for ${updatedData.drugNo}`
                      );
                    } else {
                      message.error(
                        `Failed to update details for ${updatedData.drugNo}`
                      );
                    }

                    setEditingRowKey(null);
                    dispatch(getPgOpenPatientConsumablesSlice(admissionNo));
                  } catch (error) {
                    message.error("Something went wrong while updating.");
                    console.error(error);
                  }
                }}
              >
                Save
              </Button>

              <Button
                style={{ marginLeft: 8 }}
                onClick={() => setEditingRowKey(null)}
              >
                Cancel
              </Button>
            </>
          );
        } else {
          return (
            <>
              <Button
                type="primary"
                onClick={() => {
                  setEditingRowKey(record.SystemId);
                  setEditedRowData({
                    Drug_No: record.Drug_No,
                    Quantity: record.Quantity,
                    Prescription_Dose: record.Prescription_Dose,
                  });
                }}
                icon={<EditOutlined />}
              />
              <Button
                type="default"
                style={{ marginLeft: "10px" }}
                onClick={() => handledeleteItem(record)}
                danger
                icon={<DeleteFilled />}
              />
            </>
          );
        }
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
            size="small"
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
            icon={<PlusOutlined />}
          >
            Add to OrderSheet
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
            size="small"
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

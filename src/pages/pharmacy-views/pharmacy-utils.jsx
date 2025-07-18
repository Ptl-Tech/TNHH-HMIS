import { Button, Popconfirm, Space } from "antd";
import { ReturnDrugsComponent } from "./ReturnDrugsComponent";

export const frequencyOptions = [
  { value: 1, label: "STAT" },
  { value: 2, label: "As Needed" },
  { value: 3, label: "Twice a Day" },
  { value: 4, label: "Three Times a Day" },
  { value: 5, label: "Once a Day" },
  { value: 6, label: "Four Times a Day" },
  { value: 8, label: "HOURLY" },
  { value: 9, label: "At Night" },
];

export const pharmacyCardSearchDrugsColumns = (handleAddDrug) => [
  {
    title: "Item Code",
    key: "No",
    dataIndex: "No",
  },
  {
    title: "Item Name",
    key: "Description",
    dataIndex: "Description",
  },
  {
    title: "Generic Name",
    key: "Generic_Name",
    dataIndex: "Generic_Name",
  },
  {
    title: "Available Qty",
    key: "InventoryQuantity",
    dataIndex: "InventoryQuantity",
    render: (value) => value.toLocaleString("en-US"),
  },
  {
    title: "Price",
    key: "UnitPrice",
    dataIndex: "UnitPrice",
    render: (value) => Math.round((value + Number.EPSILON) * 1) / 1,
  },
  {
    key: "No",
    dataIndex: "No",
    title: "Select",
    render: (cell) => {
      return (
        <Button type="primary" onClick={() => handleAddDrug(cell)}>
          Select
        </Button>
      );
    },
  },
];

export const pharmacyQuotationSearchDrugsColumns = (handleAddDrug) => [
  {
    title: "Item Name",
    key: "Description",
    dataIndex: "Description",
  },
  {
    title: "Generic Name",
    key: "Generic_Name",
    dataIndex: "Generic_Name",
  },
  {
    title: "Available Qty",
    key: "InventoryQuantity",
    dataIndex: "InventoryQuantity",
    render: (value) => value.toLocaleString("en-US"),
  },
  {
    title: "Price",
    key: "UnitPrice",
    dataIndex: "UnitPrice",
    render: (value) => Math.round((value + Number.EPSILON) * 1) / 1,
  },
  {
    key: "No",
    dataIndex: "No",
    title: "Select",
    render: (cell) => {
      return (
        <Button type="primary" onClick={() => handleAddDrug(cell)}>
          Select
        </Button>
      );
    },
  },
];

export const pharmacyCardPatientData = [
  [
    {
      name: "Pharmacy No",
      value: "Pharmacy_No",
    },
    {
      name: "Visit Number",
      value: "Link_No",
    },
    {
      name: "Patient Number",
      value: "Patient_No",
    },
    {
      name: "Name",
      value: "Search_Name",
    },
    {
      name: "Date",
      value: "Pharmacy_Date",
    },
    {
      name: "Age",
      value: "Age",
      noBorder: true,
    },
  ],
  [
    {
      name: "Patient Type",
      value: "Patient_Type",
    },
    {
      name: "Transaction Type",
      value: "Patient_Type",
    },
    {
      name: "Request Area",
      value: "Link_Type",
    },
    {
      name: "Insurance",
      value: "Insurance_No",
    },
    {
      name: "Remarks",
      value: "Remarks",
    },
  ],
];

export const pharmacyCardCurrentSelectionColumns = ({
  edit,
  save,
  cancel,
  disabled,
  completed,
  isEditing,
  showConfirm,
}) =>
  [
    { title: "No", dataIndex: "Index", key: "Index" },
    {
      title: "Drug Name",
      dataIndex: "Description",
      key: "Description",
      render: (value, record) => {
        var returnValue;
        returnValue = Object.hasOwn(record, "Description")
          ? value
          : record["DrugName"];
        return returnValue;
      },
    },
    {
      title: "Available Qty",
      dataIndex: "ActualQty",
      key: "ActualQty",
    },
    { title: "Dosage", dataIndex: "Dosage", key: "Dosage", editable: true },
    {
      editable: true,
      key: "Frequency",
      title: "Frequency",
      dataIndex: "Frequency",
      inputType: "number",
    },
    {
      title: "Duration in Days",
      dataIndex: "Duration_Days",
      key: "Duration_Days",
      editable: true,
      inputType: "number",
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      inputType: "number",
      editable: true,
      inputType: "number",
    },
    {
      key: "Returns_Quantity",
      title: "Quantity Returned",
      dataIndex: "Returns_Quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "UnitPrice",
      key: "UnitPrice",
      render: (value) => Math.round((value + Number.EPSILON) * 1) / 1,
    },
    {
      title: "Total Price",
      dataIndex: "TotalPrice",
      key: "TotalPrice",
      render: (value, record) => {
        return (
          Math.round(record.UnitPrice * record.Quantity * 1) / 1
        ).toLocaleString();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="horizontal">
            <Button
              type={"default"}
              style={{ textTransform: "capitalize" }}
              onClick={() => save(record)}
            >
              Save
            </Button>
            <Popconfirm
              type={"primary"}
              onConfirm={cancel}
              title="Sure to cancel?"
            >
              <a>Cancel</a>
            </Popconfirm>
          </Space>
        ) : (
          <>
            {completed ? (
              <ReturnDrugsComponent record={record} />
            ) : (
              <Space direction="horizontal">
                <Button
                  type={"default"}
                  disabled={disabled}
                  onClick={() => edit(record)}
                  style={{ textTransform: "capitalize" }}
                >
                  Edit
                </Button>
                <Button
                  type={"primary"}
                  disabled={disabled}
                  style={{ textTransform: "capitalize" }}
                  onClick={() => showConfirm(record)}
                >
                  Delete
                </Button>
              </Space>
            )}
          </>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        inputType: col.inputType,
      }),
    };
  });

export const pharmacyQuotationCurrentSelectionColumns = (
  edit,
  save,
  cancel,
  isEditing,
  deleteItem
) =>
  [
    { title: "No", dataIndex: "Index", key: "Index" },
    {
      title: "Drug Name",
      dataIndex: "Description",
      key: "Description",
      render: (value, record) => {
        var returnValue;
        returnValue = Object.hasOwn(record, "Description")
          ? value
          : record["DrugName"];
        return returnValue;
      },
    },
    {
      title: "Available Qty",
      dataIndex: "InventoryQuantity",
      key: "InventoryQuantity",
    },
    {
      title: "Billable Quantity",
      dataIndex: "Quantity",
      key: "Quantity",
      editable: true,
      inputType: "number",
    },
    {
      title: "Unit Price",
      dataIndex: "UnitPrice",
      key: "UnitPrice",
      render: (value) => Math.round((value + Number.EPSILON) * 1) / 1,
    },
    {
      title: "Total Price",
      dataIndex: "TotalPrice",
      key: "TotalPrice",
      render: (value, record) => {
        console.log({
          unitPrice: record.UnitPrice,
          quantity: record.Quantity,
          value: (
            Math.round(record.UnitPrice * record.Quantity * 1) / 1
          ).toLocaleString(),
        });

        return (
          Math.round(record.UnitPrice * record.Quantity * 1) / 1
        ).toLocaleString();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="horizontal">
            <Button
              type={"default"}
              style={{ textTransform: "capitalize" }}
              onClick={() => save(record)}
            >
              Save
            </Button>
            <Popconfirm
              type={"primary"}
              onConfirm={cancel}
              title="Sure to cancel?"
            >
              <a>Cancel</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space direction="horizontal">
            <Button
              type={"default"}
              onClick={() => edit(record)}
              style={{ textTransform: "capitalize" }}
            >
              Edit
            </Button>
            <Button
              type={"primary"}
              style={{ textTransform: "capitalize" }}
              onClick={() => deleteItem(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        inputType: col.inputType,
      }),
    };
  });

export const doctorPrescriptionColumns = (
  edit,
  save,
  cancel,
  isEditing,
  deleteItem
) =>
  [
    { title: "No", dataIndex: "Index", key: "Index" },
    {
      title: "Drug Name",
      dataIndex: "Description",
      key: "Description",
      render: (value, record) => {
        var returnValue;
        returnValue = Object.hasOwn(record, "Description")
          ? value
          : record["DrugName"];
        return returnValue;
      },
    },
    {
      width: "180px",
      editable: true,
      title: "Frequency",
      inputType: "select",
      key: "prescriptionDose",
      options: frequencyOptions,
      dataIndex: "prescriptionDose",
      placeholder: "Select Freqency",
      render: (value) =>
        frequencyOptions.find(({ value: VALUE }) => VALUE === value)?.label,
    },
    {
      editable: true,
      key: "duration",
      inputType: "number",
      dataIndex: "duration",
      title: "Duration (Days)",
      placeholder: "Duration",
    },
    {
      key: "remarks",
      editable: true,
      required: false,
      title: "Remarks",
      dataIndex: "remarks",
      placeholder: "Remarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="horizontal">
            <Button
              type={"default"}
              style={{ textTransform: "capitalize" }}
              onClick={() => save(record)}
            >
              Save
            </Button>
            <Popconfirm
              type={"primary"}
              onConfirm={cancel}
              title="Sure to cancel?"
            >
              <a>Cancel</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space direction="horizontal">
            <Button
              type={"default"}
              onClick={() => edit(record)}
              style={{ textTransform: "capitalize" }}
            >
              Edit
            </Button>
            <Button
              type={"primary"}
              style={{ textTransform: "capitalize" }}
              onClick={() => deleteItem(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        title: col.title,
        options: col.options,
        required: col.required,
        dataIndex: col.dataIndex,
        editing: isEditing(record),
        placeholder: col.placeholder,
        inputType: col.inputType || "text",
      }),
    };
  });

export const doctorIPPrescriptionColumns = (
  edit,
  save,
  cancel,
  isEditing,
  deleteItem
) =>
  [
    { title: "No", dataIndex: "Index", key: "Index" },
    {
      title: "Drug Name",
      dataIndex: "Description",
      key: "Description",
      render: (value, record) => {
        var returnValue;
        returnValue = Object.hasOwn(record, "Description")
          ? value
          : record["DrugName"];
        return returnValue;
      },
    },
    {
      width: "180px",
      editable: true,
      title: "Frequency",
      inputType: "select",
      key: "prescriptionDose",
      options: frequencyOptions,
      dataIndex: "prescriptionDose",
      placeholder: "Select Freqency",
      render: (value) =>
        frequencyOptions.find(({ value: VALUE }) => VALUE === value)?.label,
    },
    {
      editable: true,
      key: "duration",
      required: false,
      inputType: "number",
      dataIndex: "duration",
      title: "Duration (Days)",
      placeholder: "Duration",
    },
    {
      editable: true,
      key: "remarks",
      required: false,
      title: "Remarks",
      dataIndex: "remarks",
      placeholder: "Remarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="horizontal">
            <Button
              type={"default"}
              style={{ textTransform: "capitalize" }}
              onClick={() => save(record)}
            >
              Save
            </Button>
            <Popconfirm
              type={"primary"}
              onConfirm={cancel}
              title="Sure to cancel?"
            >
              <a>Cancel</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space direction="horizontal">
            <Button
              type={"default"}
              onClick={() => edit(record)}
              style={{ textTransform: "capitalize" }}
            >
              Edit
            </Button>
            <Button
              type={"primary"}
              style={{ textTransform: "capitalize" }}
              onClick={() => deleteItem(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) return col;

    return {
      ...col,
      onCell: (record) => ({
        record,
        title: col.title,
        options: col.options,
        required: col.required,
        dataIndex: col.dataIndex,
        editing: isEditing(record),
        placeholder: col.placeholder,
        inputType: col.inputType || "text",
      }),
    };
  });

export const pharmacyTable = [
  {
    title: "Encounter No",
    dataIndex: "TreatmentNo",
    key: "TreatmentNo",
    fixed: "left",
    width: 100,
  },
  {
    title: "Drug No",
    dataIndex: "DrugNo",
    key: "DrugNo",
  },
  {
    title: "Drug Name",
    dataIndex: "DrugName",
    key: "DrugName",
  },
  {
    title: "Frequency",
    dataIndex: "PrescriptionDose",
    key: "PrescriptionDose",
  },
  {
    title: "Number of Days",
    dataIndex: "NumberofDays",
    key: "NumberofDays",
  },
  {
    title: "Remarks",
    dataIndex: "Remarks",
    key: "Remarks",
    fixed: "right",
  },
  {
    title: "Status",
    dataIndex: "Status",
    key: "Status",
  },
];

export const IpPhramcyTable = [
  {
    fixed: "left",
    key: "Admission_No",
    title: "Admission No",
    dataIndex: "Admission_No",
  },
  {
    key: "Drug_No",
    title: "Drug No",
    dataIndex: "Drug_No",
  },
  {
    key: "Drug_Name",
    title: "Drug Name",
    dataIndex: "Drug_Name",
  },
  {
    key: "Frequency",
    title: "Frequency",
    dataIndex: "Frequency",
  },
  {
    key: "Number_of_Days",
    title: "Number of Days",
    dataIndex: "Number_of_Days",
  },
  {
    fixed: "right",
    key: "Remarks",
    title: "Remarks",
    dataIndex: "Remarks",
  },
];

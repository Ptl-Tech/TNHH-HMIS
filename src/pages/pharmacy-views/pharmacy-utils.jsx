import { Button, Popconfirm, Space } from 'antd';
import { ReturnDrugsComponent } from './ReturnDrugsComponent';

export const pharmacyCardSearchDrugsColumns = (handleAddDrug) => [
  {
    title: 'Item Code',
    key: 'No',
    dataIndex: 'No',
  },
  {
    title: 'Item Name',
    key: 'Description',
    dataIndex: 'Description',
  },
  {
    title: 'Generic Name',
    key: 'Generic_Name',
    dataIndex: 'Generic_Name',
  },
  {
    title: 'Available Qty',
    key: 'InventoryQuantity',
    dataIndex: 'InventoryQuantity',
    render: (value) => value.toLocaleString('en-US'),
  },
  {
    title: 'Price',
    key: 'UnitPrice',
    dataIndex: 'UnitPrice',
    render: (value) => Math.round((value + Number.EPSILON) * 100) / 100,
  },
  {
    key: 'No',
    dataIndex: 'No',
    title: 'Select',
    render: (cell) => {
      return (
        <Button
          type="primary"
          onClick={() => handleAddDrug(cell)}
        >
          Select
        </Button>
      );
    },
  },
];

export const pharmacyQuotationSearchDrugsColumns = (handleAddDrug) => [
  {
    title: 'Item Name',
    key: 'Description',
    dataIndex: 'Description',
  },
  {
    title: 'Generic Name',
    key: 'Generic_Name',
    dataIndex: 'Generic_Name',
  },
  {
    title: 'Available Qty',
    key: 'InventoryQuantity',
    dataIndex: 'InventoryQuantity',
    render: (value) => value.toLocaleString('en-US'),
  },
  {
    title: 'Price',
    key: 'UnitPrice',
    dataIndex: 'UnitPrice',
    render: (value) => Math.round((value + Number.EPSILON) * 100) / 100,
  },
  {
    key: 'No',
    dataIndex: 'No',
    title: 'Select',
    render: (cell) => {
      return (
        <Button
          type="primary"
          onClick={() => handleAddDrug(cell)}
        >
          Select
        </Button>
      );
    },
  },
];

export const pharmacyCardPatientData = [
  [
    {
      name: 'Pharmacy No',
      value: 'Pharmacy_No',
    },
    {
      name: 'Visit Number',
      value: 'Link_No',
    },
    {
      name: 'Patient Number',
      value: 'Patient_No',
    },
    {
      name: 'Name',
      value: 'Search_Name',
    },
    {
      name: 'Date',
      value: 'Pharmacy_Date',
    },
    {
      name: 'Age',
      value: 'Age',
      noBorder: true,
    },
  ],
  [
    {
      name: 'Patient Type',
      value: 'Patient_Type',
    },
    {
      name: 'Transaction Type',
      value: 'Patient_Type',
    },
    {
      name: 'Request Area',
      value: 'Link_Type',
    },
    {
      name: 'Insurance',
      value: 'Insurance_No',
    },
    {
      name: 'Remarks',
      value: 'Remarks',
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
    { title: 'No', dataIndex: 'Index', key: 'Index' },
    {
      title: 'Drug Name',
      dataIndex: 'Description',
      key: 'Description',
      render: (value, record) => {
        var returnValue;
        returnValue = Object.hasOwn(record, 'Description')
          ? value
          : record['DrugName'];
        return returnValue;
      },
    },
    {
      title: 'Available Qty',
      dataIndex: 'ActualQty',
      key: 'ActualQty',
    },
    { title: 'Dosage', dataIndex: 'Dosage', key: 'Dosage', editable: true },
    {
      title: 'Frequency',
      dataIndex: 'Frequency',
      key: 'Frequency',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Duration in Days',
      dataIndex: 'Duration_Days',
      key: 'Duration_Days',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
      inputType: 'number',
      editable: true,
      inputType: 'number',
    },
    {
      key: 'Returns_Quantity',
      title: 'Quantity Returned',
      dataIndex: 'Returns_Quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'UnitPrice',
      key: 'UnitPrice',
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Total Price',
      dataIndex: 'TotalPrice',
      key: 'TotalPrice',
      render: (value, record) => {
        return Math.round(record.UnitPrice * record.Quantity).toLocaleString();
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="horizontal">
            <Button
              type={'default'}
              style={{ textTransform: 'capitalize' }}
              onClick={() => save(record)}
            >
              Save
            </Button>
            <Popconfirm
              type={'primary'}
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
                  type={'default'}
                  disabled={disabled}
                  onClick={() => edit(record)}
                  style={{ textTransform: 'capitalize' }}
                >
                  Edit
                </Button>
                <Button
                  type={'primary'}
                  disabled={disabled}
                  style={{ textTransform: 'capitalize' }}
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
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
  deleteItem,
) =>
  [
    { title: 'No', dataIndex: 'Index', key: 'Index' },
    {
      title: 'Drug Name',
      dataIndex: 'Description',
      key: 'Description',
      render: (value, record) => {
        var returnValue;
        returnValue = Object.hasOwn(record, 'Description')
          ? value
          : record['DrugName'];
        return returnValue;
      },
    },
    {
      title: 'Available Qty',
      dataIndex: 'InventoryQuantity',
      key: 'InventoryQuantity',
    },
    {
      title: 'Billable Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
      editable: true,
      inputType: 'number',
    },
    {
      title: 'Unit Price',
      dataIndex: 'UnitPrice',
      key: 'UnitPrice',
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Total Price',
      dataIndex: 'TotalPrice',
      key: 'TotalPrice',
      render: (value, record) => {
        return Math.round(record.UnitPrice * record.Quantity).toLocaleString();
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (value, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space direction="horizontal">
            <Button
              type={'default'}
              style={{ textTransform: 'capitalize' }}
              onClick={() => save(record)}
            >
              Save
            </Button>
            <Popconfirm
              type={'primary'}
              onConfirm={cancel}
              title="Sure to cancel?"
            >
              <a>Cancel</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space direction="horizontal">
            <Button
              type={'default'}
              onClick={() => edit(record)}
              style={{ textTransform: 'capitalize' }}
            >
              Edit
            </Button>
            <Button
              type={'primary'}
              style={{ textTransform: 'capitalize' }}
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        inputType: col.inputType,
      }),
    };
  });

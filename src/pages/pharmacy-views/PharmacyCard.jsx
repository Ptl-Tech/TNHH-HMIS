import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Row,
  Col,
  Tag,
  Card,
  Form,
  Space,
  Input,
  Modal,
  Table,
  Button,
  message,
  Typography,
  Popconfirm,
  InputNumber,
  Spin,
  Drawer,
} from 'antd';
import {
  IdcardOutlined,
  SignatureOutlined,
  MedicineBoxOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { Select } from 'antd';

import {
  GET_PHARMACY_RETURN_LIST_RESET,
  getPharmacyLineReturnbyPharmacyNo,
} from '../../actions/pharmacy-actions/getPharmacyLineReturns';
import { getItemsSlice } from '../../actions/triage-actions/getItemsSlice';
import { getPharmacyRequestsAll } from '../../actions/pharmacy-actions/getPharmacyRequestsAll';
import {
  postDrugIssuance,
  postArchivePrescription,
  postPrescriptionQuantity,
  POST_EDIT_PRESCRIPTION_RESET,
  POST_ARCHIVE_PRESCRIPTION_RESET,
  POST_PHARMACY_DRUG_ISSUANCE_RESET,
} from '../../actions/pharmacy-actions/postPharmacyAction';
import { getSinglePharmacyRecord } from '../../actions/pharmacy-actions/getSinglePharmacyRecord';
import { useLocation } from 'react-router-dom';
import {
  RETURN_DRUGS_RESET,
  returnDrugs,
} from '../../actions/pharmacy-actions/returnDrugs';

const { confirm } = Modal;
const { Title, Text } = Typography;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ReturnDrugsComponent = ({ record }) => {
  const dispatch = useDispatch();

  const { DrugName, Description, SystemId, Quantity } = record;

  const [open, setOpen] = useState(false);
  const { data, loading, error } = useSelector((state) => state.returnDrugs);

  useEffect(() => {
    if (data) {
      message.success('The return was successful');
      setOpen(false);
    }

    if (error) {
      message.error('Something went wrong when removing the drugs');
    }

    if (data || error) {
      dispatch({ type: RETURN_DRUGS_RESET });
    }
  }, [data, error]);

  const handleSubmit = (values) => {
    dispatch(returnDrugs(values));
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Return Drug</Button>
      <Drawer
        open={open}
        width={360}
        destroyOnHidden={true}
        onClose={() => setOpen(false)}
        title={`Return ${DrugName || Description}`}
        children={
          <Form
            layout="vertical"
            initialValues={{ recId: SystemId }}
            onFinish={handleSubmit}
          >
            <Form.Item
              name="returnQty"
              label="Number to return"
              rules={[{ required: true, message: 'Quantity is required' }]}
            >
              <Input
                min={1}
                required
                type="number"
                max={Quantity}
              />
            </Form.Item>
            <small>
              Value must be <strong>greater</strong> than <strong>0</strong> or
              less than <strong>{Quantity + 1}</strong>
            </small>
            <Form.Item
              name="returnRemarks"
              label="Reason of returning"
              rules={[
                { required: true, message: 'Please enter reason of returning' },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder="Reason of returning"
              />
            </Form.Item>
            <Button
              type="primary"
              disabled={loading}
              htmlType="submit"
            >
              Submit
            </Button>
            <Form.Item
              name="recId"
              rules={[{ required: true, message: 'Record ID is required' }]}
            >
              <Input
                type="hidden"
                max={Quantity}
              />
            </Form.Item>
          </Form>
        }
      />
    </>
  );
};

const PharmacyCard = ({ type, title, hideSelector }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState('');
  const [currentRequest, setCurrentRequest] = useState(null);
  const [Status, setStatus] = useState(searchParams.get('status') || '');

  const { Title } = Typography;
  const SpaceCompact = Space.Compact;
  const { Row: TableSummaryRow, Cell: TableSummaryCell } = Table.Summary;

  const statuses = [
    { label: 'All', value: '' },
    { label: 'New', value: 'New' },
    { label: 'Forwarded', value: 'Forwarded' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  const { data: pharmacyRequests, loading: pharmacyRequestsLoading } =
    useSelector((state) => state.getPharmacyRequestsAll);
  const { data: postDrugIssuanceData, loading: postDrugIssuanceLoading } =
    useSelector((state) => state.postDrugIssuance);
  const {
    data: postArchivePrescriptionData,
    loading: postArchivePrescriptionLoading,
  } = useSelector((state) => state.postArchivePrescription);
  const { items } = useSelector((state) => state.getItems);
  const {
    data: postPharmacyLineData,
    loading: postPharmacyLineLoading,
    error: postPharmacyLineError,
  } = useSelector((state) => state.postPrescriptionQuantity);
  const {
    data: pharmacyLineData,
    success: pharmacyLineDataSuccess,
    loading: pharmacyLineDataLoading,
  } = useSelector((state) => state.getPatientPharmacyReturnLine);
  const { data: pharmacyRecord } = useSelector(
    (state) => state.getSinglePharmacyRecord,
  );

  console.log({ pharmacyRequests, pharmacyRecord });

  const disabled =
    pharmacyRecord?.Status === 'Completed' ||
    pharmacyRecord?.Status === 'Cancelled';

  const isEditing = (record) => record.No === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.No);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const { SystemId, Pharmacy_No, No, UnitPrice } = record;
      const {
        Dosage,
        Duration_Days,
        Frequency,
        Quantity,
        Take = 0,
        remarks = '',
      } = row;

      dispatch(
        postPrescriptionQuantity({
          myAction: 'edit',
          recId: SystemId,
          pharmacyNo: Pharmacy_No,
          quantity: Quantity,
          take: Take,
          drugNo: No,
          noOfDays: Duration_Days,
          frequency: Frequency,
          dosage: Dosage,
          TotalAmount: Math.round(UnitPrice * Quantity),
          remarks,
        }),
      );

      setEditingKey('');
    } catch (error) {
      console.log({ error });
    }
  };

  const showConfirm = (record) => {
    confirm({
      title: 'Delete the pharmacy line?',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure you want to delete the pharmacy line?',
      onOk() {
        deleteRecord(record);
      },
      onCancel() {},
    });
  };

  // getting the items to be searched with
  useEffect(() => {
    // if we don't have items, then we get the items
    if (!items.length) {
      dispatch(getItemsSlice());
    }

    if (
      (!pharmacyLineDataSuccess && currentRequest) ||
      postPharmacyLineData?.status === 'success'
    ) {
      dispatch(getPharmacyLineReturnbyPharmacyNo(currentRequest));
    } else {
      dispatch({ type: GET_PHARMACY_RETURN_LIST_RESET });
    }
  }, [
    currentRequest,
    items,
    pharmacyLineDataSuccess,
    postPharmacyLineData,
    postDrugIssuanceData,
  ]);

  useEffect(() => {
    dispatch(getPharmacyRequestsAll({ type, status: Status }));
  }, [postArchivePrescriptionData, type, Status]);

  // to track once the pharmacy line has been updated
  useEffect(() => {
    if (postPharmacyLineData) {
      const status = postPharmacyLineData.status;

      message[status === 'success' ? status : 'error'](
        status === 'success'
          ? 'Pharmacy line updated successfully'
          : postPharmacyLineData.data.msg,
      );

      dispatch({ type: POST_EDIT_PRESCRIPTION_RESET });
    }
    if (postPharmacyLineError) {
      message.error("Something wen't wrong while deleting the pharmacy line");
      dispatch({ type: POST_EDIT_PRESCRIPTION_RESET });
    }
  }, [postPharmacyLineData, postPharmacyLineError]);

  // The archive effect
  useEffect(() => {
    if (postArchivePrescriptionData) {
      const status = postArchivePrescriptionData.status;

      message[status](
        status === 'success'
          ? 'The prescription has been archived successfully'
          : 'Something went wrong when acrchiving the prescription',
      );
      dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
    }
  }, [postArchivePrescriptionData]);

  // to track once we post the drug issuance
  useEffect(() => {
    if (postDrugIssuanceData) {
      const status = postDrugIssuanceData.status;

      message[status](
        status === 'success'
          ? 'The prescription has been posted successfully'
          : 'Something went wrong when posting the prescription',
      );
    }
  }, [postDrugIssuanceData]);

  // to get a single pharmacy record
  useEffect(() => {
    console.log({ pharmacyRecord });

    // We cannot update based on whether we have archived or not because the request will not be found
    if (
      (currentRequest && !pharmacyRecord) ||
      (currentRequest &&
        pharmacyRecord &&
        currentRequest !== pharmacyRecord.Pharmacy_No) ||
      postDrugIssuanceData?.status === 'success' ||
      postArchivePrescriptionData?.status === 'success'
    ) {
      dispatch(getSinglePharmacyRecord('Pharmacy_No', currentRequest));
      if (postArchivePrescriptionData)
        dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
      if (postDrugIssuanceData)
        dispatch({ type: POST_PHARMACY_DRUG_ISSUANCE_RESET });
    }
  }, [
    currentRequest,
    pharmacyRecord,
    postDrugIssuanceData,
    postPharmacyLineData,
    postArchivePrescriptionData,
  ]);

  const deleteRecord = (record) => {
    // deleting a pharmacy line
    dispatch(
      postPrescriptionQuantity({
        myAction: 'delete',
        recId: record.SystemId,
        pharmacyNo: record.Pharmacy_No,
        quantity: record.Quantity,
        drugNo: record.No,
      }),
    );
  };

  const columns = [
    { title: 'No', dataIndex: 'Index', key: 'Index' },
    { title: 'Drug No.', dataIndex: 'No', key: 'No' },
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
          <>
            {pharmacyRecord.Status === 'Completed' ? (
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
  ];

  const mergedColumns = columns.map((col) => {
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

  const patientData = [
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

  const handleRequestChange = (value) => {
    setCurrentRequest(value.split('-').at(-1));
  };

  const handleStatusChange = (value) => {
    console.log({ value });
    setStatus(value);
  };

  const handleArchivePrescription = () => {
    dispatch(postArchivePrescription(currentRequest));
  };

  const handleIssuePrescription = () => {
    // TODO: print the pharmacy prescription and the printable
    dispatch(postDrugIssuance(currentRequest));
  };

  return (
    <div style={{ display: 'grid', gap: '16px', padding: '16px 0' }}>
      <Title
        level={4}
        style={{ color: '#0f5689', marginBottom: '0px' }}
      >
        {title}
      </Title>
      <SpaceCompact direction="horizontal">
        {!hideSelector && (
          <Select
            showSearch
            options={statuses}
            prefix={<Tag color="#ac8342">Status</Tag>}
            placeholder="Status"
            defaultValue={Status}
            style={{ width: '200px' }}
            onChange={handleStatusChange}
          />
        )}
        <Select
          showSearch
          style={{ width: '400px' }}
          onChange={handleRequestChange}
          placeholder="Select a patient"
          notFoundContent={
            pharmacyRequestsLoading ? <Spin size="small" /> : 'No results found'
          }
          options={
            pharmacyRequestsLoading
              ? []
              : pharmacyRequests.map((request) => ({
                  label: (
                    <span>
                      {request.Search_Name} - {request.Link_No}
                    </span>
                  ),
                  value: `${request.Search_Name}-${request.Link_No}-${request.Pharmacy_No}`,
                }))
          }
        />
      </SpaceCompact>
      <Card
        style={{ background: '#00000006' }}
        title={
          <Title
            level={5}
            style={{
              gap: '8px',
              display: 'flex',
              color: '#0f5689',
              alignItems: 'center',
            }}
          >
            <IdcardOutlined />
            Pharmacy Card
          </Title>
        }
        variant="borderless"
      >
        <div
          style={{
            color: '#0F5689',
            padding: '0 16px',
            borderRadius: '5px',
            fontWeight: 'semibold',
          }}
        >
          <Row>
            {patientData.map((patientRow) => (
              <Col span={12}>
                {patientRow.map(({ name, value, noBorder }) => (
                  <Row
                    style={{
                      gap: '8px',
                      display: 'flex',
                      padding: '8px 16px',
                      borderBottom: !noBorder && '1px solid #ebebeb',
                    }}
                  >
                    <Text strong>{name} :</Text>
                    {` ${
                      pharmacyRecord
                        ? value === 'Link_Type' &&
                          pharmacyRecord[value] === 'DOCTOR'
                          ? `${pharmacyRecord[value]} (${
                              pharmacyRecord['Doctor_Name'] || 'From Reception'
                            })`
                          : pharmacyRecord[value]
                        : ''
                    }`}
                  </Row>
                ))}
              </Col>
            ))}
          </Row>
        </div>
      </Card>
      {currentRequest && pharmacyRecord && (
        <>
          <div style={{ display: 'grid', gap: '16px' }}>
            <Form
              form={form}
              component={false}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title
                  level={5}
                  style={{
                    gap: '8px',
                    display: 'flex',
                    color: '#0f5689',
                    alignItems: 'center',
                  }}
                >
                  <SignatureOutlined />
                  Prescription
                </Title>
                <SpaceCompact direction="horizontal">
                  <Button
                    style={{ height: '32px' }}
                    disabled={
                      disabled ||
                      postDrugIssuanceLoading ||
                      postArchivePrescriptionLoading
                    }
                    onClick={handleArchivePrescription}
                  >
                    Cancel Prescription
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      height:
                        disabled ||
                        postDrugIssuanceLoading ||
                        postArchivePrescriptionLoading
                          ? '32px'
                          : '30px',
                    }}
                    disabled={
                      disabled ||
                      postDrugIssuanceLoading ||
                      postArchivePrescriptionLoading
                    }
                    onClick={handleIssuePrescription}
                  >
                    Issue Drugs
                  </Button>
                </SpaceCompact>
              </div>
              <Table
                components={{
                  body: { cell: EditableCell },
                }}
                bordered
                size="small"
                pagination={false}
                columns={mergedColumns}
                dataSource={[...pharmacyLineData]
                  .sort(
                    ({ line_no: LineNoA }, { line_no: LineNoB }) =>
                      LineNoA - LineNoB,
                  )
                  .map((pharmacyLine, Index) => ({
                    ...pharmacyLine,
                    Index: Index + 1,
                  }))}
                loading={pharmacyLineDataLoading || postPharmacyLineLoading}
                summary={(pageData) => {
                  console.log({ pageData });
                  const totalValue = pageData.reduce(
                    (acc, { Quantity, UnitPrice }) =>
                      (acc += Quantity * UnitPrice),
                    0,
                  );

                  return pageData.length ? (
                    <TableSummaryRow>
                      <TableSummaryCell
                        index={0}
                        colSpan={8}
                      />
                      <TableSummaryCell index={0}>
                        <Text style={{ fontWeight: 'bold', color: '#0f5689' }}>
                          Total
                        </Text>
                      </TableSummaryCell>
                      <TableSummaryCell index={1}>
                        <Text style={{ fontWeight: 'bold', color: '#0f5689' }}>
                          {new Intl.NumberFormat('en-US').format(
                            Math.round(totalValue),
                          )}
                        </Text>
                      </TableSummaryCell>
                      <TableSummaryCell index={2} />
                    </TableSummaryRow>
                  ) : (
                    <></>
                  );
                }}
              />
            </Form>
          </div>
          <SearchDrugTable
            items={items}
            pharmacyNo={currentRequest}
            loading={postPharmacyLineLoading}
          />
        </>
      )}
    </div>
  );
};

const SearchDrugTable = ({ items, loading, pharmacyNo }) => {
  const dispatch = useDispatch();

  const { Compact } = Space;
  const [filter, setFilter] = useState({ specificName: '', genericName: '' });

  const handleAddDrug = (drugNo) => {
    dispatch(
      postPrescriptionQuantity({
        drugNo,
        pharmacyNo,
        quantity: 0,
        myAction: 'create',
      }),
    );
  };

  const columns = [
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

  return (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div>
        <Title
          level={5}
          style={{
            gap: '8px',
            display: 'flex',
            color: '#0f5689',
            alignItems: 'center',
          }}
        >
          <MedicineBoxOutlined />
          Add Drugs
        </Title>
      </div>
      <Space
        style={{
          width: '100%',
          gap: '16px',
        }}
      >
        <Input
          addonBefore="Specific Name"
          style={{ width: '100%' }}
          value={filter.specificName}
          onChange={(e) =>
            setFilter({ ...filter, specificName: e.currentTarget.value })
          }
          placeholder="Search Specific Name"
        />
        <Input
          addonBefore="Generic Name"
          style={{ width: '100%' }}
          value={filter.genericName}
          onChange={(e) =>
            setFilter({ ...filter, genericName: e.currentTarget.value })
          }
          placeholder="Search Generic Name"
        />
      </Space>
      <Table
        bordered
        size="small"
        loading={loading}
        columns={columns}
        dataSource={
          filter.specificName || filter.genericName
            ? items.filter(
                (drug) =>
                  drug.Description.toLowerCase().includes(
                    filter.specificName.toLowerCase(),
                  ) &&
                  drug.Description.toLowerCase().includes(
                    filter.genericName.toLowerCase(),
                  ),
              )
            : []
        }
      />
    </div>
  );
};

export default PharmacyCard;

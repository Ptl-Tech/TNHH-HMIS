import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Row,
  Col,
  Table,
  Typography,
  Space,
  Input,
  Button,
  Card,
  message,
  Form,
  Popconfirm,
  InputNumber,
  Modal,
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

const PharmacyCard = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [issued, setIssued] = useState(false);
  const [archived, setArchived] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [currentRequest, setCurrentRequest] = useState(null);

  const { data: pharmacyRequests } = useSelector(
    (state) => state.getPharmacyRequestsAll,
  );
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
      const { Dosage, Duration_Days, Frequency, Quantity } = row;

      dispatch(
        postPrescriptionQuantity({
          myAction: 'edit',
          recId: SystemId,
          Pharmacy_No,
          quantity: Quantity,
          drugNo: No,
          Duration_Days,
          Frequency,
          Dosage,
          TotalAmount: Math.round(UnitPrice * Quantity),
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

  useEffect(() => {
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

    if (
      !pharmacyRequests?.length ||
      postArchivePrescriptionData?.status === 'success'
    ) {
      dispatch(getPharmacyRequestsAll(''));
    }
  }, [
    currentRequest,
    items,
    pharmacyLineDataSuccess,
    pharmacyRequests,
    postPharmacyLineData,
    postDrugIssuanceData,
    postArchivePrescriptionData,
  ]);

  useEffect(() => {
    if (postPharmacyLineData) {
      const status = postPharmacyLineData.status;
      console.log({ postPharmacyLineData, status });

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
      setArchived(status === 'success');

      message[status](
        status === 'success'
          ? 'The prescription has been archived successfully'
          : 'Something went wrong when acrchiving the prescription',
      );
      dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
    }
  }, [postArchivePrescriptionData]);

  useEffect(() => {
    if (postDrugIssuanceData) {
      const status = postDrugIssuanceData.status;
      setIssued(status === 'success');

      message[status](
        status === 'success'
          ? 'The prescription has been posted successfully'
          : 'Something went wrong when posting the prescription',
      );
    }
  }, [postDrugIssuanceData]);

  useEffect(() => {
    console.log({ pharmacyRecord });

    // We cannot update based on whether we have archived or not because the request will not be found
    if (
      (currentRequest && !pharmacyRecord) ||
      (currentRequest &&
        pharmacyRecord &&
        pharmacyRecord.PharmacyNo !== currentRequest)
    ) {
      dispatch(getSinglePharmacyRecord(currentRequest));
      if (postArchivePrescriptionData)
        dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
      if (postDrugIssuanceData)
        dispatch({ type: POST_PHARMACY_DRUG_ISSUANCE_RESET });
    }
  }, [currentRequest, pharmacyRecord]);

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
    { title: 'No', dataIndex: 'No', key: 'No' },
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
    },
    {
      title: 'Total Price',
      dataIndex: 'TotalPrice',
      key: 'TotalPrice',
      render: (value, record) => {
        return Math.round(record.UnitPrice * record.Quantity);
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
            <Space direction="horizontal">
              <Button
                type={'default'}
                style={{ textTransform: 'capitalize' }}
                onClick={() => edit(record)}
              >
                Edit
              </Button>
              <Button
                type={'primary'}
                style={{ textTransform: 'capitalize' }}
                onClick={() => showConfirm(record)}
              >
                Delete
              </Button>
            </Space>
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
        value: 'PharmacyNo',
      },
      {
        name: 'Visit Number',
        value: 'LinkNo',
      },
      {
        name: 'Patient Number',
        value: 'PatientNo',
      },
      {
        name: 'Name',
        value: 'Names',
      },
      {
        name: 'Date',
        value: 'PharmacyDate',
      },
      {
        name: 'Total Price',
        value: 'Visit_Total',
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
        value: 'LinkType',
      },
      {
        name: 'Insurance',
        value: 'InsuranceNo',
      },
      {
        name: 'Remarks',
        value: 'LinkType',
      },
    ],
  ];

  const handleRequestChange = (value) => {
    setCurrentRequest(value.split('-').at(-1));
    setArchived(false);
    setIssued(false);
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
      <Select
        showSearch
        style={{ width: '400px' }}
        onChange={handleRequestChange}
        placeholder="Select a patient"
        options={pharmacyRequests.map((request) => ({
          label: `${request.Seach_Name} - ${request.Link_No}`,
          value: `${request.Seach_Name}-${request.Link_No}-${request.Pharmacy_No}`,
        }))}
      />
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
                    {` ${pharmacyRecord ? pharmacyRecord[value] : ''}`}
                  </Row>
                ))}
              </Col>
            ))}
          </Row>
        </div>
      </Card>
      {currentRequest && pharmacyRecord && (
        <>
          <Card
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
                <SignatureOutlined />
                Prescription
              </Title>
            }
            extra={
              <Space direction="horizontal">
                <Button
                  disabled={
                    issued ||
                    archived ||
                    postDrugIssuanceLoading ||
                    postArchivePrescriptionLoading
                  }
                  onClick={handleArchivePrescription}
                >
                  Archive
                </Button>
                <Button
                  type="primary"
                  disabled={
                    issued ||
                    archived ||
                    postDrugIssuanceLoading ||
                    postArchivePrescriptionLoading
                  }
                  onClick={handleIssuePrescription}
                >
                  Issue Drugs
                </Button>
              </Space>
            }
          >
            <Form
              form={form}
              component={false}
            >
              <Table
                components={{
                  body: { cell: EditableCell },
                }}
                bordered
                size="small"
                pagination={false}
                columns={mergedColumns}
                style={{ padding: '16px' }}
                dataSource={[...pharmacyLineData]}
                loading={pharmacyLineDataLoading || postPharmacyLineLoading}
              />
            </Form>
          </Card>
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
      key: 'Description_2',
      dataIndex: 'Description_2',
    },
    {
      title: 'Available Qty',
      key: 'Qunatity',
      dataIndex: 'Qunatity',
    },
    {
      title: 'Price',
      key: 'UnitPrice',
      dataIndex: 'UnitPrice',
    },
    {
      key: 'No',
      dataIndex: 'No',
      title: 'Select',
      render: (cell, record) => {
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
    <Card
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
          <MedicineBoxOutlined />
          Add Drugs
        </Title>
      }
      variant="borderless"
    >
      <Compact style={{ width: '100%', padding: '16px' }}>
        <Input
          style={{ width: '50%' }}
          value={filter.specificName}
          onChange={(e) =>
            setFilter({ ...filter, specificName: e.currentTarget.value })
          }
          placeholder="Search Specific Name"
        />
        <Input
          style={{ width: '50%' }}
          value={filter.genericName}
          onChange={(e) =>
            setFilter({ ...filter, genericName: e.currentTarget.value })
          }
          placeholder="Search Generic Name"
        />
      </Compact>
      <Table
        bordered
        size="small"
        loading={loading}
        columns={columns}
        style={{ padding: '16px' }}
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
    </Card>
  );
};

export default PharmacyCard;

import { Button, Card, Input, Space, Table, Typography, Modal, message, Form, Select } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getPgInpatientDischargeRequestsSlice } from "../../actions/nurse-actions/getPgInpatientDischargeRequestsSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
import { POST_INITIATE_DISCHARGE_FAILURE, POST_INITIATE_DISCHARGE_SUCCESS, postInitiateDischargeSlice } from "../../actions/nurse-actions/postInitiateDischargeSlice";
import useSetTablePagination from "../../hooks/useSetTablePagination";

const DischargeRequests = () => {
  const [isDiagnosisModalVisible, setDiagnosisModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Admission No',
      dataIndex: 'AdmissionNo',
      key: 'AdmissionNo',
      fixed: 'left',
      width: 100
    },
    {
      title: 'Patient Names',
      dataIndex: 'Search_Name',
      key: 'Search_Name',
      render: (_, record) => {
        return <Typography.Text style={{ color: '#0f5689' }}>
          {record.Search_Name}
        </Typography.Text>
      }
    },
    {
      title: 'Admission Date',
      dataIndex: 'AdmissionDate',
      key: 'AdmissionDate',
    },
    {
      title: 'Ward',
      dataIndex: 'Ward',
      key: 'Ward',
    },
    {
      title: 'Bed',
      dataIndex: 'Bed',
      key: 'Bed',
    },
    {
      title: 'Doctor',
      dataIndex: 'DoctorName',
      key: 'DoctorName',
    },
    {
      title: 'Admission Reason',
      dataIndex: 'AdmissionReason',
      key: 'AdmissionReason',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => {
        return <Button type="primary" onClick={() => handleInitiateDischarge(record)}>Initiate Discharge</Button>
      }
    }
  ];

  const { loadingGetInpatientDischargeRequests, getInpatientDischargeRequest } = useSelector(state => state.getPgInpatientDischargeRequests);
  const dispatch = useDispatch();
  const { loading, data } = useSelector(state => state.getDoctorsList);
  const { confirm } = Modal;

  const formattedDoctorDetails = data.map(doctor => {
    return {
      DoctorID: doctor.DoctorID,
      DoctorsName: doctor.DoctorsName,
    }
  });

  const formattedPatientDischargeRequests = getInpatientDischargeRequest.map(discharge => {
    const matchDoctorName = formattedDoctorDetails.find(doctor => doctor.DoctorID === discharge.Doctor);
    return {
      ...discharge,
      DoctorName: matchDoctorName?.DoctorsName
    }
  });

  const { pagination, handleTableChange } = useSetTablePagination(formattedPatientDischargeRequests);

  const handleInitiateDischarge = (record) => {
    confirm({
      title: 'Confirm Initiate Discharge',
      content: `Are you sure you want to initiate discharge for ${record?.Search_Name}?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        return new Promise((resolve, reject) => {
          handleInitiateDischargeAction(record)
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  }

  const handleInitiateDischargeAction = async (record) => {
    try {
      const result = await dispatch(
        postInitiateDischargeSlice('/Inpatient/InitiateDischarge', {
          admissionNo: record?.AdmissionNo,
        })
      );

      if (result.type === POST_INITIATE_DISCHARGE_SUCCESS) {
        message.success(
          result.payload.message || `${record?.Search_Name} discharge initiated successfully!`
        );
        dispatch(getPgInpatientDischargeRequestsSlice());
        setSelectedPatient(record);
        setDiagnosisModalVisible(true);
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_INITIATE_DISCHARGE_FAILURE) {
        message.error(
          result.payload.message || 'An error occurred while initiating patient discharge, please try again.'
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || 'Unexpected error occurred');
      return Promise.reject(); // Reject on unexpected errors
    }
  }

  const handleAddDiagnosis = (values) => {
    // Handle adding primary/secondary diagnosis and remarks
    console.log("Final Diagnosis Added:", values);
    // Add logic to save the diagnosis data
  }

  const diagnosisColumns = [
    { title: 'Diagnosis Type', dataIndex: 'diagnosisType', key: 'diagnosisType' },
    { title: 'Diagnosis', dataIndex: 'diagnosis', key: 'diagnosis' },
    { title: 'Remarks', dataIndex: 'remarks', key: 'remarks' },
  ];

  const handleCancelDiagnosisModal = () => {
    setDiagnosisModalVisible(false);
    setSelectedPatient(null);
  }

  useEffect(() => {
    dispatch(getPgInpatientDischargeRequestsSlice());
  }, [dispatch]);

  useEffect(() => {
    if (!data.length) {
      dispatch(listDoctors());
    }
  }, [dispatch, data.length]);

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <Space style={{ color: "#0f5689", display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px" }}>
        <ProfileOutlined />
        <Typography.Text style={{ fontWeight: "bold", color: "#0f5689", fontSize: "16px" }}>
          Discharge Request List
        </Typography.Text>
      </Space>

      <Card style={{ padding: '10px 10px 10px 10px' }}>
        <div className="admit-patient-filter-container">
          <Input placeholder="search by name" allowClear showCount showSearch />
          <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>or</span>
          <Input placeholder="search by patient no" allowClear showCount showSearch />
          <span style={{ color: 'gray', fontSize: '14px', fontWeight: 'bold' }}>or</span>
          <Input placeholder="search by id number" allowClear showCount showSearch />
        </div>
      </Card>

      {loadingGetInpatientDischargeRequests || loading ? <Loading /> : (
        <Table
          rowKey="SystemId"
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={formattedPatientDischargeRequests}
          className="admit-patient-table"
          bordered size='middle'
          pagination={{
            ...pagination,
            total: formattedPatientDischargeRequests?.length,
            showSizeChanger: true,
            showQuickJumper: true,
            position: ['bottom', 'right'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
            onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
            style: { marginTop: '30px' }
          }}
        />
      )}

      {/* Diagnosis Modal */}
      <Modal
        title={<Card.Header>{selectedPatient?.Search_Name}'s Details</Card.Header>}
        visible={isDiagnosisModalVisible}
        onCancel={handleCancelDiagnosisModal}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleAddDiagnosis}>
          <Form.Item name="primaryDiagnosis" label="Primary Diagnosis" rules={[{ required: true, message: 'Please input the primary diagnosis!' }]}>
            <Input placeholder="Enter Primary Diagnosis" />
          </Form.Item>

          <Form.Item name="secondaryDiagnosis" label="Secondary Diagnosis">
            <Input placeholder="Enter Secondary Diagnosis" />
          </Form.Item>

          <Form.Item name="remarks" label="Final Remarks">
            <Input.TextArea placeholder="Enter remarks" rows={4} />
          </Form.Item>

          <Button type="primary" htmlType="submit">Add Diagnosis</Button>
        </Form>

        <Table
          columns={diagnosisColumns}
          dataSource={diagnosisData}
          rowKey="diagnosisType"
          pagination={false}
          style={{ marginTop: '20px' }}
        />
      </Modal>
    </div>
  );
};

export default DischargeRequests;

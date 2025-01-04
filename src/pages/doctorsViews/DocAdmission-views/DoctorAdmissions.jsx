import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Space,
  Table,
  Typography,
} from "antd";
import { ProfileOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import { getTriageWaitingList } from "../../../actions/triage-actions/getTriageWaitingListSlice";
import { saveAdmissionDetails } from "../../../actions/Doc-actions/postAdmissionRequest";
import { listDoctors } from "../../../actions/DropdownListActions";
import { getConsultationRoomListSlice } from "../../../actions/nurse-actions/getConsultationRoomSlice";
import Loading from "../../../partials/nurse-partials/Loading";
import AdmissionsSummaryCard from "./AdmissionsSummaryCard";
import { postPatientAdmission } from "../../../actions/Doc-actions/Admission/postAdmitPatient";
import { verifyPatientAdmission } from "../../../actions/Doc-actions/Admission/postAdmissionVerification";
import { cancelPatientAdmission } from "../../../actions/Doc-actions/Admission/cancelPatientAdmission";
import { getPendingAdmissionsList } from "../../../actions/Doc-actions/Admission/getPendingAdmissions";
import moment from "moment";

const DoctorAdmissions = () => {
  const { loading } = useSelector((state) => state.saveAdmissionDetails);
  const { loading: postPatientAdmissionLoading } = useSelector(
    (state) => state.postAdmitPatient
  );

  const { loading: postAdmissionVerificationLoading } = useSelector(
    (state) => state.postAdmissionVerification
  );

  const { loading: getPendingAdmissionsLoading, data } = useSelector(
    (state) => state.getPendingAdmissions
  );

  const { loading: postAdmissionCancellingLoading } = useSelector(
    (state) => state.cancelPatientAdmission
  );

 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form] = Form.useForm();

  const showModal = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
        dateOfAdmission: moment(), // Set current date
        admissionReason: record?.Remarks || "", // Use Remarks from the record
        admissionRemarks: record?.Admission_Remarks || "",
      });
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const formData = await form.validateFields();
    handlePatientAdmission(formData);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const dispatch = useDispatch();


  useEffect(() => {
   dispatch(getPendingAdmissionsList());
  }, [dispatch]);
  const columns = [
    {
      title: "Admission No",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },
    {
      title: "Patient Names",
      dataIndex: "Patient_Name",
      key: "Patient_Name",
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => showModal(record)}
            style={{ color: "#0f5689" }}
          >
            {record.Patient_Name}
          </Button>
        );
      },
    },
    {
      title: "Request Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Doctor",
      dataIndex: "LinkType",
      key: "LinkType",
    },
    {
      title: "Admission Reason",
      dataIndex: "Remarks",
      key: "Remarks",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="d-flex justify-content-between align-items-start gap-2">
            <Button type="primary" onClick={() => showModal(record)}>
              Admit Patient
            </Button>

            <Button
              type="primary"
              onClick={() => handleCancelAdmission(record)}
              danger
            >
              Cancel Admission
            </Button>
          </div>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleAdmitPatient = () => {
    dispatch(postPatientAdmission(selectedRecord?.No));
  };

  const handleAdmissionVerification = () => {
    dispatch(verifyPatientAdmission(selectedRecord?.No));
  };
  const handleCancelAdmission = (record) => {
    setSelectedRecord(record); // Set the selected patient for cancellation
    dispatch(cancelPatientAdmission(record.No));
  };

  const paginatedData = data.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handlePatientAdmission = (values) => {
    const admissionObject = {
      myAction: "create",
      treatmentNo: selectedRecord?.treatmentNo, // Use selectedRecord for treatmentNo
      dateOfAdmission: values.dateOfAdmission,
      admissionReason: values.admissionReason,
      admissionRemarks: values.admissionRemarks,
    };

    if (admissionObject.dateOfAdmission) {
      const formattedDate = new Date(admissionObject.dateOfAdmission)
        .toISOString()
        .split("T")[0];
      admissionObject.dateOfAdmission = formattedDate;
    }

    dispatch(saveAdmissionDetails(admissionObject));

    form.resetFields();
  };
  
  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "10px",
          position: "relative",
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: "bold", color: "#0f5689", fontSize: "16px" }}
        >
          Admissions
        </Typography.Text>
      </Space>
      <AdmissionsSummaryCard />
      <Card style={{ padding: "10px 10px 10px 10px" }}>
        <div className="admit-patient-filter-container">
          <Input placeholder="search by name" allowClear showCount showSearch />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input
            placeholder="search by patient no"
            allowClear
            showCount
            showSearch
          />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Input
            placeholder="search by id number"
            allowClear
            showCount
            showSearch
          />
        </div>
      </Card>

      {getPendingAdmissionsLoading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          className="admit-patient-table"
          bordered
          size="middle"
          pagination={{
            ...pagination,
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

      <Modal
        title="Patient Admission Form"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <>
            <Button
              key="submit"
              type="primary"
              loading={postPatientAdmissionLoading}
              onClick={handleAdmitPatient}
            >
              Admit Patient
            </Button>

            <Button
              key="verify"
              type="primary"
              loading={postAdmissionVerificationLoading}
              onClick={handleAdmissionVerification}
            >
              Verify Admission
            </Button>

            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
          </>,
        ]}
      >
        <Form
          layout="vertical"
          style={{ paddingTop: "10px" }}
          form={form}
          initialValues={{
            dateOfAdmission: moment(),
            admissionReason: "",
            admissionRemarks: "",
          }}
        >
          <Form.Item
            label="Date of Admission"
            name="dateOfAdmission"
            rules={[
              {
                required: true,
                message: "Please enter the date of admission!",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Admission Reason"
            name="admissionReason"
            value={selectedRecord?.Admission_Reason}        
            rules={[
              { required: true, message: "Please enter the admission reason!" },
              {
                validator: (_, value) => {
                  if (value && value.length > 100) {
                    return Promise.reject(
                      new Error(
                        "Admission reason cannot exceed 150 characters!"
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.TextArea placeholder="Admission Reason" />
          </Form.Item>

         
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorAdmissions;

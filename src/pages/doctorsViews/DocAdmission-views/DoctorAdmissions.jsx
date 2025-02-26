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
import {
  ProfileOutlined,
  FileExclamationOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
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
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import { exportToExcel, printToPDF } from "../../../utils/helpers";

const DoctorAdmissions = () => {
  const { loading } = useSelector((state) => state.saveAdmissionDetails);
  const [selectedRow, setSelectedRow] = useState([]);

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
      title: "Request Person",
      dataIndex: "LinkType",
      key: "LinkType",
    },
    {
      title: "Admission Reason",
      dataIndex: "Remarks",
      key: "Remarks",
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: data.length,
  });
  const rowSelection = {
    type: "checkbox", // or 'checkbox' depending on your use case
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRecord(selectedRows[0]); // Assuming single row selection
      setSelectedRowKey(selectedRowKeys[0]);
    },
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleAdmitPatient = () => {
    dispatch(postPatientAdmission(selectedRecord?.No));
  };

  const handleAdmissionVerification = (record) => {
    if (record) {
      setSelectedRecord(record);
      console.log(selectedRecord?.No);
      Modal.confirm({
        title: "Are you sure you want to verify admission?",
        content: `Do you want to verify the admission for ${selectedRecord?.Patient_Name}?`,
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          dispatch(verifyPatientAdmission(record?.No));
        },
      });
    }
  };

  const handleCancelAdmission = (record) => {
    setSelectedRecord(record); // Set the selected patient for cancellation

    // Show confirmation modal before dispatching cancel action
    Modal.confirm({
      title: "Are you sure you want to cancel admission?",
      content: `Do you want to cancel the admission for ${record.Patient_Name}?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        dispatch(cancelPatientAdmission(record.No));
      },
    });
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
        <div className="admit-patient-table-container mt-2">
          <div className="d-flex justify-content-between gap-2 align-items-center">
            <Space className="admit-patient-button-container">
              <Button
                key="verify"
                type="primary"
                loading={postAdmissionVerificationLoading}
                onClick={handleAdmissionVerification}
              >
                Verify Admission
              </Button>
              <Button
                type="default"
                onClick={() => handleCancelAdmission(selectedRecord)} // Pass the selected record here
                danger
              >
                Cancel Admission
              </Button>
            </Space>
            {/* <Space className="admit-patient-button-container">
              <Button
                type="primary"
                onClick={() =>
                  exportToExcel(
                    data,
                    "Admission request success list",
                    "admission-request-success-list.xlsx"
                  )
                }
              >
                <FileExclamationOutlined /> Export Excel
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  printToPDF(data, "Admission request success list")
                }
              >
                <PrinterOutlined /> Print PDF
              </Button>
            </Space> */}
          </div>
          <Table
            scroll={{ x: "max-content", scrollbar: false }}
            columns={columns}
            dataSource={data}
            rowKey="SystemId"
            className="admit-patient-table"
            bordered
            rowSelection={rowSelection} // Ensure rowSelection is an object with necessary props
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
                zIndex: 0,
              },
            }}
          />
        </div>
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
                message: "Please enter date of admission",
              },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              showTime
              className="full-width-input"
            />
          </Form.Item>

          <Form.Item
            label="Admission Reason"
            name="admissionReason"
            rules={[
              {
                required: true,
                message: "Please provide the reason for admission",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Enter admission reason" />
          </Form.Item>

          <Form.Item
            label="Admission Remarks"
            name="admissionRemarks"
            rules={[
              {
                required: true,
                message: "Please provide admission remarks",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Enter admission remarks" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorAdmissions;

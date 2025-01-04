import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import { ProfileOutlined,CloseCircleOutlined } from "@ant-design/icons";
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
import { getVerifiedAdmissions } from "../../../actions/Doc-actions/Admission/getVerifiedAdmissions";
import { useNavigate } from "react-router-dom";
import { getPatientDetails } from "../../../actions/Doc-actions/OutPatientAction";
const VerifiedAdmission = () => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.saveAdmissionDetails);
  const { loading: postPatientAdmissionLoading } = useSelector(
    (state) => state.postAdmitPatient
  );

  const { loading: postAdmissionVerificationLoading } = useSelector(
    (state) => state.postAdmissionVerification
  );

  const { loading: postAdmissionCancellingLoading } = useSelector(
    (state) => state.cancelPatientAdmission
  );
  const { loading: getVerifiedAdmissionLoading, admissions } = useSelector(
    (state) => state.getVerifiedAdmissionList
  );
  const { loadingPatientDetails, patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );

  const [selectedRecord, setSelectedRecord] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!admissions.length) {
      dispatch(getVerifiedAdmissions());
    }
  }, [dispatch, admissions.length]);

  useEffect(() => {
    if (!loadingPatientDetails) {
      dispatch(getPatientDetails(selectedRecord?.PatientNo));
    }
  }, [dispatch, loadingPatientDetails, selectedRecord?.PatientNo]);

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
      dataIndex: "Names",
      key: "Names",
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() =>
              navigate(
                `/Doctor/Inpatient/Patient-card?treatmentNo=${record.No}`,
                { state: { patientDetails: patientDetails } }
              )
            }
            style={{ color: "#0f5689" }}
          >
            {record.Names}
          </Button>
        );
      },
    },
    {
      title: "Admission Date",
      dataIndex: "Date",
      key: "Date",
    },
    
    {
      title: "Doctor",
      dataIndex: "LinkType",
      key: "LinkType",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <div className="d-flex justify-content-between align-items-start gap-2">
            <Button
              type="primary"
              onClick={() =>
                navigate(
                  `/Doctor/Inpatient/Patient-card?treatmentNo=${record.No}`,
                  { state: { patientDetails: patientDetails } }
                )
              }
            >
                <ProfileOutlined />
              View Details
            </Button>
<Popconfirm
  title="Are you sure you want to cancel this admission?"
    onConfirm={() => {
      setSelectedRecord(record);
      dispatch(cancelPatientAdmission(record.No));
    }}
    okText="Yes"
    cancelText="No"
  >  <Button type="primary" danger>
  <CloseCircleOutlined />
  Cancel Admission
</Button>
</Popconfirm>

           
          </div>
        );
      },
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: admissions.length,
  });

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const paginatedData = admissions.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

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

      {getVerifiedAdmissionLoading ? (
        <Loading />
      ) : (
        <Table
          columns={columns}
          dataSource={admissions}
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

     
    </div>
  );
};

export default VerifiedAdmission;

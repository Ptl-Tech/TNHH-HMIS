import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Button,
  Table,
  Modal,
  message,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  PayCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPgAdmissionsVerifiedSlice } from "../../actions/nurse-actions/getPgAdmissionsVerifiedSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
import {
  POST_CANCEL_ADMISSION_FAILURE,
  POST_CANCEL_ADMISSION_SUCCESS,
  postCancelAdmissionSlice,
} from "../../actions/nurse-actions/postCancelAdmissionSlice";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import useSetTablePagination from "../../hooks/useSetTablePagination";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterInpatientList from "../../partials/nurse-partials/FilterInpatientList";
import { postPatientAdmission } from "../../actions/Doc-actions/Admission/postAdmitPatient";

const AdmitPatients = () => {
  const navigate = useNavigate();
  const { loadingGetPatientAdmissions, getPatientAdmissions } = useSelector(
    (state) => state.getPgAdmissionVerified
  );
  const { loading, data } = useSelector((state) => state.getDoctorsList);
  const { selectedRow, selectedRowKey, rowSelection } =
    useSetTableCheckBoxHook();
  const [searchName, setSearchName] = useState("");
  const [searchPatientNumber, setSearchPatientNumber] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");

  const dispatch = useDispatch();
  const { confirm } = Modal;

  const columns = [
    {
      title: "Adm No",
      dataIndex: "No",
      key: "No",
      fixed: "left",
      width: 100,
      filteredValue: searchAdmissionNumber ? [searchAdmissionNumber] : null,
      onFilter: (value, record) =>
        record?.No
          ? record.No.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
      onFilter: (value, record) =>
        record?.PatientNo
          ? record.PatientNo.toLowerCase().includes(value.toLowerCase())
          : false,
    },
    {
      title: "Patient Names",
      dataIndex: "Names",
      key: "Names",
      filteredValue: searchName ? [searchName] : null,
      onFilter: (value, record) =>
        record?.SearchName
          ? record.SearchName.toLowerCase().includes(value.toLowerCase())
          : false,
      render: (_, record) => {
        return (
          <Typography.Text style={{ color: "#0f5689" }}>
            {record.Names}
          </Typography.Text>
        );
      },
    },
    {
      title: "Adm Date",
      dataIndex: "Date",
      key: "Date",
      sorter: (a, b) => new Date(a.Date) - new Date(b.Date),
      defaultSortOrder: "descend",
      render: (_, record) => {
        return (
          <Typography.Text style={{ color: "#0f5689" }}>
            {record.Date}
          </Typography.Text>
        );
      },
    },

    {
      title: "Doctor",
      dataIndex: "DoctorName",
      key: "DoctorName",
      render: (_, record) => {
        return (
          <Typography.Text style={{ color: "#0f5689" }}>
            {record.DoctorName}
          </Typography.Text>
        );
      },
    },
    {
      title: "Remarks",
      dataIndex: "Remarks",
      key: "Remarks",
      fixed: "right",
      width: 150,
    },
  ];

  const formattedDoctorDetails = useMemo(() => {
    return data?.map((doctor) => ({
      DoctorID: doctor.DoctorID,
      DoctorsName: doctor.DoctorsName,
    }));
  }, [data]);

  const formattedPatientAdmissions = useMemo(() => {
    return getPatientAdmissions?.map((admission) => {
      const matchDoctorName = formattedDoctorDetails.find(
        (doctor) => doctor.DoctorID === admission.Doctor
      );
      return {
        ...admission,
        DoctorName: matchDoctorName?.DoctorsName,
      };
    });
  }, [getPatientAdmissions, formattedDoctorDetails]);

  const { pagination, handleTableChange } = useSetTablePagination(
    formattedPatientAdmissions
  );

  console.log("formattedPatientAdmissions", formattedPatientAdmissions);

  // const handleAdmitPatient = () => {

  //   selectedRow[0]?.PatientNo &&  navigate(`/Dashboard/Admit-patient/Patient?PatientNo=${selectedRow[0].PatientNo}`, {
  //     state: { patientDetails: selectedRow[0] }
  //   });
  // }

  const handleAdmitPatient = async () => {
    confirm({
      title: "Confirm Patient Admission",
      content: `Are you sure you want to admit ${selectedRow[0]?.Names} ?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleAdmitPatientAction(selectedRow[0])
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  };

  const handleAdmitPatientAction = async (patientDetails) => {
    try {
      await dispatch(
        postPatientAdmission({ admissionNo: patientDetails?.No })
      ).then((data) => {
        if (data) {
          message.success("Patient admitted successfully");
          navigate(`/Dashboard/Inpatient`);
        } else {
          message.error("Patient admission failed");
        }
      });
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
    }
  };

  const handlePatientCharges = () => {
    selectedRow[0]?.patientNo &&
      navigate(
        `/Dashboard/Admit-patient/Charges?PatientNo=${selectedRow[0].patientNo}`
      );
  };

  const handleCancelAdmission = () => {
    confirm({
      title: "Confirm Cancel Admission",
      content: `Are you sure you want to cancel admission for ${selectedRow[0]?.Names} ?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleCancelAdmissionAction()
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  };

  const handleCancelAdmissionAction = async () => {
    try {
      const result = await dispatch(
        postCancelAdmissionSlice({
          admissionNo: selectedRow[0]?.No,
        })
      );

      if (result.type === POST_CANCEL_ADMISSION_SUCCESS) {
        message.success(
          result.payload.message ||
            `You have cancelled admission for ${selectedRow[0]?.Names} successfully!`
        );
        dispatch(getPgAdmissionsVerifiedSlice());
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_CANCEL_ADMISSION_FAILURE) {
        message.error(
          result.payload.message ||
            "An error occurred while cancelling patient admission, please try again."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };

  useEffect(() => {
    dispatch(getPgAdmissionsVerifiedSlice());
  }, [dispatch]);

  useEffect(() => {
    if (!data.length) {
      dispatch(listDoctors());
    }
  }, [dispatch, data.length]);

  return (
    <Row style={{ margin: "20px 10px 10px 10px" }}>
      <Col span={24}>
        <NurseInnerHeader
          title="Patient Admissions List"
          icon={<InboxOutlined />}
        />

        <FilterInpatientList
          setSearchName={setSearchName}
          setSearchPatientNumber={setSearchPatientNumber}
          setSearchAdmissionNumber={setSearchAdmissionNumber}
        />

        <Card className="admit-patient-card-container">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Space className="admit-patient-button-container">
              <Button
                type="primary"
                size="large"
                disabled={!selectedRowKey}
                onClick={handleAdmitPatient}
              >
                <PlusOutlined /> Admit Patient
              </Button>
              <Button
                color="danger"
                size="large"
                variant="outlined"
                disabled={!selectedRowKey}
                onClick={handleCancelAdmission}
              >
                <CloseOutlined /> Cancel Admission
              </Button>
              <Button
                type="primary"
                size="large"
                disabled={!selectedRowKey}
                onClick={handlePatientCharges}
              >
                <PayCircleOutlined /> Charges
              </Button>
            </Space>
            {/* <Space className="admit-patient-button-container">
                            <Button type="primary" onClick={()=>exportToExcel(formattedPatientAdmissions, 'Admission request success list', 'admission-request-success-list.xlsx')}><FileExclamationOutlined /> Export Excel</Button>
                            <Button type="primary" onClick={()=>printToPDF(formattedPatientAdmissions, 'Admission request success list')}><PrinterOutlined /> Print PDF</Button>
                        </Space> */}
          </div>
        </Card>

        {loadingGetPatientAdmissions || loading ? (
          <Loading />
        ) : (
          <Table
            rowKey="SystemId"
            scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={formattedPatientAdmissions}
            className="admit-patient-table"
            rowSelection={rowSelection}
            bordered
            size="middle"
            pagination={{
              ...pagination,
              total: formattedPatientAdmissions?.length,
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
      </Col>
    </Row>
  );
};

export default AdmitPatients;

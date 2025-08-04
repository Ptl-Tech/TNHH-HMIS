import { Button, Card, Input, Space, Table, Typography } from "antd";
import {
  ProfileOutlined,
  VerticalAlignTopOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  ExperimentOutlined,
  PrinterOutlined,
  FileExclamationOutlined,
  DeliveredProcedureOutlined,
} from "@ant-design/icons";

import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loading from "../../../partials/nurse-partials/Loading";

import { cancelPatientAdmission } from "../../../actions/Doc-actions/Admission/cancelPatientAdmission";
import { useNavigate } from "react-router-dom";
import { getPatientDetails } from "../../../actions/Doc-actions/OutPatientAction";
import { getAdmittedPatients } from "../../../actions/Doc-actions/Admission/getAdmittedPatients";
import {
  POST_CANCEL_DISCHARGE_FAILURE,
  POST_CANCEL_DISCHARGE_SUCCESS,
  postCancelDischargeSlice,
} from "../../../actions/nurse-actions/postCancelDischargeSlice";
import {
  POST_DISCHARGE_PATIENT_FAILURE,
  POST_DISCHARGE_PATIENT_SUCCESS,
  postPostDischargeSlice,
} from "../../../actions/nurse-actions/postPostDischargeSlice";

import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";

const AdmittedPatients = () => {
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
  const { loading: getAdmissionLoading, admissions } = useSelector(
    (state) => state.getAdmissionList
  );
  const { loadingPatientDetails, patientDetails } = useSelector(
    (state) => state.getPatientDetails
  );

  const [selectedRecord, setSelectedRecord] = useState(null);
  const {
    setIsButtonDisabled,
    setSelectedRowKey,
    selectedRowKey,
    rowSelection,
  } = useSetTableCheckBoxHook();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!admissions.length) {
      dispatch(getAdmittedPatients());
    }
  }, [dispatch, admissions.length]);

  useEffect(() => {
    if (!loadingPatientDetails) {
      dispatch(getPatientDetails(selectedRecord?.PatientNo));
    }
  }, [dispatch, loadingPatientDetails, selectedRecord?.PatientNo]);

  const handleDischargePatient = () => {
    confirm({
      title: "Confirm Patient Discharge",
      content: `Are you sure you want to discharge ${selectedRow[0]?.Search_Names}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleDischargePatientAction()
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  };

  const handleDischargePatientAction = async () => {
    try {
      const result = await dispatch(
        postPostDischargeSlice("/Inpatient/PostDischarge", {
          admissionNo: selectedRow[0]?.AdmissionNo,
        })
      );

      if (result.type === POST_DISCHARGE_PATIENT_REQUEST) {
        message.success(
          result.payload.message ||
            `${selectedRow[0]?.Search_Names} discharged successfully!`
        );

        setSelectedRowKey(null);
        setSelectedRow([]);
        setIsButtonDisabled(true);
        dispatch(getPgInpatientDischargeListSlice());
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_DISCHARGE_PATIENT_FAILURE) {
        message.error(
          result.payload.message ||
            "An error occurred while discharging the patient, please try again later."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };

  const handlePostedConsumables = () => {
    if (selectedRow[0]?.AdmissionNo) {
      navigate(
        `/Dashboard/Discharge-list/Posted-Consumables?AdmNo=${selectedRow[0].AdmissionNo}`,
        {
          state: { patientDetails: selectedRow[0] },
        }
      );
    }
  };

  const handleCancelDischarge = () => {
    confirm({
      title: "Confirm Cancel Discharge",
      content: `Are you sure you want to cancel ${selectedRow[0]?.Search_Names} discharge?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleCancelDischargeAction()
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  };

  const handleCancelDischargeAction = async () => {
    try {
      const result = await dispatch(
        postCancelDischargeSlice("/Inpatient/CancelDischarge", {
          admissionNo: selectedRow[0]?.AdmissionNo,
        })
      );

      if (result.type === POST_CANCEL_DISCHARGE_SUCCESS) {
        message.success(
          result.payload.message ||
            `${selectedRow[0]?.Search_Names} discharge cancelled successfully!`
        );
        setSelectedRowKey(null);
        setSelectedRow([]);
        setIsButtonDisabled(true);
        dispatch(getPgInpatientDischargeListSlice());
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_CANCEL_DISCHARGE_FAILURE) {
        message.error(
          result.payload.message ||
            "An error occurred while cancelling discharge, please try again."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };
  const handleCancelAdmission = () => {
    if (selectedRecord) {
      Modal.confirm({
        title: "Are you sure you want to cancel this admission?",
        onOk: () => {
          if (selectedRecord) {
            dispatch(cancelPatientAdmission(selectedRecord.No)); // Dispatch action to cancel the admission
          }
        },
        okText: "Yes",
        cancelText: "No",
      });
    }
  };

  const columns = [
    {
      title: "Admission No",
      dataIndex: "Admission_No",
      key: "Admission_No",
    },
    {
      title: "Patient No",
      dataIndex: "Patient_No",
      key: "Patient_No",
    },
    {
      title: "Patient Names",
      dataIndex: "PatientName",
      key: "PatientName",
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() =>
              navigate(
                `/Dashboard/Inpatient/Patient-card?treatmentNo=${record.Admission_No}`,
                { state: { patientDetails: patientDetails } }
              )
            }
            style={{ color: "#0f5689" }}
          >
            {record.PatientName}
          </Button>
        );
      },
    },
    {
      title: "Admission Date",
      dataIndex: "Admission_Date",
      key: "Admission_Date",
    },
    {
      title: "Admission Time",
      dataIndex: "Admission_Time",
      key: "Admission_Time",
      render: (time) => {
        if (!time) return "-"; // Handle empty or null values
        const date = new Date(`1970-01-01T${time}Z`); // Create a date object
        const options = { hour: "numeric", minute: "numeric", hour12: true }; // Formatting options
        return date.toLocaleTimeString("en-US", options); // Format time to AM/PM
      },
    },

    {
      title: "Admission Area",
      dataIndex: "Admission_Area",
      key: "Admission_Area",
    },
    {
      title: "Admission Reason",
      dataIndex: "Admission_Reason",
      key: "Admission_Reason",
    },
    {
      title: "Expected Date of Discharge",
      dataIndex: "Expected_Date_of_Discharge",
      key: "Expected_Date_of_Discharge",
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
                  `/Dashboard/Inpatient/Patient-card?treatmentNo=${record.No}`,
                  { state: { patientDetails: patientDetails } }
                )
              }
            >
              <ProfileOutlined />
              View Details
            </Button>
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

      {getAdmissionLoading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex justify-content-start my-3 align-items-start gap-2">
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handleDischargePatient}
            >
              <VerticalAlignTopOutlined /> Discharge Patient
            </Button>
            <Button
              color="danger"
              variant="outlined"
              disabled={!selectedRowKey}
              onClick={handleCancelDischarge}
            >
              <CloseOutlined /> Cancel Discharge
            </Button>
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handlePostedConsumables}
            >
              <ExperimentOutlined /> Posted Consumables
            </Button>

            <Button type="primary" danger>
              <CloseCircleOutlined onClick={handleCancelAdmission} />
              Cancel Admission
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={admissions}
            className="admit-patient-table"
            bordered
            rowKey="SystemId"
            rowSelection={rowSelection}
            size="small"
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
        </>
      )}
    </div>
  );
};

export default AdmittedPatients;

import { Button, Card, Space, Typography, Modal, message } from "antd";
import {
  ProfileOutlined,
  VerticalAlignTopOutlined,
  CloseOutlined,
  ExperimentOutlined,
  DeliveredProcedureOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { getPgInpatientDischargeListSlice } from "../../actions/nurse-actions/getPgInpatientDischargeListSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import { useNavigate } from "react-router-dom";
import {
  POST_DISCHARGE_PATIENT_FAILURE,
  POST_DISCHARGE_PATIENT_SUCCESS,
  postPostDischargeSlice,
} from "../../actions/nurse-actions/postPostDischargeSlice";
import {
  POST_RELEASE_BED_FAILURE,
  POST_RELEASE_BED_SUCCESS,
  postReleaseBedSlice,
} from "../../actions/nurse-actions/postReleaseBedSlice";
import {
  POST_CANCEL_DISCHARGE_FAILURE,
  POST_CANCEL_DISCHARGE_SUCCESS,
  postCancelDischargeSlice,
} from "../../actions/nurse-actions/postCancelDischargeSlice";
import useSetTablePagination from "../../hooks/useSetTablePagination";
import useSetTableCheckBoxHook from "../../hooks/useSetTableCheckBoxHook";
import FilterInpatientList from "../../partials/nurse-partials/FilterInpatientList";
import DischargeTable from "./tables/nurse-tables/DischargeTable";

const DischargeList = () => {
  const { loadingGetPatientDischargeList, getPatientDischargeList } =
    useSelector((state) => state.getPgInpatientDischargeList);
  const { confirm } = Modal;
  const {
    setIsButtonDisabled,
    setSelectedRowKey,
    selectedRowKey,
    selectedRow,
    setSelectedRow,
    rowSelection,
  } = useSetTableCheckBoxHook();
  const [searchName, setSearchName] = useState("");
  const [searchPatientNumber, setSearchPatientNumber] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, data } = useSelector((state) => state.getDoctorsList);

  const formattedDoctorDetails = useMemo(() => {
    return data.map((doctor) => ({
      DoctorID: doctor.DoctorID,
      DoctorsName: doctor.DoctorsName,
    }));
  }, [data]);

  const formattedPatientDischargeList = useMemo(() => {
    // Create a Map for quick lookups other than using find method
    const doctorMap = new Map(
      formattedDoctorDetails.map((doctor) => [
        doctor.DoctorID,
        doctor.DoctorsName,
      ])
    );

    return getPatientDischargeList.map((discharge) => ({
      ...discharge,
      DoctorName: doctorMap.get(discharge?.DoctorsName) || "",
    }));
  }, [getPatientDischargeList, formattedDoctorDetails]);

  const { pagination, handleTableChange } = useSetTablePagination(
    formattedPatientDischargeList
  );

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

      if (result.type === POST_DISCHARGE_PATIENT_SUCCESS) {
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
          result?.payload?.response?.data?.errors ||
            result?.payload?.message ||
            "An error occurred while discharging the patient, please try again later."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };

  const handleReleaseBed = () => {
    confirm({
      title: "Confirm Bed Release",
      content: `Are you sure you want to release bed ${selectedRow[0]?.BedNo} of ${selectedRow[0]?.WardNo}?`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        return new Promise((resolve, reject) => {
          handleReleaseBedAction()
            .then(resolve) // Resolve the modal when successful
            .catch(reject); // Reject on failure
        });
      },
    });
  };

  const handleReleaseBedAction = async () => {
    try {
      const result = await dispatch(
        postReleaseBedSlice({ admissionNo: selectedRow[0]?.AdmissionNo })
      );

      if (result.type === POST_RELEASE_BED_SUCCESS) {
        message.success(
          result.payload.message ||
            `${selectedRow[0]?.BedNo} released successfully!`
        );
        setSelectedRowKey(null);
        setSelectedRow([]);
        setIsButtonDisabled(true);
        dispatch(getPgInpatientDischargeListSlice());
        return Promise.resolve(); // Resolve the Promise to close the modal
      } else if (result.type === POST_RELEASE_BED_FAILURE) {
        message.error(
          result?.payload?.response?.data?.errors ||
            result?.payload?.message ||
            "An error occurred while releasing bed, please try again."
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
        `/Nurse/Discharge-list/Posted-Consumables?AdmNo=${selectedRow[0].AdmissionNo}`,
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
          result?.payload?.response?.data?.errors ||
            result?.payload?.message ||
            "An error occurred while cancelling discharge, please try again."
        );
        return Promise.reject(); // Reject the Promise to keep the modal open
      }
    } catch (error) {
      message.error(error.message || "Unexpected error occurred");
      return Promise.reject(); // Reject on unexpected errors
    }
  };

  useEffect(() => {
    // Fetch patient discharge list
    dispatch(getPgInpatientDischargeListSlice());
  }, [dispatch]);

  useEffect(() => {
    if (!data.length) {
      dispatch(listDoctors());
    }
  }, [dispatch, data.length]);

  return (
    <div style={{ margin: "20px 10px 10px 10px" }}>
      <Space
        style={{
          color: "#0f5689",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "10px",
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: "bold", color: "#0f5689", fontSize: "16px" }}
        >
          Discharge List
        </Typography.Text>
      </Space>

      <Card className="admit-patient-card-container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Space className="admit-patient-button-container">
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
              onClick={handleReleaseBed}
            >
              <DeliveredProcedureOutlined /> Release Bed
            </Button>
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handlePostedConsumables}
            >
              <ExperimentOutlined /> Posted Consumables
            </Button>
          </Space>
        </div>
      </Card>

      <FilterInpatientList
        setSearchName={setSearchName}
        setSearchPatientNumber={setSearchPatientNumber}
        setSearchAdmissionNumber={setSearchAdmissionNumber}
      />

      <DischargeTable
        loadingGetPatientDischargeList={loadingGetPatientDischargeList}
        loading={loading}
        rowSelection={rowSelection}
        searchName={searchName}
        searchPatientNumber={searchPatientNumber}
        searchAdmissionNumber={searchAdmissionNumber}
        pagination={pagination}
        handleTableChange={handleTableChange}
        formattedPatientDischargeList={formattedPatientDischargeList}
      />
    </div>
  );
};

export default DischargeList;

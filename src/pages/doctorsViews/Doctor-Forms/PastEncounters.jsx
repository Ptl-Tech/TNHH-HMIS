import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Table, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTriageWaitingList } from "../../../actions/triage-actions/getTriageWaitingListSlice";
import { getOutPatientTreatmentList } from "../../../actions/Doc-actions/OutPatientAction";
import { ProfileOutlined } from "@ant-design/icons";

const PastEncounters = () => {
  const role = useAuth().userData.departmentName;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const patientDetails = location.state?.patientDetails;
  const [pastVisits, setPastVisits] = useState([]);

  const { triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList
  );
  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList);

    useEffect(() => {
      if (!treatmentList || !patients || !patientDetails) return;
    
      // Filter consultations based on role
      const closedConsultationList = treatmentList.filter((item) =>
        role === "Doctor" || role === "Psychology"
          ? item.Status === "Completed" && item.Clinic === "PSYCHIATRIST"
          : item.Status === "Completed"
      );
    
      // Map patient details
      const patientDetailsMap = new Map(
        patients.map((patient) => [
          patient.PatientNo,
          {
            SearchName: patient.SearchName,
            IDNumber: patient.IDNumber,
            Age: patient.AgeinYears,
            PatientType: patient.PatientType,
            Inpatient: patient.Inpatient,
          },
        ])
      );
    
      // Combine consultations with patient details
      const combinedList = closedConsultationList.map((room) => ({
        ...room,
        ...(patientDetailsMap.get(room.PatientNo) || {
          SearchName: "",
          IDNumber: "",
          Age: "",
          PatientType: "",
          Inpatient: "",
        }),
      }));
    
      // Filter based on current patient
      setPastVisits(combinedList.filter((item) => item.PatientNo === patientDetails.PatientNo));
    }, [treatmentList, patients, patientDetails, role]);
    


  useEffect(() => {
    dispatch(getTriageWaitingList());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  const handleNavigate = (record, treatmentNo) => {
    navigate(
      role === "Doctor"
        ? `/Doctor/Consultation-List/Patient?TreatmentNo=${treatmentNo}&PatientNo=${record.PatientNo}`
        : role === "Psychology"
        ? `/Psychology/Consultation-List/Patient?TreatmentNo=${treatmentNo}&PatientNo=${record.PatientNo}`
        : `/Nurse/Consultation-List/Patient?TreatmentNo=${treatmentNo}&PatientNo=${record.PatientNo}`,
      {
        state: {
          patientDetails: record
        },
      }
    );
  };

  const waitingListColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
    },
    {
      title: "Patient Name",
      dataIndex: "SearchName",
      key: "SearchName",
      render: (text, record) => {
        return (
          <span
            onClick={() => handleNavigate(record, record.TreatmentNo)}
            className="fw-bold"
            style={{ color: "#0f5689", cursor: "pointer" }}
          >
            {text.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
    },

    {
      title: "Doctors Name",
      dataIndex: "DoctorsName",
      key: "DoctorsName",
      render: (text, record) => {
        return (
          <span
            onClick={() => handleNavigate(record, record.TreatmentNo)}
            style={{ color: "#0f5689", cursor: "pointer" }}
          >
            {text.toUpperCase()}
          </span>
        );
      },
    },
    {
      title: "Treatment Date",
      dataIndex: "TreatmentDate",
      key: "TreatmentDate",
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
      render: (_, record) => {
        return <span>{record.Age} years</span>;
      },
    },
  ];
  return (
    <div style={{ marginTop: "20px" }}>
    <div style={{ marginBottom: "16px" }}>
    <ProfileOutlined />
      <Typography.Text
        style={{ fontWeight: "bold", color: "#0f5689", fontSize: "14px", marginLeft: "8px" }}
      >
        Past Encounter Notes
      </Typography.Text>
    </div>
      <Table
        columns={waitingListColumns}
        dataSource={pastVisits}
        loading={treatmentListLoading}
        bordered
        size="small"
        pagination={{
          position: ["bottom", "right"],
          showSizeChanger: true,
          pageSize: 10,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </div>
  );
};

export default PastEncounters;

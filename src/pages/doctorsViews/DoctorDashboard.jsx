import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  UserOutlined,
  HourglassOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import moment from "moment";
import { subject } from "@casl/ability";

import { useAuth } from "../../hooks/auth";
import { useAbility } from "../../hooks/casl";

import DashboardCard from "../nurse-view/DashboardCard";
import { listDoctors } from "../../actions/DropdownListActions";
import DashboardStatistics from "../nurse-view/DashboardStatistics";
import { getOutPatientTreatmentList } from "../../actions/Doc-actions/OutPatientAction";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const ability = useAbility();
  const dispatch = useDispatch();

  const { patients: treatmentList } =
    useSelector((state) => state.docTreatmentList) || {};

  const { admittedPatients } =
    useSelector((state) => state.getPgAdmissionsAdmitted) || {};

  const { data } = useSelector((state) => state.getDoctorsList);

  // Fetch data when the component loads
  useEffect(() => {
    dispatch(getTriageWaitingList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPgAdmissionsAdmittedSlice());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listDoctors());
  }, [dispatch]);

  /* 
    Logic on how this works
    Corporate doctors can read only Chiromo's patients
    External doctors can read only their patients
    Nurses can see all patients
  */
  const isExternalDoctor = (doctorId) =>
    ability.can("read", subject("ownVisits", { doctorId })); // External Doctors
  const canReadAllVisits = ability.can("read", "allVisits"); // Nurses & Psychologists
  const canReadCorporateVisits = (Resident_Doctor) =>
    Resident_Doctor && ability.can("read", "corporateVisits"); // Corporate Doctors

  const filterVisits = (status) =>
    (status ? treatmentList : admittedPatients)?.filter(
      (item) =>
        (canReadAllVisits ||
          isExternalDoctor(item.DoctorID) ||
          canReadCorporateVisits(item.Resident_Doctor)) &&
        (status ? item.Status === status : true)
    );

  const inpatients = filterVisits();
  const activeVisitCount = filterVisits("Active");
  const openDoctorVisitList = filterVisits("New");
  const closedVisitCount = filterVisits("Completed");

  // Updated card data for the dashboard
  const cardData = [
    {
      title: "OP Waiting List",
      value: openDoctorVisitList?.length,
      subtitle: "Increase in 30 days",
      icon: <HourglassOutlined />,
      color: "#fff",
      backgroundColor: "#0f5689",
      link: "/Dashboard/Consultation-List",
    },
    {
      title: "Consultation Room",
      value: activeVisitCount?.length, // Use optimized count
      subtitle: "Active Consultations",
      icon: <SafetyOutlined />,
      color: "#000",
      backgroundColor: "#ac8342",
      link: "/Dashboard/PendingConsultationList",
    },
    {
      title: "Closed Consultations",
      value: closedVisitCount?.length, // New card for closed visits
      subtitle: "Completed Consultations",
      icon: <UserOutlined />,
      color: "#000",
      backgroundColor: "#5c85d6",
      link: "/Dashboard/ClosedConsultationList",
    },
    {
      title: "Inpatients List",
      value: inpatients?.length,
      subtitle: "Increase in 30 days",
      icon: <UserAddOutlined />,
      color: "#000",
      backgroundColor: "#b0afaf",
      link: "/Dashboard/Inpatient",
    },
  ];

  // Helper function to count registrations by date
  const countRegistrationsByDate = (patients, dateKey) =>
    patients.reduce((acc, patient) => {
      const date = patient[dateKey];
      if (date && date !== "0001-01-01") {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

  // Registration counts for chart data
  const mergeOutpatients = [
    ...(openDoctorVisitList ? openDoctorVisitList : []),
    ...(activeVisitCount ? activeVisitCount : []),
    ...(closedVisitCount ? closedVisitCount : []),
  ];
  const outPatientCountsByDate = countRegistrationsByDate(
    mergeOutpatients,
    "TreatmentDate"
  );
  const inPatientCountsByDate = countRegistrationsByDate(
    inpatients,
    "Admission_Date"
  );

  // Generate chart data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) =>
    moment().subtract(i, "days").format("YYYY-MM-DD")
  );
  const chartData = last30Days.reverse().flatMap((date) => [
    { date, type: "Outpatient", count: outPatientCountsByDate[date] || 0 },
    { date, type: "Inpatient", count: inPatientCountsByDate[date] || 0 },
  ]);

  return (
    <div style={{ padding: "10px 10px" }}>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {cardData.map((card, index) => (
          <DashboardCard card={card} key={index} />
        ))}
      </div>
      <DashboardStatistics user={user} chartData={chartData} />
    </div>
  );
};

export default DoctorDashboard;

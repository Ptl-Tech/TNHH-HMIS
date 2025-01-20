import { useEffect } from "react";
import {
  UserOutlined,
  HourglassOutlined,
  SafetyOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { getOutPatientTreatmentList } from "../../actions/Doc-actions/OutPatientAction";
import { getPatientListSlice } from "../../actions/nurse-actions/getPatientListSlice";
import DashboardCard from "../nurse-view/DashboardCard";
import DashboardStatistics from "../nurse-view/DashboardStatistics";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const userDetails = useAuth(); // Use the custom hook to get user info
  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList) || {};
  const { triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList
  );
  const openDoctorVisitList = treatmentList?.filter(
    (item) => item.Status === "New"
  );
  // Fetch data when the component loads
  useEffect(() => {
    dispatch(getPatientListSlice());
    dispatch(getTriageWaitingList());
  }, [dispatch]);

  // Selectors to access Redux state

  // Filters for inpatients and outpatients
  const filterInPatients =
  patients?.filter((item) => item.Inpatient === true) || [];
  const filterOutPatients =
  patients?.filter((item) => item.Inpatient === false) || [];
  const openTreatmentList = treatmentList?.filter(
    (item) => item?.Status === "New"
  );
  // Combine treatment list with outpatient list

  const openDoctorVisitListWithPatientDetails = patients?.map((patient) => ({
    PatientNo: patient.PatientNo,
    SearchName: patient.SearchName,
    IDNumber: patient.IDNumber,
    Age: patient.AgeinYears,
    PatientType: patient.PatientType,
    Inpatient: patient.Inpatient,
  }));

  const combinedList = openDoctorVisitList.map((room) => {
    const matchingPatient = openDoctorVisitListWithPatientDetails.find(
      (patient) => patient.PatientNo === room.PatientNo
    );

    return {
      ...room,
      PatientNo: room?.PatientNo,
      SearchName: matchingPatient ? matchingPatient.SearchName : "",
      IDNumber: matchingPatient ? matchingPatient.IDNumber : "",
      Age: matchingPatient ? matchingPatient.Age : "",
      PatientType: matchingPatient ? matchingPatient.PatientType : "",
      Inpatient: matchingPatient ? matchingPatient.Inpatient : "",
    };
  });

  const waitingListTableDataSource = combinedList
    .filter((item) => item.Inpatient !== true)
    ?.map((item, index) => ({
      key: index + 1,
      treatmentNo: item?.TreatmentNo,
      patientNo: item?.PatientNo,
      observationNo: item?.ObservationNo,
      treatmentDate: item?.TreatmentDate,
      treatmentTime: item?.TreatmentTime,
      searchName: item?.SearchName,
      idNumber: item?.IDNumber,
      age: item?.Age,
      patientType: item?.PatientType,
      urgency: item?.UrgencyStatus,
      Inpatient: item?.Inpatient,
    }))
    .sort((a, b) => new Date(a.treatmentDate) - new Date(b.treatmentDate));


  // Card data for the dashboard
  const cardData = [
    {
      title: "OP Waiting List",
      value: waitingListTableDataSource?.length,
      subtitle: "Increase in 30 days",
      icon: <HourglassOutlined />,
      color: "#fff",
      backgroundColor: "#0f5689",
      link: "/Doctor/Consultation-List",
    },

    {
      title: "Consultation Room",
      value: treatmentList?.filter((item) => item.Status === "Active")?.length,
      subtitle: "Increase in 30 days",
      icon: <SafetyOutlined />,
      color: "#000",
      backgroundColor: "#ac8342",
      link: "/Doctor/Consultation-List",
    },
    {
      title: "Inpatients List",
      value: filterInPatients?.length,
      subtitle: "Increase in 30 days",
      icon: <UserAddOutlined />,
      color: "#000",
      backgroundColor: "#b0afaf",
    },
  ];

  // Helper function to count registrations by date
  const countRegistrationsByDate = (patients) =>
    patients.reduce((acc, patient) => {
      const date = patient.DateRegistered;
      if (date !== "0001-01-01") {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

  // Registration counts for chart data
  const outPatientCountsByDate = countRegistrationsByDate(filterOutPatients);
  const inPatientCountsByDate = countRegistrationsByDate(filterInPatients);

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
      <DashboardStatistics userDetails={userDetails} chartData={chartData} />
    </div>
  );
};

export default DoctorDashboard;

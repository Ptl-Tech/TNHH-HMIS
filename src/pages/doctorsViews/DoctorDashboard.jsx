import { useEffect, useMemo } from "react";
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
import DashboardCard from "../nurse-view/DashboardCard";
import DashboardStatistics from "../nurse-view/DashboardStatistics";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { listDoctors } from "../../actions/DropdownListActions";


const DoctorDashboard = () => {
  const role = useAuth().userData.departmentName
  const doctorId = useAuth().userData.doctorID
  const dispatch = useDispatch();
  const userDetails = useAuth(); // Use the custom hook to get user info
  const { patients: treatmentList } =
    useSelector((state) => state.docTreatmentList) || {};
  const { triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList
  );

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
        if (!data?.length) {
          dispatch(listDoctors());
        }
      }, [dispatch, data?.length]);

  const openDoctorVisitList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "New" && item.DoctorID === doctorId;
    } else if (role === "Psychology") {
      return item.Status === "New" && item.DoctorID === doctorId;
    }
    return item.Status === "New";
  });

  const activeVisitCount = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Active" && item.DoctorID === doctorId;
    }else if (role === "Psychology") {
      return item.Status === "Active" && item.DoctorID === doctorId;
    }
    return item.Status === "Active";
  });

  const closedVisitCount = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Completed" && item.DoctorID === doctorId;
    }else if (role === "Psychology") {
      return item.Status === "Completed" && item.DoctorID === doctorId;
    }
    return item.Status === "Completed";
  });
  

  // Filters for inpatients and outpatients
  const filterInPatients =
    patients?.filter((item) => item.Inpatient === true) || [];
  const filterOutPatients =
    patients?.filter((item) => item.Inpatient === false) || [];

    // get the list of doctors
  const formattedDoctorDetails = useMemo(() => {
    return data?.map((doctor) => ({
      DoctorID: doctor?.DoctorID,
      DoctorsName: doctor?.DoctorsName,
    }));
  }, [data]);

  // getting the list of inpatients and combining with the correponding doctor
  const combinedPatients = useMemo(() => {
    if (!admittedPatients || !formattedDoctorDetails) return [];
  
    return admittedPatients.map((patient) => {
      const matchingDoctor = formattedDoctorDetails.find(
        (doctor) => patient?.Doctor === doctor?.DoctorID
      );
      return {
        ...patient,
        DoctorsName: matchingDoctor ? matchingDoctor.DoctorsName : null,
      };
    });
  }, [admittedPatients, formattedDoctorDetails]);


    const filterPatientBasedWithDoctor = useMemo(() => {
        if (role === "Doctor") {
          return combinedPatients?.filter((patient) => patient?.Doctor === doctorId);
        }
        return combinedPatients;
      }, [combinedPatients, doctorId, role]);
  // Updated card data for the dashboard
  const cardData = [
    {
      title: "OP Waiting List",
      value: openDoctorVisitList?.length,
      subtitle: "Increase in 30 days",
      icon: <HourglassOutlined />,
      color: "#fff",
      backgroundColor: "#0f5689",
      link: role === "Doctor" ? "/Doctor/Consultation-List" : "/Psychology/Consultation-List",
    },
    {
      title: "Consultation Room",
      value: activeVisitCount?.length, // Use optimized count
      subtitle: "Active Consultations",
      icon: <SafetyOutlined />,
      color: "#000",
      backgroundColor: "#ac8342",
      link: role === "Doctor" ? "/Doctor/PendingConsultationList" : "/Psychology/PendingConsultationList",
    },
    {
      title: "Closed Consultations",
      value: closedVisitCount?.length, // New card for closed visits
      subtitle: "Completed Consultations",
      icon: <UserOutlined />,
      color: "#000",
      backgroundColor: "#5c85d6",
      link: role === "Doctor" ? "/Doctor/ClosedConsultationList" : "/Psychology/ClosedConsultationList",
    },
    {
      title: "Inpatients List",
      value: filterPatientBasedWithDoctor?.length,
      subtitle: "Increase in 30 days",
      icon: <UserAddOutlined />,
      color: "#000",
      backgroundColor: "#b0afaf",
      link: role === "Doctor" ? "/Doctor/Inpatient" : "/Psychology/Inpatient",
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
  const mergeOutpatients = [...openDoctorVisitList, ...activeVisitCount, ...closedVisitCount];
  const outPatientCountsByDate = countRegistrationsByDate(mergeOutpatients, "TreatmentDate");
  const inPatientCountsByDate = countRegistrationsByDate(filterPatientBasedWithDoctor, "Admission_Date");

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

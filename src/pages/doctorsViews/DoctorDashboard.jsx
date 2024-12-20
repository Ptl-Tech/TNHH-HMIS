
import { useEffect } from "react";
import { UserOutlined, HourglassOutlined, SafetyOutlined, UserAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";
import moment from "moment";
import { getOutPatientTreatmentList } from "../../actions/Doc-actions/OutPatientAction";
import { getPatientListSlice } from "../../actions/nurse-actions/getPatientListSlice";
import DashboardCard from "../nurse-view/DashboardCard";
import DashboardStatistics from "../nurse-view/DashboardStatistics";
const DoctorDashboard = () => {

  const dispatch = useDispatch();

  const userDetails = useAuth();  // Use the custom hook to get user info

  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPatientListSlice());
  }, [dispatch]);
  

  const { loading: treatmentListLoading, patients: treatmentList } = useSelector(
    (state) => state.getDoctorVisitList
  ) || {};
  const openTreatmentList = treatmentList.filter((item)=>item.Status==='New') || {};
  const pendingTreatmentList = treatmentList.filter((item)=>item.Status==='Pending')
  const { allPatientLList } = useSelector((state) => state.getPatientList) || {};

  const filterInPatients = allPatientLList.filter((item)=>item.Inpatient===true) || {};
  const filterOutPatients = allPatientLList.filter((item)=>item.Inpatient===false) || {};

  console.log('Inpatients', filterInPatients);
  // Sample data for the cards
  const cardData = [
    {
      title: " Waiting List Patients",
      value: openTreatmentList.length,
      subtitle: "Increase in 30 days",
      icon: <HourglassOutlined />,
      color: '#fff' ,// You can set the color here
      backgroundColor: '#0f5689', // You can set the background color here,
      link: '/Doctor/Consultation-List' // You can set the link here
    },
    {
      title: "Consultation Room Patients",
      value: pendingTreatmentList.length,
      subtitle: "Increase in 30 days",
      icon: <SafetyOutlined />,
      color: '#000' ,// You can set the color here
      backgroundColor: '#b0afaf', // You can set the background color here
      link: '/Doctor/PendingTreatmentList'
    },
    {
      title: "Out patients",
      value: filterInPatients.length,
      subtitle: "Increase in 30 days",
      icon: <UserOutlined />,
      color: '#fff' ,// You can set the color here
      backgroundColor: '#ac8342 ', // You can set the background color here
      link: '/Reception/Patient-list'
    },
    {
      title: "In patients",
      value: filterOutPatients.length,
      subtitle: "Increase in 30 days",
      icon: <UserAddOutlined />,
      color: '#000' ,// You can set the color here
      backgroundColor: '#b0afaf' // You can set the background color here
    }
  ]

// Function to count registrations by date
const countRegistrationsByDate = (patients) =>
  patients.reduce((acc, patient) => {
    const date = patient.DateRegistered;
    if (date !== '0001-01-01') {
      acc[date] = (acc[date] || 0) + 1;
    }
    return acc;
  }, {});

// Count registrations for outpatients and inpatients
const outPatientCountsByDate = countRegistrationsByDate(filterOutPatients);
const inPatientCountsByDate = countRegistrationsByDate(filterInPatients);

// Get the last 30 days
const last30Days = Array.from({ length: 30 }, (_, i) =>
  moment().subtract(i, 'days').format('YYYY-MM-DD')
);

// Ensure all dates in the range are present with default count 0
const chartData = last30Days.reverse().flatMap((date) => [
  { date, type: 'Outpatient', count: outPatientCountsByDate[date] || 0 },
  { date, type: 'Inpatient', count: inPatientCountsByDate[date] || 0 },
]);

// Example: Chart Data for Ant Design
console.log(chartData);



  return (
    <div style={{ padding: '10px 10px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {
            cardData.map((card, index) =>(
              <DashboardCard card={card} key={index} />
            ))
          }
        </div>

        <DashboardStatistics userDetails={userDetails} chartData={chartData}/> 
    </div>
  );
};

export default DoctorDashboard;

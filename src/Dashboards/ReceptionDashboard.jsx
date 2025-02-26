import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { UsergroupAddOutlined, FileDoneOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { FaUser } from "react-icons/fa6";
import OutpatientList from "../pages/OutpatientList";
import { getVisitorsList } from "../actions/visitorsActions";
import { appmntList, listPatients } from "../actions/patientActions";
import VisitorList from "../pages/VisitorList";

const ReceptionDashboard = () => {
  const { loading, error, visitors } = useSelector(
    (state) => state.visitorsList
  );

  const { loading: patientLoading, error: patientError, patients } = useSelector(
    (state) => state.patientList);
  const { loading: appmntLoading, patients: appointments } = useSelector((state) => state.appmntList);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const [currentVisitorsCount, setCurrentVisitorsCount] = useState(0);
  const [activePatientsCount, setActivePatientsCount] = useState(0);
  const [activeAppmnts, setActiveAppmnts] = useState(0);

  useEffect(() => {
    dispatch(appmntList()); // Fetch appointment list
  }, [dispatch]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
    const filteredAppointments = appointments?.filter((appointment) => {
      const appointmentDate = new Date(appointment.AppointmentDate).toISOString().split("T")[0];
      return appointmentDate === today && appointment.Status === "New"; // Filter by today's date and status "new"
    });
    setActiveAppmnts(filteredAppointments?.length); // Set the count of active appointments
  }, [appointments]);

  useEffect(() => {
    dispatch(getVisitorsList()); // Fetch visitors list
    dispatch(listPatients()); // Fetch patients list
  }, [dispatch]);

  // Calculate today's date
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Filter visitors based on today's date and status "Entered"
  useEffect(() => {
    if (visitors && visitors.length > 0) {
      const currentVisitors = visitors.filter(visitor => {
        const visitorDate = new Date(visitor.CreatedDate).toISOString().split('T')[0];
        return visitorDate === today && visitor.Status === "Entered"; // Filter visitors by today's date and status "Entered"
      });

      setCurrentVisitorsCount(currentVisitors.length);
    }
  }, [visitors, today]);

  // Navigate to the visitor list page// General handler for card clicks to navigate to respective pages
  const handleCardClick = (route) => {
    navigate(route); // Navigate to the respective route based on the card clicked
  };

  return (
    <div className="">
      <div className="card-title">
        <h5 className="card-title px-2 text-dark">Dashboard</h5>
      </div>
      <div className="card-body text-dark">
        <p>Welcome to the Reception Dashboard</p>

        <div className="row gap-3 gap-md-0">
          {/* Current Visitors KPI Card */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: "#0060a3", color: "#fafafa" }}
              onClick={() => handleCardClick('/reception/visitors-list')} // Use dynamic navigation
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Current Visitors List
                </div>
                <p className="text-white">{currentVisitorsCount}</p>
              </div>
            </div>
          </div>

          {/* Total Appointments KPI Card */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: "#58586e", color: "#fafafa" }}
              onClick={() => handleCardClick('/reception/appointments/list')} // Use dynamic navigation

            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FileDoneOutlined style={{ marginRight: 8 }} />
                  Total Appointments
                </div>
                <p className="text-white">{activeAppmnts}</p> {/* Show active appointments count */}
              </div>
            </div>
          </div>

          {/* Active Patients KPI Card */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: "#0060a3", color: "#fafafa" }}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <UsergroupAddOutlined style={{ marginRight: 8 }} />
                  Active Patients List
                </div>
                <p className="text-white">0</p> {/* Replace with dynamic count */}
              </div>
            </div>
          </div>

          {/* Pharmacy List KPI Card */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: "#ac8342", color: "#fafafa" }}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <CheckCircleOutlined style={{ marginRight: 8 }} />
                  Pharmacy List
                </div>
                <p className="text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          {/* <VisitorList/> */}
          {/* <OutpatientList /> */}
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { UsergroupAddOutlined, FileDoneOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { FaUser } from "react-icons/fa6";
import OutpatientList from "../pages/OutpatientList";
import { getVisitorsList } from "../actions/visitorsActions";
import { listPatients } from "../actions/patientActions";

const ReceptionDashboard = () => {
  const { loading, error, visitors } = useSelector(
    (state) => state.visitorsList
  );

  const { loading: patientLoading, error: patientError, patients } = useSelector(
    (state) => state.patientList);
  

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const [currentVisitorsCount, setCurrentVisitorsCount] = useState(0);
  const [activePatientsCount, setActivePatientsCount] = useState(0);

  useEffect(() => {
    dispatch(getVisitorsList());
    dispatch(listPatients());
  }, [dispatch]);

  // Calculate today's date
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Filter visitors based on today's date
  useEffect(() => {
    if (visitors && visitors.length > 0) {
      const currentVisitors = visitors.filter(visitor => {
        const visitorDate = new Date(visitor.CreatedDate).toISOString().split('T')[0];
        return visitorDate === today;
      });

      setCurrentVisitorsCount(currentVisitors.length);
    }
  }, [visitors, today]);

  // Navigate to the visitor list page
  const handleCardClick = () => {
    navigate('/reception/visitors-list'); // Use navigate to go to the visitor list
  };

  return (
    <div className="">
      <div className="card-title">
        <h5 className="card-title px-2 text-dark">Dashboard</h5>
      </div>
      <div className="card-body text-dark">
        <p>Welcome to the Reception Dashboard</p>

        <div className="row gap-3 gap-md-0">
          {/* Existing KPI Cards */}
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
                <p className="text-white">15</p>
              </div>
            </div>
          </div>
          {/* Additional KPI Cards */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: "#58586e", color: "#fafafa" }}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FileDoneOutlined style={{ marginRight: 8 }} />
                  Total Appointments
                </div>
                <p className="text-white">20</p>
              </div>
            </div>
          </div>
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: "#0060a3", color: "#fafafa" }}
              onClick={handleCardClick} // Add onClick handler here
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
                <p className="text-white">5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
            <OutpatientList />
        </div>
      </div>
    </div>
  );
};

export default ReceptionDashboard;

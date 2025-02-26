import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FaUser } from 'react-icons/fa6';

import { getLabList } from '../actions/Doc-actions/getLabList';

const LabDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   state
  const { data } = useSelector((state) => state.labList);

  const totalLabRequests = data?.length;
  const newLabRequests = data.filter((dataItem) => dataItem.Status === 'New');
  const forwadedLabRequests = data.filter(
    (dataItem) => dataItem.Status === 'Forwaded',
  );
  const completedLabRequests = data.filter(
    (dataItem) => dataItem.Status === 'Completed',
  );

  useEffect(() => {
    // fetch the lab lists
    dispatch(getLabList());
  }, [dispatch]);

  return (
    <div className="">
      <div className="card-title">
        <h5 className="card-title px-2 text-dark">Dashboard</h5>
      </div>
      <div className="card-body text-dark">
        <p>Welcome to the Laboratory Dashboard</p>
        <div className="row gap-3 gap-md-0">
          {/* new labe requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Lab/Lab-Patients')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  New Laboratory Requests
                </div>
                <p className="text-white">{newLabRequests.length}</p>
              </div>
            </div>
          </div>
          {/* forwaded lab requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Lab/Lab-Patients')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Forwarded Laboratory Requests
                </div>
                <p className="text-white">{forwadedLabRequests.length}</p>
              </div>
            </div>
          </div>
          {/* completed lab requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Lab/Lab-Patient')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Completed Laboratory Requests
                </div>
                <p className="text-white">{completedLabRequests.length}</p>
              </div>
            </div>
          </div>
          {/* all lab requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Lab/Lab-Patients')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Total Lab Requests
                </div>
                <p className="text-white">{totalLabRequests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;

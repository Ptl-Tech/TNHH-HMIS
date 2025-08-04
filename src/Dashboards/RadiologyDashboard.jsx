import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { FaUser } from 'react-icons/fa6';

import { getRadiologyList } from '../actions/Doc-actions/getRadiologyList';

const RadiologyDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   state
  const { data } = useSelector((state) => state.getRadiologyDetails);

  const totalRadiologyRequests = data?.length;
  const newRadiologyRequests = data.filter(
    (dataItem) => dataItem.Status === 'New',
  );
  const forwardedRadiologyRequests = data.filter(
    (dataItem) => dataItem.Status === 'Forwarded',
  );
  const completedRadiologyRequests = data.filter(
    (dataItem) => dataItem.Status === 'Completed',
  );

  useEffect(() => {
    // fetch the radiology lists
    dispatch(getRadiologyList());
  }, [dispatch]);

  return (
    <div className="">
      <div className="card-title">
        <h5 className="card-title px-2 text-dark">Dashboard</h5>
      </div>
      <div className="card-body text-dark">
        <p>Welcome to the Radiology Dashboard</p>
        <div className="row gap-3 gap-md-0">
          {/* new radiology requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Dashboard/Radiology-Outpatient')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  New Radiology Requests
                </div>
                <p className="text-white">{newRadiologyRequests.length}</p>
              </div>
            </div>
          </div>
          {/* forwarded radiology requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Dashboard/Radiology-Outpatient')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Forwarded Radiology Requests
                </div>
                <p className="text-white">{forwardedRadiologyRequests.length}</p>
              </div>
            </div>
          </div>
          {/* completed radiology requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Dashboard/Radiology-Outpatient')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Completed Radiology Requests
                </div>
                <p className="text-white">
                  {completedRadiologyRequests.length}
                </p>
              </div>
            </div>
          </div>
          {/* all radiology requests */}
          <div className="col col-12 col-md-3">
            <div
              className="card"
              style={{ backgroundColor: '#0060a3', color: '#fafafa' }}
              onClick={() => navigate('/Dashboard/Radiology-Outpatient')}
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Total Radiology Requests
                </div>
                <p className="text-white">{totalRadiologyRequests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadiologyDashboard;

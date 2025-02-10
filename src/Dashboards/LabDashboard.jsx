import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Row } from 'antd';
import { FaUser } from 'react-icons/fa6';

import { getLabList } from '../actions/Doc-actions/getLabList';

const LabDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   state
  const { data } = useSelector((state) => state.labList);

  useEffect(() => {
    // fetch the lab lists
    dispatch(getLabList());
  }, [dispatch]);

  const statuses = [
    { status: 'Forwaded', backgroundColor: '#0060a3', color: '#fafafa' },
    { status: 'Review', backgroundColor: '#006d75', color: '#fafafa' },
    { status: 'Completed', backgroundColor: '#237804', color: '#fafafa' },
    { status: 'Recalled', backgroundColor: '#391085', color: '#fafafa' },
    { status: 'Cancelled', backgroundColor: '#ad4e00', color: '#fafafa' },
  ];

  const viewableData = statuses.map(({ status, backgroundColor, color }) => ({
    name: `${status} Laboratory Request`,
    number: data.filter((item) => item.Status === status).length,
    backgroundColor,
    color,
  }));

  return (
    <div className="">
      <div className="card-title">
        <h5 className="card-title px-2 text-dark">Dashboard</h5>
      </div>
      <div className="card-body text-dark">
        <p>Welcome to the Laboratory Dashboard</p>
        <Row gutter={[16, 16]}>
          {viewableData.map(({ name, number, backgroundColor, color }) => (
            <Col
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              key={name}
              className="gutter-row"
            >
              <div
                className="card"
                style={{ backgroundColor, color }}
                onClick={() => navigate('/Lab/Lab-Patients')}
              >
                <div className="card-body">
                  <div className="card-title p-2">
                    <FaUser style={{ marginRight: 8 }} />
                    {name}
                  </div>
                  <p className="text-white">{number || 0}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default LabDashboard;

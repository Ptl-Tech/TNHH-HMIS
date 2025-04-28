import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Col, Row, Select } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

import { getLabList } from '../actions/Doc-actions/getLabList';
import {
  filterByCategory,
  filterByStatus,
} from '../pages/doctorsViews/tables/lab/utils';

const LabDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   state
  const [variant, setVariant] = useState('All');
  const { data } = useSelector((state) => state.labList);

  useEffect(() => {
    // fetch the lab lists
    dispatch(getLabList());
  }, [dispatch]);

  const statuses = [
    { status: 'New', backgroundColor: '#ad4e0023', color: '#ad4e00' },
    { status: 'Forwarded', backgroundColor: '#0060a323', color: '#0060a3' },
    { status: 'Review', backgroundColor: '#006d7523', color: '#006d75' },
    { status: 'Completed', backgroundColor: '#23780423', color: '#237804' },
    { status: 'Recalled', backgroundColor: '#39108523', color: '#391085' },
    { status: 'Voided', backgroundColor: '#ad4e0023', color: '#ad4e00' },
  ];

  const viewableData = statuses.map(({ status, backgroundColor, color }) => ({
    color,
    status,
    backgroundColor,
    name: `${status} Laboratory Request`,
    number: data.filter(
      (item) => filterByStatus(item, status) && filterByCategory(item, variant),
    ).length,
  }));

  const handleChange = (value) => {
    setVariant(value);
  };

  return (
    <div className="">
      <div
        className="px-3"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="card-title text-dark">
          <h5 className="card-title">Dashboard</h5>
          <p>Welcome to the Laboratory Dashboard</p>
        </div>
        <Select
          defaultValue={variant}
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: 'All', label: 'All' },
            { value: 'Inpatient', label: 'Inpatient' },
            { value: 'Outpatient', label: 'Outpatient' },
            { value: 'Walk-In', label: 'Walk In' },
          ]}
        />
      </div>
      <div className="card-body text-dark">
        <Row gutter={[16, 16]}>
          {viewableData.map(
            ({ name, status, number, backgroundColor, color }) => (
              <Col
                xs={{ span: 24 }}
                sm={{ span: 12 }}
                md={{ span: 8 }}
                lg={{ span: 6 }}
                key={name}
                className="gutter-row"
              >
                <div
                  className="card border"
                  style={{
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/Lab/${variant}/${status}`)}
                >
                  <div
                    className="card-body gap-3"
                    style={{ display: 'grid' }}
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        display: 'flex',
                        fontSize: '15px',
                        color: '#6f6f6f',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {name}
                      <ArrowUpOutlined style={{ transform: 'rotate(45deg)' }} />
                    </div>
                    <span
                      level={8}
                      style={{ fontSize: '40px', color: '#3e3e3e' }}
                    >
                      {number}
                    </span>
                    <div
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        color: '#6f6f6f',
                      }}
                    >
                      <small
                        className="p-1"
                        style={{ backgroundColor, color, borderRadius: '3px' }}
                      >
                        {status}
                      </small>{' '}
                      <small>of {variant}</small>
                    </div>
                  </div>
                </div>
              </Col>
            ),
          )}
        </Row>
      </div>
    </div>
  );
};

export default LabDashboard;

import React, { useState, useEffect } from "react"; 
import { Calendar, Card } from "antd"; 
import { UsergroupAddOutlined, FileDoneOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { FaUser } from "react-icons/fa6";
import { Pie } from '@ant-design/charts'; 
import moment from 'moment';

const NurseDashboard = () => {
  const [date, setDate] = useState(moment()); // Initialize date with moment

  // Sample data for the pie chart
  const data = [
    { type: 'Occupied', value: 10 },
    { type: 'Available', value: 5 },
    { type: 'Under Maintenance', value: 3 },
  ];

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-20%',
      content: '{value}',
      style: {
        fontWeight: 'bold',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-active' }],
    width: 400,
    height: 400,
  };

  return (
    <div className="container">
      <div className="card-title">
        <h5 className="card-title p-2">Dashboard</h5>
      </div>
      <div className="card-body">
        <p>Welcome to the Nurse Dashboard</p>
        
        <div className="row  gap-3 gap-md-0">
          {/* Existing KPI Cards */}
          <div className="col col-md-3">
            <div className="bg-primary card text-white">
              <div className="card-body">
                <div className="card-title p-2">
                  <UsergroupAddOutlined style={{ marginRight: 8 }} />
                  Today Patients List
                </div>
                <p className="text-white">15</p>
              </div>
            </div>
          </div>
          {/* Additional KPI Cards */}
          <div className="col col-12 col-md-3">
            <div className="bg-danger card text-white">
              <div className="card-body">
                <div className="card-title p-2">
                  <FileDoneOutlined style={{ marginRight: 8 }} />
                  Lab Tests
                </div>
                <p className="text-white">20</p>
              </div>
            </div>
          </div>
          <div className="col col-12 col-md-3">
            <div className="bg-success card text-white">
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Current In-Patients
                </div>
                <p className="text-white">10</p>
              </div>
            </div>
          </div>
          <div className="col col-12 col-md-3">
            <div className="bg-primary card text-white">
              <div className="card-body">
                <div className="card-title p-2">
                  <CheckCircleOutlined style={{ marginRight: 8 }} />
                  Discharge List
                </div>
                <p className="text-white">5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4 gap-5 gap-md-0">
        <div className="col col-12 col-md-7">
            <Card className="bg-light align-items-center justify-content-center">
              <h5 className="card-title">Bed Management Overview</h5>
              <Pie {...config} />
            </Card>
          </div>
          <div className="col col-12 col-md-5">
            <Card className="bg-light">
              <h5 className="card-title">Appointment Calendar</h5>
              <Calendar 
                onChange={(date) => setDate(date)} // Handle date change
                value={date} 
                fullscreen={false}
                style={{ width: '100%', height: '50px' }} 
              />
            </Card>
          </div>
         
        </div>

        {/* Recent Activities Section
        <div className="row">
          <div className="col col-md-12">
            <Card className="bg-light">
              <h5 className="card-title">Recent Activities</h5>
              <ul>
                <li>John Doe admitted at 10:00 AM</li>
                <li>Jane Smith discharged at 2:00 PM</li>
                <li>Medication request for Mark Taylor approved</li>
              </ul>
            </Card>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default NurseDashboard;

import React, { useState } from "react"; 
import { Calendar, Card } from "antd"; 
import { UsergroupAddOutlined, FileDoneOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { FaUser } from "react-icons/fa6";
import { Column } from '@ant-design/plots';
import moment from 'moment';

const DoctorDashboard = () => {
  const [date, setDate] = useState(moment()); // Initialize date with moment

  // Sample data for the column chart for the whole year
  const data = [
    { month: 'January', type: 'Insurance', value: 3000 },
    { month: 'January', type: 'Patients', value: 5000 },
    { month: 'February', type: 'Insurance', value: 4000 },
    { month: 'February', type: 'Patients', value: 4500 },
    { month: 'March', type: 'Insurance', value: 2500 },
    { month: 'March', type: 'Patients', value: 6000 },
    { month: 'April', type: 'Insurance', value: 3500 },
    { month: 'April', type: 'Patients', value: 5500 },
    { month: 'May', type: 'Insurance', value: 4500 },
    { month: 'May', type: 'Patients', value: 5000 },
    { month: 'June', type: 'Insurance', value: 5000 },
    { month: 'June', type: 'Patients', value: 6500 },
    { month: 'July', type: 'Insurance', value: 3000 },
    { month: 'July', type: 'Patients', value: 7000 },
    { month: 'August', type: 'Insurance', value: 6000 },
    { month: 'August', type: 'Patients', value: 8000 },
    { month: 'September', type: 'Insurance', value: 7000 },
    { month: 'September', type: 'Patients', value: 9000 },
    { month: 'October', type: 'Insurance', value: 8000 },
    { month: 'October', type: 'Patients', value: 10000 },
    { month: 'November', type: 'Insurance', value: 9000 },
    { month: 'November', type: 'Patients', value: 11000 },
    { month: 'December', type: 'Insurance', value: 10000 },
    { month: 'December', type: 'Patients', value: 12000 },
  ];

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    colorField: 'type',
    autoFit: true, // Ensures the chart automatically resizes to fit the container
    meta: {
      month: { alias: 'Month' },
      value: { alias: 'Earnings' },
    },
    interactions: [{ type: 'element-active' }],
   
    legend: {
      position: 'top-right',
    },
  };
  return (
    <div className="">
      <div className="card-title">
        <h5 className="card-title px-2 text-dark">Dashboard</h5>
      </div>
      <div className="card-body text-dark">
        <p>Welcome to the Doctor Dashboard</p>
        
        <div className="row gap-3 gap-md-0">
          {/* Existing KPI Cards */}
          <div className="col col-12 col-md-3">
          <div className="card" style={{ backgroundColor: "#0060a3", color: "#fafafa" }}>
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
          <div className="card" style={{ backgroundColor: "#58586e", color: "#fafafa" }}>
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
          <div className="card" style={{ backgroundColor: "#0060a3", color: "#fafafa" }}>
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
          <div className="card" style={{ backgroundColor: "#ac8342", color: "#fafafa" }}>
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

        <div className="row mt-4 gap-5 gap-md-0">
        <div className="col col-12 mt-4 mt-md-0 col-md-7">
            <Card className="bg-light">
              <h5 className="card-title">Insurance vs. Patient Earnings</h5>
              <Column {...config} />
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

        {/* Uncomment for Recent Activities Section */}
        {/* <div className="row">
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

export default DoctorDashboard;

import React from "react";
import { Card } from "antd"; 
import { UsergroupAddOutlined, FileDoneOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { FaUser } from "react-icons/fa6";
import { Pie } from '@ant-design/charts'; // Import Pie chart

const NurseDashboard = () => {
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
  };

  return (
    <div className="container">
      <div className="card-title">
        <h5 className="card-title p-2">Dashboard</h5>
      </div>
      <div className="card-body">
        <p>Welcome to the Nurse Dashboard</p>
        <div className="row">
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
          <div className="col col-md-3">
            <div className="bg-primary card text-white">
              <div className="card-body">
                <div className="card-title p-2">
                  <FileDoneOutlined style={{ marginRight: 8 }} />
                  Lab Requests
                </div>
                <p className="text-white">7</p>
              </div>
            </div>
          </div>
          <div className="col col-md-3">
            <div className="bg-primary card text-white">
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Current In-Patients
                </div>
                <p className="text-white">10</p>
              </div>
            </div>
          </div>
          <div className="col col-md-3">
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
        <div className="row">
          <div className="col col-md-12">
            <Card className="bg-light">
              <h5 className="card-title">Bed Management Overview</h5>
              <Pie {...config} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;

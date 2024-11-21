import React, { useState } from "react"; 
import { Calendar, Card } from "antd"; 
import { UsergroupAddOutlined, FileDoneOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { FaUser } from "react-icons/fa6";
import OutpatientList from "../pages/OutpatientList";
const ReceptionDashboard = () => {
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
                  Today Patients List
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
            >
              <div className="card-body">
                <div className="card-title p-2">
                  <FaUser style={{ marginRight: 8 }} />
                  Billing List
                </div>
                <p className="text-white">10</p>
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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UsergroupAddOutlined, FileDoneOutlined, CheckCircleOutlined } from '@ant-design/icons'; 
import { FaUser } from "react-icons/fa6";
import { Pie, Column } from '@ant-design/charts';
import { Calendar, Card } from "antd";
import moment from 'moment';
import { getVisitorsList } from "../actions/visitorsActions";
import { appmntList, listPatients } from "../actions/patientActions";
import { getOutPatientTreatmentList } from "../actions/Doc-actions/OutPatientAction";
import { getPatientListSlice } from "../actions/nurse-actions/getPatientListSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [date, setDate] = useState(moment());

  useEffect(() => {
    dispatch(getVisitorsList());
    dispatch(appmntList());
    dispatch(listPatients());
    dispatch(getOutPatientTreatmentList());
    dispatch(getPatientListSlice());
  }, [dispatch]);

  const { visitors } = useSelector((state) => state.visitorsList);
  const { patients: appointments } = useSelector((state) => state.appmntList);
  const { patients } = useSelector((state) => state.patientList);
  const { patients: treatmentList } = useSelector((state) => state.docTreatmentList);
  const { allPatientLList } = useSelector((state) => state.getPatientList) || {};

  const currentVisitorsCount = visitors?.filter(visitor => {
    const visitorDate = new Date(visitor.CreatedDate).toISOString().split('T')[0];
    return visitorDate === moment().format('YYYY-MM-DD') && visitor.Status === "Entered";
  }).length;

  const activeAppmnts = appointments?.filter(appointment => {
    const appointmentDate = new Date(appointment.AppointmentDate).toISOString().split("T")[0];
    return appointmentDate === moment().format('YYYY-MM-DD') && appointment.Status === "New";
  }).length;

  const filterInPatients = allPatientLList?.filter((item) => item.Inpatient === true) || [];
  const filterOutPatients = allPatientLList?.filter((item) => item.Inpatient === false) || [];

  const pieData = [
    { type: 'Occupied', value: 10 },
    { type: 'Available', value: 5 },
    { type: 'Under Maintenance', value: 3 },
  ];

  const pieConfig = {
    data: pieData,
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

  const columnData = [
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

  const columnConfig = {
    data: columnData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    colorField: 'type',
    autoFit: true,
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
    <div className="container">
      <div className="card-title">
        <h5 className="card-title p-2">Admin Dashboard</h5>
      </div>
      <div className="card-body">
        <p>Welcome to the Admin Dashboard</p>
        
        <div className="row gap-3 gap-md-0">
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

        <div className="row mt-4 gap-5 gap-md-0">
          <div className="col col-12 col-md-7">
            <Card className="bg-light">
              <h5 className="card-title">Insurance vs. Patient Earnings</h5>
              <Column {...columnConfig} />
            </Card>
          </div>
          <div className="col col-12 col-md-5">
            <Card className="bg-light">
              <h5 className="card-title">Appointment Calendar</h5>
              <Calendar 
                onChange={(date) => setDate(date)} 
                value={date} 
                fullscreen={false}
                style={{ width: '100%', height: '50px' }} 
              />
            </Card>
          </div>
        </div>

        <div className="row mt-4 gap-5 gap-md-0">
          <div className="col col-12 col-md-7">
            <Card className="bg-light">
              <h5 className="card-title">Bed Management Overview</h5>
              <Pie {...pieConfig} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
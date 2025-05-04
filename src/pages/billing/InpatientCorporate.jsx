import { Table, Typography, Spin, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getBillingList } from '../../actions/Charges-Actions/getBillingList';

const InsurancePatients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // React Router navigation
  const { loading, patients } = useSelector((state) => state.getBillingList);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const pageSize = 25; // Number of patients per page

  useEffect(() => {
    dispatch(getBillingList()); // Fetch data only once
  }, [dispatch]);

  // Process patient list: filter inactive patients
  const filteredPatients = patients
    ?.filter((patient) => patient?.Activated && patient?.Inpatient && patient?.PatientType === 'Corporate')
    .map((patient) => ({
      ...patient,
      key: patient.PatientNo,
      Balance: `KSH ${parseFloat(patient.Balance || 0).toFixed(2)}`,
    }))
    .filter((patient) =>
      patient.Names.toLowerCase().includes(searchText.toLowerCase()) || 
      patient.PatientNo.toLowerCase().includes(searchText.toLowerCase())
    );

  // Navigate to view charges page with patient ID
  const handleViewCharges = (patientId) => {
    console.log('Patient ID:', patientId); // Log the patient ID for debugging
    navigate(`/Reception/Corporate-Inpatient-Charges?PatientNo=${patientId}`);

  };
  


  const columns = [
    {
      title: 'Patient No',
      dataIndex: 'PatientNo',
      key: 'PatientNo',
    },
    {
      title: 'Patient Name',
      dataIndex: 'Names',
      key: 'Names',
    },
    {
      title: 'Active Visit No',
      dataIndex: 'ActiveVisitNo',
      key: 'ActiveVisitNo',
    },
    {
      title: 'Payment Type',
      dataIndex: 'PatientType',
      key: 'PatientType',
    },
    {
      title: 'Balance',
      dataIndex: 'Balance',
      key: 'Balance',
      render: (Balance) => {
        const isZero = Balance === 0.00 || Balance === 'KSH 0.00';
        const balanceValue = parseFloat(Balance.replace(/[^0-9.-]+/g, '')); // Extract numeric value from string
        return (
          <span style={{ color: isZero ? 'green' : 'red', fontWeight: 'bold' }}>
            {isZero ? 'KSH 0.00' : `KSH ${balanceValue.toFixed(2)}`}
          </span>
        );
      },
    },    
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewCharges(record.ActiveVisitNo)}>
          View Charges
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Typography.Title level={4}>Insurance Patients</Typography.Title>
      
      {/* Search Input */}
      <Input
        placeholder="Search by Patient Name or No..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: '100%', marginBottom: 16 }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredPatients}
          size="small"
          bordered
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredPatients?.length || 0,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
        />
      )}
    </div>
  );
};

export default InsurancePatients;

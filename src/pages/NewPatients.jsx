import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listPatients, triageList } from '../actions/patientActions';
import { Table, Button, Input, Pagination, Modal, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EyeOutlined, SendOutlined, FileAddOutlined } from '@ant-design/icons';

const { Search } = Input;

const NewPatients = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, patients } = useSelector(state => state.triageList);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

 
    const columns = [
        {
            title: 'Patient No',
            dataIndex: 'patientId',
            key: 'patientNo',
            render: (_, record, index) => <span>{(currentPage - 1) * pageSize + index + 1}</span>,
            sorter: (a, b) => a.patientId - b.patientId,
        },
        { title: 'First Name', dataIndex: ['patient', 'firstName'], key: 'firstName', sorter: (a, b) => a.patient.firstName.localeCompare(b.patient.firstName) },
        { title: 'Last Name', dataIndex: ['patient', 'lastName'], key: 'lastName', sorter: (a, b) => a.patient.lastName.localeCompare(b.patient.lastName) },
        { title: 'Gender', dataIndex: ['patient', 'gender'], key: 'gender' },
        { title: 'Patient Type', dataIndex: ['patient', 'patientType'], key: 'patientType' },
        { title: 'Insurance', dataIndex: ['patient', 'insurance'], key: 'insurance' },
        { title: 'ID Number', dataIndex: ['patient', 'idNumber'], key: 'idNumber' },
        {
            title: 'Date Registered',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Tooltip title="Dispatch to Observation Room">
                        <Button icon={<SendOutlined />} onClick={() => handleDispatch(record)} >
                            Dispatch
                        </Button>
                    </Tooltip>
                    <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
                        View Details
                    </Button>
                </div>
            ),
        },
    ];
    
    useEffect(() => {
        dispatch(triageList());
    }, [dispatch]);

    const handleNewPatient = () => {
        navigate('/Nurse/PatientRegistration');
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
    };

    const handleDispatch = (record) => {
        navigate(`/Nurse/Observation-Room/${record.id}`, { state: { patient: record.patient, triage: record } }); // Pass only patient data
    };


    const handleAdmit = (record) => {
        console.log(`Admitting patient ${record._id}`);
        // Add additional logic here for admitting the patient if needed
    };

    const showModal = (record) => {
        setSelectedPatient(record);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setSelectedPatient(null);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedPatient(null);
    };

      // Filter patients based on the search query
      const filteredPatients = patients.filter(patient => 
        patient.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient.idNumber.includes(searchQuery)
    );


    const totalPatients = filteredPatients.length;
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalPatients);
    const patientsToDisplay = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className='container'>
            <h4 className='text-center p-3' style={{ color: '#ac8342' }}>New Patients</h4>
            <Search placeholder="Search by Name or ID Number" onSearch={handleSearch} style={{ marginBottom: '20px' }} />
            <div className='d-flex justify-content-between'>
                <Button type="primary" onClick={handleNewPatient} style={{ marginBottom: '20px' }}>Register New Patient</Button>
                <Button onClick={() => handleAdmit()} style={{ marginBottom: '20px' }} type='primary'>
                   <FileAddOutlined />
                    Admit Patient
                </Button>
            </div>
            <p>Showing {startRecord} to {endRecord} of {totalPatients} records</p>
            <Table columns={columns} dataSource={patientsToDisplay} loading={loading} pagination={false} rowKey={record => record.id} />
            <Pagination current={currentPage} pageSize={pageSize} total={totalPatients} onChange={page => setCurrentPage(page)} style={{ textAlign: 'right' }} />

            {/* Modal for viewing patient details */}
            <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} title="Patient Details">
    {selectedPatient && selectedPatient.patient && (
        <div>
            <p><strong>First Name:</strong> {selectedPatient.patient.firstName}</p>
            <p><strong>Last Name:</strong> {selectedPatient.patient.lastName}</p>
            <p><strong>Gender:</strong> {selectedPatient.patient.gender}</p>
            <p><strong>Patient Type:</strong> {selectedPatient.patient.patientType}</p>
            <p><strong>Insurance:</strong> {selectedPatient.patient.insurance}</p>
            <p><strong>ID Number:</strong> {selectedPatient.patient.idNumber}</p>
            <p><strong>Date Registered:</strong> {new Date(selectedPatient.createdAt).toLocaleString()}</p>
        </div>
    )}
</Modal>

        </div>
    );
};

export default NewPatients;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { triageList } from '../actions/patientActions';
import { Table, Button, Input, Pagination, Modal, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

const { Search } = Input;
const { TabPane } = Tabs;

const NurseOutpatientList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, patients } = useSelector(state => state.triageList);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
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
        { title: 'First Name', dataIndex: ['patient', 'firstName'], key: 'firstName' },
        { title: 'Last Name', dataIndex: ['patient', 'lastName'], key: 'lastName' },
        { title: 'Gender', dataIndex: ['patient', 'gender'], key: 'gender' },
        { title: 'ID No', dataIndex: ['patient', 'idNumber'], key: 'idNumber', sorter: (a, b) => a.idNumber - b.idNumber },
        { title: 'Patient Type', dataIndex: ['patient', 'patientType'], key: 'patientType' },
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
                <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>
                    View Details
                </Button>
            ),
        },
    ];

    useEffect(() => {
        dispatch(triageList());
    }, [dispatch]);

    const handleSearch = (value) => setSearchQuery(value);

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

    const filteredPatients = patients.filter(patient =>
        patient.patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPatients = filteredPatients.length;
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalPatients);
    const patientsToDisplay = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className='container'>
            <h4 className='text-center p-3'>Outpatient List</h4>
            <Search placeholder="Search by Name" onSearch={handleSearch} style={{ marginBottom: '20px' }} />
            <p>Showing {startRecord} to {endRecord} of {totalPatients} records</p>
            <Table columns={columns} dataSource={patientsToDisplay} loading={loading} pagination={false} rowKey={record => record.id} />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalPatients}
                onChange={page => setCurrentPage(page)}
                style={{ textAlign: 'right', margin: '20px' }}
            />

            {/* Modal for viewing patient details */}
            <Modal
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                destroyOnClose
                maskClosable
                style={{ top: 5 }}
                footer={null}
                title={`${selectedPatient?.patient?.firstName} ${selectedPatient?.patient?.lastName}`}
            >
                {selectedPatient && (
                    <div>
                        <label>Patient Type:</label>
                        <Input value={selectedPatient.patient.patientType} readOnly style={{ marginBottom: '10px' }} />
                        
                        <label>Date Registered:</label>
                        <Input value={new Date(selectedPatient.createdAt).toLocaleString()} readOnly style={{ marginBottom: '10px' }} />

                        <Tabs defaultActiveKey="1">
                        <TabPane tab="Vitals & Symptoms" key="1">
        <label>Height:</label>
        <Input value={`${selectedPatient.vitals?.height || 'N/A'} cm`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Weight:</label>
        <Input value={`${selectedPatient.vitals?.weight || 'N/A'} kg`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Heart Rate:</label>
        <Input value={`${selectedPatient.vitals?.heartRate || 'N/A'} bpm`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Temperature:</label>
        <Input value={`${selectedPatient.vitals?.temperature || 'N/A'} °C`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Blood Pressure:</label>
    <Input value={`${selectedPatient.vitals?.bloodPressure || 'N/A'} mmHg`} readOnly style={{ marginBottom: '10px' }} />
        
        <label>Respiratory Rate:</label>
        <Input value={`${selectedPatient.vitals?.respiratoryRate || 'N/A'} breaths/min`} readOnly style={{ marginBottom: '10px' }} />
    </TabPane>

                            <TabPane tab="Doctor Treatment" key="2">
                            <label>Symptoms:</label>
                                <TextArea value={selectedPatient.symptoms || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Notes:</label>
                                <TextArea value={selectedPatient.doctorNotes || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Diagnosis:</label>
                                <TextArea value={selectedPatient.diagnosis || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Treatment:</label>
                                <TextArea value={selectedPatient.recommendedTreatment || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />
                                
                                <label>Additional Notes:</label>
                                <TextArea value={selectedPatient.additionalNotes || 'N/A'} readOnly rows={2} style={{ marginBottom: '10px' }} />                            </TabPane>
                        </Tabs>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NurseOutpatientList;

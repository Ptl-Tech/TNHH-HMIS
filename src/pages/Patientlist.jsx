import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listPatients } from '../actions/patientActions';
import { Table, Button, Input, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import * as XLSX from 'xlsx'; // Import XLSX for Excel download
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import the autotable plugin

const { Search } = Input; // Destructure Search component from Ant Design

const Patientlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize useNavigate
    const { loading, error, patients } = useSelector(state => state.patientList);
    const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [pageSize, setPageSize] = useState(10); // State for page size

    // Columns for the Ant Design Table
    const columns = [
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
            render: (_, record, index) => <span>{(currentPage - 1) * pageSize + index + 1}</span>, // Calculate Patient No based on current page
            sorter: {
                compare: (a, b) => a.patientNo - b.patientNo,
                multiple: 1,
            },
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text) => <span>{text}</span>,
            sorter: {
                compare: (a, b) => a.firstName.localeCompare(b.firstName),
                multiple: 3,
            },
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            render: (text) => <span>{text}</span>,
            sorter: {
                compare: (a, b) => a.lastName.localeCompare(b.lastName),
                multiple: 2,
            },
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Patient Type',
            dataIndex: 'patientType',
            key: 'patientType',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Insurance',
            dataIndex: 'insurance',
            key: 'insurance',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'ID Number',
            dataIndex: 'idNumber',
            key: 'idNumber',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Date Registered',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                const date = new Date(text);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
                return <span>{date.toLocaleString('en-US', options)}</span>; // Format date to include AM/PM
            },
            sorter: {
                compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                multiple: 4,
            },
        },
    ];

    useEffect(() => {
        dispatch(listPatients());
    }, [dispatch]);

    const handleNewPatient = () => {
        navigate('/Nurse/PatientRegistration'); // Redirect to new patient registration page
    };

    // Function to download data as Excel
    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(patients);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');
        XLSX.writeFile(workbook, 'patients.xlsx');
    };

    // Function to download data as PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text('Patients List', 14, 16);
        
        // Generate table
        const tableData = patients.map((patient, index) => [
            index + 1,
            patient.firstName,
            patient.lastName,
            patient.gender,
            patient.patientType,
            patient.insurance,
            patient.idNumber,
            new Date(patient.createdAt).toLocaleString(),
        ]);
        
        // Define columns
        const columns = ['Patient No', 'First Name', 'Last Name', 'Gender', 'Patient Type', 'Insurance', 'ID Number', 'Date Registered'];
        doc.autoTable({
            head: [columns],
            body: tableData,
            startY: 20,
        });

        doc.save('patients.pdf');
        console.log('PDF downloaded');
    };

    // Function to handle search input change
    const handleSearch = (value) => {
        setSearchQuery(value);
    };

    // Filter patients based on search query
    const filteredPatients = patients.filter(patient => 
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.idNumber.includes(searchQuery)
    );

    // Calculate pagination data
    const totalPatients = filteredPatients.length;
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalPatients);
    const patientsToDisplay = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className='container'>
            <h4 className='text-center p-3'>Patients List</h4>
            <Search 
                placeholder="Search by Name or ID Number"
                onSearch={handleSearch}
                style={{ marginBottom: '20px' }} // Add some spacing
            />
            <div className='d-flex justify-content-between'>
                <Button 
                    type="primary" 
                    onClick={handleNewPatient} 
                    style={{ marginBottom: '20px' }} // Add some spacing below the button
                >
                    Register New Patient
                </Button>
                <div className='d-flex justify-content-end align-items-center'>
                    <Button 
                        type="default" 
                        onClick={downloadExcel} 
                        style={{ marginBottom: '20px', marginRight: '10px', backgroundColor: 'green', color: 'white', border: 'none' }} // Add some spacing
                    >
                        Download Excel
                    </Button>
                    <Button 
                        type="default" 
                        onClick={downloadPDF} 
                        style={{ marginBottom: '20px', backgroundColor: 'red', color: 'white', border: 'none' }} // Add some spacing
                    >
                        Download PDF
                    </Button>
                </div>
            </div>
            <p>Showing {startRecord} to {endRecord} of {totalPatients} records</p>
            <Table 
                columns={columns} 
                dataSource={patientsToDisplay} // Use filtered and paginated patients here
                loading={loading} 
                pagination={false} // Disable Ant Design pagination to use custom pagination
                rowKey={(record) => record.id} // Assuming each patient has a unique id
            />
            <Pagination 
                current={currentPage} 
                pageSize={pageSize} 
                total={totalPatients} 
                onChange={page => setCurrentPage(page)} // Update current page
                style={{ margin: '20px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }} // Align pagination to the right
            />
        </div>
    );
};

export default Patientlist;

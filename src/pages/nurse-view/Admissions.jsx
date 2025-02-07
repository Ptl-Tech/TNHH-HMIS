
import { Button, Table } from "antd"
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsultationRoomListSlice } from "../../actions/nurse-actions/getConsultationRoomSlice";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
import useAuth from "../../hooks/useAuth";
import useSetTablePagination from "../../hooks/useSetTablePagination";
import { useNavigate } from "react-router-dom";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import FilterConsultationRoom from "../../partials/nurse-partials/FilterConsultationRoom";
import { CommentOutlined } from "@ant-design/icons";

const Admissions = () => {

    const [searchName, setSearchName] = useState('');
    const [searchPatientNumber, setSearchPatientNumber] = useState('');
    const [searchVisitNumber, setSearchVisitNumber] = useState('')

    const { loadingConsultationRoomList, consultationRoomList } = useSelector(state => state.getConsultationRoom);
    const { loadingWaitingList, triageWaitingList } = useSelector(state => state.getTriageWaitingList);
    const { loading, data } = useSelector(state => state.getDoctorsList);

    const userDetails = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
 
    const columns = [
        {
            title: 'Treatment No',
            dataIndex: 'TreatmentNo',
            key: 'TreatmentNo',
            filteredValue: searchVisitNumber ? [searchVisitNumber] : null,
            onFilter: (value, record) =>
            record.TreatmentNo ?
            record.TreatmentNo.toLowerCase().includes(value.toLowerCase()) : false,
        },
        {
            title: 'Patient No',
            dataIndex: 'PatientNo',
            key: 'PatientNo',
            filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
            onFilter: (value, record) =>
                record?.PatientNo ? record.PatientNo.toLowerCase().includes(value.toLowerCase()) : false,
        },
        {
            title: 'Patient Names',
            dataIndex: 'SearchName',
            key: 'SearchName',
            filteredValue: searchName ? [searchName] : null,
            onFilter: (value, record) => 
                record.SearchName 
                ? record.SearchName.toLowerCase().includes(value.toLowerCase()) 
                : false,
            render: (_, record) => {
                return <Button type="link" onClick={()=>handleNavigate(record)} style={{ color: '#0f5689' }}>
                    {record.SearchName}
                </Button>
            }
        },
        {
            title: 'Treatment Type',
            dataIndex: 'TreatmentType',
            key: 'TreatmentType',
           
        },
        {
            title: 'Doctor',
            dataIndex: 'DoctorsName',
            key: 'DoctorsName',
        },
        {
            title: 'Clinic',
            dataIndex: 'Clinic',
            key: 'Clinic',
        },
        {
            title: 'Date',
            dataIndex: 'TreatmentDate',
            key: 'TreatmentDate',
            sorter: (a, b) => new Date(a.TreatmentDate) - new Date(b.TreatmentDate), // Compare the dates
            render: (date) => new Date(date).toLocaleDateString(), // Format the date display (optional)
        }
    ];
    

    const handleNavigate = (record) => {
        if(userDetails.userData.departmentName === 'Nurse'){
         navigate(`/Nurse/Consultation/Patient?TreatmentNo=${record?.TreatmentNo}`, {
           state: { patientDetails: record },
         });
        }else{
            navigate(`/Doctor/Consultation/Patient?TreatmentNo=${record?.TreatmentNo}`, {
                state: { patientDetails: record },
            });
        }
       };   
    const filteredConsultationRooms = useMemo(
        () => consultationRoomList.filter(room => room?.Status === 'New'),
        [consultationRoomList]
    );
    
    console.log('filter consultation rooms', filteredConsultationRooms)
    const formattedTriageWaitingList = useMemo(() => {
        return triageWaitingList?.map(patient => ({
            PatientNo: patient?.PatientNo,
            SearchName: patient?.SearchName,
        }));
    }, [triageWaitingList]);
    
    const formattedDoctorDetails = useMemo(() => {
        return data?.map(doctor => ({
            DoctorID: doctor?.DoctorID,
            DoctorsName: doctor?.DoctorsName,
        }));
    }, [data]);

    const combinedList = useMemo(() => {
        return filteredConsultationRooms?.map(room => {
            const matchingPatient = formattedTriageWaitingList?.find(patient => patient?.PatientNo === room?.PatientNo);
            return {
                ...room,
                PatientNo: room?.PatientNo,
                SearchName: matchingPatient ? matchingPatient?.SearchName : null,
            };
        });
    }, [filteredConsultationRooms, formattedTriageWaitingList]);
 
    const combinedListWithDoctors = useMemo(() => {
        return combinedList?.map(item => {
            const matchingDoctor = formattedDoctorDetails?.find(doctor => doctor?.DoctorID === item?.DoctorID);
            return {
                ...item,
                DoctorsName: matchingDoctor ? matchingDoctor?.DoctorsName : null,
            };
        });
    }, [combinedList, formattedDoctorDetails]);

    const { pagination, handleTableChange } = useSetTablePagination(combinedListWithDoctors);

    useEffect(() => {
    if (!data?.length) {
    dispatch(listDoctors());
    }
    }, [dispatch, data?.length]);

    useEffect(() => {
    dispatch(getTriageWaitingList());
    }, [dispatch]);

    useEffect(() => {
    dispatch(getConsultationRoomListSlice());
    }, [dispatch]);
    


return (
<div style={{ margin: '20px 10px 10px 10px' }}>
  
    <NurseInnerHeader title="Consultation Room" icon={<CommentOutlined />} />

    <FilterConsultationRoom setSearchName={setSearchName} setSearchPatientNumber={setSearchPatientNumber} setSearchAdmissionNumber={setSearchVisitNumber}/>

    {
    loadingConsultationRoomList || loadingWaitingList || loading ? (
        <Loading />
    ) : (
        <Table 
        columns={columns} 
        // rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        dataSource={combinedListWithDoctors} 
        className="admit-patient-table"
        bordered size='middle' 
        pagination={{
            ...pagination,
            total: combinedListWithDoctors?.length,
            showSizeChanger: true,
            showQuickJumper: true,
            position: ['bottom', 'right'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            onChange: (page, pageSize) => handleTableChange({ current: page, pageSize, total: pagination.total }),
            onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size, total: pagination.total }),
            style: {
                marginTop: '30px',
            }
            }}
        />
    )
    }
</div>
);
}

export default Admissions;

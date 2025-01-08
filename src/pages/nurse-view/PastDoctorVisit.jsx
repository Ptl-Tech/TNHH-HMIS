
import { Space, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsultationRoomListSlice } from "../../actions/nurse-actions/getConsultationRoomSlice";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import Loading from "../../partials/nurse-partials/Loading";
import useSetTablePagination from "../../hooks/useSetTablePagination";
import SearchFilters from "./SearchFilters";

const PastDoctorVisit = () => {
 
    const columns = [
        {
            title: 'Treatment No',
            dataIndex: 'treatmentNo',
            key: 'treatmentNo',
        },
        {
            title: 'Patient No',
            dataIndex: 'patientNo',
            key: 'patientNo',
        },
        {
            title: 'Patient Names',
            dataIndex: 'names',
            key: 'names',
        },
        {
            title: 'Treatment Type',
            dataIndex: 'treatmentType',
            key: 'treatmentType',
           
        },
        {
            title: 'Doctor',
            dataIndex: 'doctor',
            key: 'doctor',
        },
        {
            title: 'Clinic',
            dataIndex: 'clinic',
            key: 'clinic',
        },
        {
            title: 'Date',
            dataIndex: 'treatmentDate',
            key: 'treatmentDate',
        }
    ];

    const { loadingConsultationRoomList, consultationRoomList } = useSelector(state => state.getConsultationRoom);
    const { triageWaitingList } = useSelector(state => state.getTriageWaitingList);
    const { data } = useSelector(state => state.getDoctorsList);

    const dispatch = useDispatch();
    
    const filteredConsultationRooms = useMemo(
        () => consultationRoomList.filter(room => room?.Status === 'New'),
        [consultationRoomList]
    );
    
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

    const dataSource = combinedListWithDoctors?.map((item, index) => ({
    key: index + 1,
    treatmentNo: item?.TreatmentNo,
    patientNo: item?.PatientNo,
    names: item?.SearchName,
    treatmentDate: item?.TreatmentDate,
    treatmentType: item?.TreatmentType,
    clinic: item?.Clinic,
    doctor: item?.DoctorsName,
    })).sort((a, b) => new Date(b?.treatmentDate) - new Date(a?.treatmentDate));

    

    useEffect(() => {
    if (!data?.length) {
    dispatch(listDoctors());
    }
    }, [dispatch, data?.length]);

    useEffect(() => {
    if (!triageWaitingList?.length) {
    dispatch(getTriageWaitingList());
    }
    }, [dispatch, triageWaitingList?.length]);

    useEffect(() => {
    if (!consultationRoomList?.length) {
    dispatch(getConsultationRoomListSlice());
    }
    }, [dispatch, consultationRoomList?.length]);
    


return (
<div style={{ margin: '20px 10px 10px 10px' }}>
  <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', position: 'relative'}}>
      <ProfileOutlined />
      <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '16px'}}>
          Past Doctors Visits
      </Typography.Text>
    </Space>

    <SearchFilters />

    {
    loadingConsultationRoomList ? (
        <Loading />
    ) : (
        <Table 
        columns={columns} 
        // rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
        dataSource={dataSource} 
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

export default PastDoctorVisit;


import { Button, Card, Col, Input, Row, Table, Typography } from "antd"
import { ProfileOutlined } from "@ant-design/icons"
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsultationRoomListSlice } from "../../actions/nurse-actions/getConsultationRoomSlice";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { listDoctors } from "../../actions/DropdownListActions";
import useSetTablePagination from "../../hooks/useSetTablePagination";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PastDoctorVisit = () => {

    const navigate = useNavigate();
    const userDetails = useAuth();
    const [showList, setShowList] = useState(false);
    const [filteredPatients, setFilteredPatients] = useState([]);

    console.log('filtared patients', filteredPatients)

    const [searchParams, setSearchParams] = useState({
        SearchName: "",
        visitNo: "",
        patientNo: "",
      });


      const handleSearchChange = (e, field) => {
        const value = e.target.value;
        setSearchParams((prevState) => ({
          ...prevState,
          [field]: value,
        }));
        setShowList(true);
        filterPatients({ ...searchParams, [field]: value });
      };

    const handleNavigate = (record) => {
        if(userDetails.userData.departmentName === 'Nurse'){
         navigate(`/Nurse/Past-doctor-visit/Patient?PatientNo=${record?.PatientNo}`, {
           state: { patientDetails: record },
         });
        }else if(userDetails.userData.departmentName === 'Doctor'){
            navigate(`/Doctor/Past-doctor-visit/Patient?PatientNo=${record?.PatientNo}`, {
                state: { patientDetails: record },
            });
        }else{
            navigate(`/Psychology/Past-doctor-visit/Patient?PatientNo=${record?.PatientNo}`, {
                state: { patientDetails: record },
            });
        }
       }; 
 
    const columns = [
      {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        render: (_, __, index) => index + 1,
      },
        {
            title: 'Patient No',
            dataIndex: 'PatientNo',
            key: 'PatientNo',
        },
        {
            title: 'Patient Names',
            dataIndex: 'SearchName',
            key: 'SearchName',
                render: (_, record) => {
                    return <Button type="link" onClick={()=>handleNavigate(record)} style={{ color: '#0f5689', fontWeight: 'bold' }}>
                        {record.SearchName}
                    </Button>
                }
        },
        {
            title: 'Date of Birth',
            dataIndex: 'DateOfBirth',
            key: 'DateOfBirth',
           
        },
        {
            title: 'ID Number',
            dataIndex: 'IDNumber',
            key: 'IDNumber',
        },
        {
            title: 'File No',
            dataIndex: 'FileNo',
            key: 'FileNo',
        },
        {
          title: 'Telephone',
          dataIndex: 'TelephoneNo1',
          key: 'TelephoneNo1',
        },
        {
            title: 'Date',
            dataIndex: 'DateRegistered',
            key: 'DateRegistered',
            sorter: (a, b) => new Date(a.TreatmentDate) - new Date(b.TreatmentDate), // Compare the dates
            render: (date) => new Date(date).toLocaleDateString(), // Format the date display (optional)
        }
    ];
    

    // const { loadingConsultationRoomList, consultationRoomList } = useSelector(state => state.getConsultationRoom);
    const { loadingWaitingList, triageWaitingList } = useSelector(state => state.getTriageWaitingList);
    const { data } = useSelector(state => state.getDoctorsList);

    console.log('patient list', triageWaitingList)

    const dispatch = useDispatch();

    
    // const filteredConsultationRooms = useMemo(
    //     () => consultationRoomList.filter(room => room?.Status === 'Completed'),
    //     [consultationRoomList]
    // );
    
    // const formattedTriageWaitingList = useMemo(() => {
    //     return triageWaitingList?.map(patient => ({
    //         PatientNo: patient?.PatientNo,
    //         SearchName: patient?.SearchName,
    //     }));
    // }, [triageWaitingList]);
    
    // const formattedDoctorDetails = useMemo(() => {
    //     return data?.map(doctor => ({
    //         DoctorID: doctor?.DoctorID,
    //         DoctorsName: doctor?.DoctorsName,
    //     }));
    // }, [data]);

    // const combinedList = useMemo(() => {
    //     return filteredConsultationRooms?.map(room => {
    //         const matchingPatient = formattedTriageWaitingList?.find(patient => patient?.PatientNo === room?.PatientNo);
    //         return {
    //             ...room,
    //             PatientNo: room?.PatientNo,
    //             SearchName: matchingPatient ? matchingPatient?.SearchName : null,
    //         };
    //     });
    // }, [filteredConsultationRooms, formattedTriageWaitingList]);
    
    // const combinedListWithDoctors = useMemo(() => {
    //     return combinedList?.map(item => {
    //         const matchingDoctor = formattedDoctorDetails?.find(doctor => doctor?.DoctorID === item?.DoctorID);
    //         return {
    //             ...item,
    //             DoctorsName: matchingDoctor ? matchingDoctor?.DoctorsName : null,
    //         };
    //     });
    // }, [combinedList, formattedDoctorDetails]);

    const filterPatients = useMemo(() => {
      return (params) => {
        const { SearchName, visitNo, patientNo } = params;
        
        const filtered = triageWaitingList.filter((patient) => {
          return (
            patient.SearchName.toLowerCase().includes(SearchName.toLowerCase()) &&
            patient.PatientNo.toLowerCase().includes(visitNo.toLowerCase()) &&
            patient.IDNumber.toLowerCase().includes(patientNo.toLowerCase())
          );
        });
    
        setFilteredPatients(filtered);
      };
    }, [triageWaitingList]);

    const { pagination, handleTableChange } = useSetTablePagination(filterPatients);

    

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
  
    <NurseInnerHeader title="Past Doctor Visit" icon={<ProfileOutlined />} />


    <Card className="card-header mb-4 mt-4 p-4">
        <Typography.Text
          style={{
            color: "#003F6D",
            fontWeight: "bold",
            marginBottom: "16px",
          }}
        >
          Find Patient Details by:
        </Typography.Text>
        <Row gutter={16} className="mt-2">
          <Col span={8}>
            <Input.Search
              size="large"
              placeholder="Patient Name"
              value={searchParams.SearchName}
              onChange={(e) => handleSearchChange(e, "SearchName")}
              allowClear
            />
          </Col>
          <Col span={8}>
            <Input.Search
              size="large"
              placeholder="ID Number"
              value={searchParams.visitNo}
              onChange={(e) => handleSearchChange(e, "visitNo")}
              allowClear
              onSearch={() => filterPatients(searchParams)}
            />
          </Col>
          <Col span={8}>
            <Input.Search
              size="large"
              placeholder="Patient No"
              value={searchParams.patientNo}
              onChange={(e) => handleSearchChange(e, "patientNo")}
              allowClear
            />
          </Col>
        </Row>
      </Card>

        {
            showList && (
                <Table 
        columns={columns} 
        // rowSelection={rowSelection}
        rowKey={(record) => record.TreatmentNo}
        scroll={{ x: 'max-content' }}
        loading={loadingWaitingList}
        dataSource={filteredPatients} 
        className="admit-patient-table"
        bordered size='middle' 
        pagination={{
            ...pagination,
            total: filteredPatients?.length,
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

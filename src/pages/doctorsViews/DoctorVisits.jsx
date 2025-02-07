import { Button, message, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getOutPatientTreatmentList } from "../../actions/Doc-actions/OutPatientAction";
import Loading from "../../partials/nurse-partials/Loading";
import ConsultationRoomSummeryCard from "./ConsultationRoomSummeryCard";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import {
  getUrgencyColorcode,
  rowClassName,
} from "../../utils/helpers";
import { postCheckInPatient } from "../../actions/Doc-actions/postCheckInPatient";
import useAuth from "../../hooks/useAuth";
import FilterConsultationRoom from "../../partials/nurse-partials/FilterConsultationRoom";
const DoctorVisits = () => {
  const role = useAuth().userData.departmentName
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [searchName, setSearchName] = useState('');
  const [searchPatientNumber, setSearchPatientNumber] = useState('');
  const [searchVisitNumber, setSearchVisitNumber] = useState('')

  const { loadingWaitingList, triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList
    );
  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList);
    const { loadingCheInPatient: checkInLoading } =
    useSelector((state) => state.checkInConsulation);

  useEffect(() => {
    dispatch(getTriageWaitingList());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  // console.log('consultation Room list', treatmentList);

  const openDoctorVisitList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "New" && item.Clinic === "PSYCHIATRIST";
    } else if (role === "Psychology") {
      return item.Status === "New" && item.Clinic === "PSYCHOLOGIST";
    }
    return item.Status === "New";
  });

  const activeConsultationList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Active" && item.Clinic === "PSYCHIATRIST";
    }else if (role === "Psychology") {
      return item.Status === "Active" && item.Clinic === "PSYCHOLOGIST";
    }
    return item.Status === "Active";
  });

  const closedConsultationList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Completed" && item.Clinic === "PSYCHIATRIST";
    }else if (role === "Psychology") {
      return item.Status === "Completed" && item.Clinic === "PSYCHOLOGIST";
    }
    return item.Status === "Completed";
  });

  const openDoctorVisitListWithPatientDetails = patients?.map((patient) => ({
    PatientNo: patient.PatientNo,
    SearchName: patient.SearchName,
    IDNumber: patient.IDNumber,
    Age: patient.AgeinYears,
    PatientType: patient.PatientType,
    Inpatient: patient.Inpatient, 
  }));
 
  const combinedList = openDoctorVisitList.map((room) => {
    const matchingPatient = openDoctorVisitListWithPatientDetails.find(
      (patient) => patient.PatientNo === room.PatientNo 
    );

    return {
      ...room,
      PatientNo: room?.PatientNo,
      SearchName: matchingPatient ? matchingPatient.SearchName : "",
      IDNumber: matchingPatient ? matchingPatient.IDNumber : "",
      Age: matchingPatient ? matchingPatient.Age : "",
      PatientType: matchingPatient ? matchingPatient.PatientType : "",
      Inpatient: matchingPatient ? matchingPatient.Inpatient : "",
    };
  });

  const waitingListColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Treatment No",
      dataIndex: "TreatmentNo",
      key: "TreatmentNo",
      filteredValue: searchVisitNumber ? [searchVisitNumber] : null,
      onFilter: (value, record) =>
        record?.TreatmentNo ?
        record.TreatmentNo.toLowerCase().includes(value.toLowerCase()) : false,
      render: (_, record) => {
        const { color } = getUrgencyColorcode(record.UrgencyStatus)
        return (
          <span
            onClick={() => handleNavigate(record, record.TreatmentNo)}
            className="fw-bold"
            style={{ color: color }}
          >
            {record.TreatmentNo}
          </span>
        )
      }
    },
    {
      title: "Patient Name",
      dataIndex: "SearchName",
      key: "SearchName",
      filteredValue: searchName ? [searchName] : null,
      onFilter: (value, record) =>
        record?.SearchName ?
        record.SearchName.toLowerCase().includes(value.toLowerCase()) : false,
      render: (text, record) => {
        return (
          <span
        onClick={
          role !== "Nurse" ? () => handleNavigate(record, record.TreatmentNo) : undefined
        }
        className="fw-bold"
        style={{
          color: role !== "Nurse" ? "#0f5689" : "inherit",
          cursor: role !== "Nurse" ? "pointer" : "default",
        }}
      >
        {record?.SearchName}
      </span>
        );
      },
    },
    {
      title: "Patient No",
      dataIndex: "PatientNo",
      key: "PatientNo",
      filteredValue: searchPatientNumber ? [searchPatientNumber] : null,
      onFilter: (value, record) =>
        record?.PatientNo ?
        record.PatientNo.toLowerCase().includes(value.toLowerCase()) : false,
    },

    {
      title: "ID Number",
      dataIndex: "IDNumber",
      key: "IDNumber",
    },
    {
      title: "Treatment Date",
      dataIndex: "TreatmentDate",
      key: "TreatmentDate",
    },
    {
      title: "Waiting Time",
      dataIndex: "TreatmentTime",
      key: "TreatmentTime",
      render: (_, record) => {
        const combinedDateTime = `${record.TreatmentDate}T${record.TreatmentTime}`;
        const elapsedMinutes = dayjs().diff(dayjs(combinedDateTime), "minute");
        const hours = Math.floor(elapsedMinutes / 60);
        const minutes = elapsedMinutes % 60;

        return `${hours}h ${minutes}m`;
      },
    },
    {
      title: "Patient Type",
      dataIndex: "PatientType",
      key: "PatientType",
    },
    {
      title: "Age",
      dataIndex: "Age",
      key: "Age",
      render: (_, record) => {
        return <span>{record.Age} years</span>;
      },
    },
    // {
    //   title:"Inpatient",
    //   dataIndex: "Inpatient",
    //   key: "Inpatient",
    //   render: (_, record) => {
    //     return <span>{record.Inpatient ? "Yes" : "No"}</span>;
    //   },
    // },

    {
      title: "Urgency",
      dataIndex: "UrgencyStatus",
      key: "UrgencyStatus",
      render: (_, record) => {
        const { color, text } = getUrgencyColorcode(record.UrgencyStatus);
        return (
          <Tag
            color={color}
            // text={text} // Display urgency text
            className="fw-bold"
            // style={{ 
            //   color: color,
            // }}
          >{text}</Tag>
        );
      },
    },

    ...role !== "Nurse" ? [
      {
        title: "Check In",
        key: "checkIn",
        render: (_, record) => (
          <Button
            type="primary"
            onClick={() => handleNavigate(record, record.TreatmentNo)}
          >
            <CheckOutlined /> Check In
          </Button>
        ),
      },
    ] : []
  ];

  const handleNavigate = (record, treatmentNo) => {
    dispatch(postCheckInPatient(treatmentNo)).then((data)=>{
      if(data.status==='success'){
        message.success('Patient checked in to the Consultation Room ')
        navigate(
          role === "Doctor"
            ? `/Doctor/Consultation/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`
            : role === "Psychology"
            ? `/Psychology/Consultation/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`
            : `/Nurse/Consultation/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`,
          {
            state: {
              patientNo: record.PatientNo,
              observationNo: record.ObservationNo,
              patientDetails: record,
            },
          }
        );
        
      }else{
        message.error('An error occurred, please try again')
      }
    })
   
  };

  return (
    <div style={{ padding: "10px 10px" }}>
      <ConsultationRoomSummeryCard
        currentPath={currentPath}
        openDoctorVisitList={openDoctorVisitList}
        activeConsultationList={activeConsultationList}
        closedConsultationList={closedConsultationList}
      />
      
      <FilterConsultationRoom setSearchName={setSearchName} setSearchPatientNumber={setSearchPatientNumber} setSearchVisitNumber={setSearchVisitNumber}/>

      {loadingWaitingList || treatmentListLoading ? (
        <Loading />
      ) : (
        <Table
          columns={waitingListColumns}
          dataSource={combinedList}
          bordered
          size="middle"
          rowClassName={rowClassName} // Apply the row color
          pagination={{
            position: ["bottom", "right"],
            showSizeChanger: true,
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}
    </div>
  );
};


export default DoctorVisits;

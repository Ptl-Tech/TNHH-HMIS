import { Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { getOutPatientTreatmentList } from "../../../actions/Doc-actions/OutPatientAction";
import Loading from "../../../partials/nurse-partials/Loading";
import ConsultationRoomSummeryCard from "../ConsultationRoomSummeryCard";
import { getTriageWaitingList } from "../../../actions/triage-actions/getTriageWaitingListSlice";
import {
  rowClassName,
} from "../../../utils/helpers";
import FilterConsultationRoom from "../../../partials/nurse-partials/FilterConsultationRoom";
import useAuth from "../../../hooks/useAuth";
const CloseList = () => {
  const role = useAuth().userData.departmentName
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchName, setSearchName] = useState('');
  const [searchPatientNumber, setSearchPatientNumber] = useState('');
  const [searchVisitNumber, setSearchVisitNumber] = useState('')
  

  const { triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList
  );
  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList);

  useEffect(() => {
    dispatch(getTriageWaitingList());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  const openDoctorVisitList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "New" && item.Clinic === "PSYCHIATRY";
    } else if (role === "psychology") {
      return item.Status === "New" && item.Clinic === "PSYCHOLOGY";
    }
    return item.Status === "New";
  });

  const activeConsultationList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Active" && item.Clinic === "PSYCHIATRY";
    }else if (role === "psychology") {
      return item.Status === "Active" && item.Clinic === "PSYCHOLOGY";
    }
    return item.Status === "Active";
  });

  const closedConsultationList = treatmentList?.filter((item) => {
    if (role === "Doctor") {
      return item.Status === "Completed" && item.Clinic === "PSYCHIATRY";
    }else if (role === "Psychology") {
      return item.Status === "Completed" && item.Clinic === "PSYCHOLOGY";
    }
    return item.Status === "Completed";
  });

  const closedConsultationListWithPatientDetails = patients?.map((patient) => ({
    PatientNo: patient.PatientNo,
    SearchName: patient.SearchName,
    IDNumber: patient.IDNumber,
    Age: patient.AgeinYears,
    PatientType: patient.PatientType,
    Inpatient: patient.Inpatient, 

  }));

  const combinedList = closedConsultationList.map((room) => {
    const matchingPatient = closedConsultationListWithPatientDetails.find(
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
      render: (text) => (
        <span
          onClick={() => handleNavigate(text, text.TreatmentNo)}
          className="fw-bold"
          style={{ color: "green" }}
        >
          {text}
        </span>
      ),
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
            onClick={() => handleNavigate(record, record.TreatmentNo)}
            className="fw-bold"
            style={{ color: "#0f5689", cursor: "pointer" }}
          >
            {text.toUpperCase()}
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
    //   title: "Urgency",
    //   dataIndex: "urgency",
    //   key: "urgency",
    //   render: (_, record) => {
    //     const { color, text } = getUrgencyColorcode(record.urgency);
    //     return (
    //       <Badge
    //         color={color}
    //         text={text} // Display urgency text
    //         style={{ color: color }}
    //       />
    //     );
    //   },
    // },
    {
      title: "Completion Status",
      dataIndex: "UrgencyStatus",
      key: "UrgencyStatus",
      render: (_, record) => {
        return <span className="fw-bold text-dark">{record.UrgencyStatus} </span>;
      },
    },
    /* {
      title: "Check In",
      key: "checkIn",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleNavigate(record, record.treatmentNo)}
        >
          <CheckOutlined /> Check In
        </Button>
      ),
    }, */
  ];

  const handleNavigate = (record, treatmentNo) => {
    navigate(`/Doctor/Consultation/Patient?TreatmentNo=${treatmentNo}`, {
      state: {
        patientNo: record.PatientNo,
        observationNo: record.ObservationNo,
      },
    });
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

      {treatmentListLoading ? (
        <Loading />
      ) : (
        <Table
          columns={waitingListColumns}
          dataSource={combinedList}
          bordered
          size="small"
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


export default CloseList;

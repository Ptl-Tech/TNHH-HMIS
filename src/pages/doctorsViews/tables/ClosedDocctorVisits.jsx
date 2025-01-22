import { Badge, Button, Card, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getOutPatientTreatmentList } from "../../../actions/Doc-actions/OutPatientAction";
import { listPatients } from "../../../actions/patientActions";
import Loading from "../../../partials/nurse-partials/Loading";
import ConsultationRoomSummeryCard from "../ConsultationRoomSummeryCard";
import Search from "antd/es/transfer/search";
import { getTriageWaitingList } from "../../../actions/triage-actions/getTriageWaitingListSlice";
import {
  getColorByWaitingTreatmentTime,
  getUrgencyColorcode,
  rowClassName,
} from "../../../utils/helpers";
import { render } from "react-dom";
const CloseList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;
  const currentDate = new Date();

  const [searchParams, setSearchParams] = useState({
    name: "",
    patientNo: "",
    treatmentNo: "",
    urgency: "",
  });

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
 
  const closedConsultationList = treatmentList?.filter(
    (item) => item.Status === "Completed" 
  );

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

 
  const waitingListTableDataSource = combinedList
  .filter((item) => item.Inpatient !== true)
  ?.map((item, index) => ({
    key: index + 1,
    treatmentNo: item?.TreatmentNo,
    patientNo: item?.PatientNo,
    observationNo: item?.ObservationNo,
    treatmentDate: item?.TreatmentDate,
    treatmentTime: item?.TreatmentTime,
    searchName: item?.SearchName,
    idNumber: item?.IDNumber,
    age: item?.Age,
    patientType: item?.PatientType,
    urgency: item?.UrgencyStatus,
    Inpatient: item?.Inpatient,
    Status: item?.Status,
  }))
  .sort((a, b) => new Date(a.treatmentDate) - new Date(b.treatmentDate));

  const [filteredPatients, setFilteredPatients] = useState(waitingListTableDataSource);

  const handleSearchChange = (e, field) => {
    const value = e.target.value;
    setSearchParams((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    handleFilterPatients({ ...searchParams, [field]: value });
  };

  const handleFilterPatients = () => {
    const isSearching = Object.values(searchParams).some(
      (value) => value.trim() !== ""
    );
  
    if (isSearching) {
      const filtered = waitingListTableDataSource.filter((patient) => {
        const treatmentNo = patient.treatmentNo?.toLowerCase() || "";
        const patientNo = patient.patientNo?.toLowerCase() || "";
        const searchName = patient.searchName?.toLowerCase() || "";
        const urgency = patient.UrgencyStatus || "";
  
        return (
          treatmentNo.includes(searchParams.treatmentNo.toLowerCase()) &&
          searchName.includes(searchParams.searchName.toLowerCase()) &&
          patientNo.includes(searchParams.patientNo.toLowerCase()) &&
          urgency.includes(searchParams.urgency)
        );
      });
  
      // Apply inpatient filter after search filter
      const filteredWithoutInpatients = filtered.filter(
        (item) => item.Inpatient !== true
      );
      setFilteredPatients(filteredWithoutInpatients);
    } else {
      setFilteredPatients(waitingListTableDataSource);
    }
  };
  
  const waitingListColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Treatment No",
      dataIndex: "treatmentNo",
      key: "treatmentNo",
      render: (text) => (
        <span
          onClick={() => handleNavigate(text, text.treatmentNo)}
          className="fw-bold"
          style={{ color: "green" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Patient Name",
      dataIndex: "searchName",
      key: "searchName",
      filterSearch: true,
      filters: [
        ...new Set(
          waitingListTableDataSource.map((item) => ({
            text: item.searchName,
            value: item.searchName,
          }))
        ),
      ],
      onFilter: (value, record) => record.searchName.includes(value),
      filterIcon: <SearchOutlined style={{ color: "rgba(0, 0, 0, 0.85)" }} />,
      render: (text, record) => {
        return (
          <span
            onClick={() => handleNavigate(record, record.treatmentNo)}
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
      dataIndex: "patientNo",
      key: "patientNo",
    },

    {
      title: "ID Number",
      dataIndex: "idNumber",
      key: "idNumber",
    },
    {
      title: "Treatment Date",
      dataIndex: "treatmentDate",
      key: "treatmentDate",
    },
    {
      title: "Waiting Time",
      dataIndex: "treatmentTime",
      key: "treatmentTime",
      render: (_, record) => {
        const combinedDateTime = `${record.treatmentDate}T${record.treatmentTime}`;
        const elapsedMinutes = dayjs().diff(dayjs(combinedDateTime), "minute");
        const hours = Math.floor(elapsedMinutes / 60);
        const minutes = elapsedMinutes % 60;

        return `${hours}h ${minutes}m`;
      },
    },
    {
      title: "Patient Type",
      dataIndex: "patientType",
      key: "patientType",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (_, record) => {
        return <span>{record.age} years</span>;
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
      dataIndex: "Status",
      key: "Status",
      render: (_, record) => {
        return <span className="fw-bold text-dark">{record.Status} </span>;
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
        patientNo: record.patientNo,
        observationNo: record.observationNo,
      },
    });
  };

  return (
    <div style={{ padding: "10px 10px" }}>
      <ConsultationRoomSummeryCard
        waitingPatient={waitingListTableDataSource}
        currentPath={currentPath}
        closedConsultationList={waitingListTableDataSource}
      />
      <Card
        style={{
          padding: "10px 16px",
          marginBottom: "10px",
          backgroundColor: "#fcfafa",
        }}
      >
        <div className="admit-patient-filter-container">
          <Search
            placeholder="Search by Treatment No"
            allowClear
            value={searchParams.treatmentNo}
            onChange={(e) => handleSearchChange(e, "treatmentNo")}
          />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Search
            placeholder="Search by Patient Name"
            allowClear
            value={searchParams.searchName}
            onChange={(e) => handleSearchChange(e, "searchName")}
          />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Search
            placeholder="Search by Patient No"
            allowClear
            value={searchParams.patientNo}
            onChange={(e) => handleSearchChange(e, "patientNo")}
          />
          <span style={{ color: "gray", fontSize: "14px", fontWeight: "bold" }}>
            or
          </span>
          <Search
            placeholder="Search by Urgency Status"
            allowClear
            value={searchParams.urgency}
            onChange={(e) => handleSearchChange(e, "urgency")}
          />
        </div>
      </Card>
      {treatmentListLoading ? (
        <Loading />
      ) : (
        <Table
          columns={waitingListColumns}
          dataSource={filteredPatients}
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

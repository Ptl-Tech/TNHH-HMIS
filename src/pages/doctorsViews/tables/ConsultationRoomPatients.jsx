import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Table } from "antd";

import { useAbility } from "../../../hooks/casl";
import { rowClassName } from "../../../utils/helpers";
import Loading from "../../../partials/nurse-partials/Loading";

import { getOutPatientTreatmentList } from "../../../actions/Doc-actions/OutPatientAction";
import { getTriageWaitingList } from "../../../actions/triage-actions/getTriageWaitingListSlice";

import { waitingListColumns } from "./tables-utils";
import ConsultationRoomSummeryCard from "../ConsultationRoomSummeryCard";
import FilterConsultationRoom from "../../../partials/nurse-partials/FilterConsultationRoom";
import { subject } from "@casl/ability";

const ConsultationRoomPatients = () => {
  const ability = useAbility();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentPath = location.pathname;

  const [searchName, setSearchName] = useState("");
  const [searchVisitNumber, setSearchVisitNumber] = useState("");
  const [searchPatientNumber, setSearchPatientNumber] = useState("");

  const { loadingWaitingList, triageWaitingList: patients } = useSelector(
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

  const canReadOwnConsultationNotes = (doctorId) =>
    ability.can("read", subject("ownConsultationNotes", { doctorId }));
  
  const filterByStatus = (status) =>
    treatmentList?.filter(
      (item) =>
        canReadOwnConsultationNotes(item?.DoctorID) && item.Status === status
    );

  const openDoctorVisitList = filterByStatus("New");
  const activeConsultationList = filterByStatus("Active");
  const closedConsultationList = filterByStatus("Completed");

  const closedConsultationListWithPatientDetails = patients?.map((patient) => ({
    PatientNo: patient.PatientNo,
    SearchName: patient.SearchName,
    IDNumber: patient.IDNumber,
    Age: patient.AgeinYears,
    PatientType: patient.PatientType,
    Inpatient: patient.Inpatient,
  }));

  const combinedList = activeConsultationList?.map((room) => {
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

  const handleNavigate = (record, treatmentNo) => {
    navigate(
      `/Dashboard/Consultation-List/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`,
      {
        state: {
          patientNo: record.PatientNo,
          observationNo: record.ObservationNo,
          patientDetails: record,
        },
      }
    );
  };

  return (
    <div style={{ padding: "10px 10px" }}>
      <ConsultationRoomSummeryCard
        currentPath={currentPath}
        openDoctorVisitList={openDoctorVisitList}
        activeConsultationList={activeConsultationList}
        closedConsultationList={closedConsultationList}
      />

      <FilterConsultationRoom
        setSearchName={setSearchName}
        setSearchPatientNumber={setSearchPatientNumber}
        setSearchVisitNumber={setSearchVisitNumber}
      />

      {treatmentListLoading || loadingWaitingList ? (
        <Loading />
      ) : (
        <Table
          bordered
          size="small"
          dataSource={combinedList}
          rowClassName={rowClassName} // Apply the row color
          columns={waitingListColumns({
            handleNavigate,
            searchName,
            searchVisitNumber,
            searchPatientNumber,
          })}
          showSorterTooltip={{ target: "sorter-icon" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            position: ["bottom", "right"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      )}
    </div>
  );
};

export default ConsultationRoomPatients;

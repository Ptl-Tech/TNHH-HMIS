import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { Table } from "antd";

import Loading from "../../../partials/nurse-partials/Loading";
import ConsultationRoomSummeryCard from "../ConsultationRoomSummeryCard";

// import useAuth from '../../../hooks/useAuth';
import { useAbility } from "../../../hooks/casl";
import { rowClassName } from "../../../utils/helpers";

import { waitingListColumns } from "./tables-utils";
import { getOutPatientTreatmentList } from "../../../actions/Doc-actions/OutPatientAction";
import FilterConsultationRoom from "../../../partials/nurse-partials/FilterConsultationRoom";
import { getTriageWaitingList } from "../../../actions/triage-actions/getTriageWaitingListSlice";
import { subject } from "@casl/ability";

export default function CloseList() {
  const ability = useAbility();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const currentPath = location.pathname;
  const [searchName, setSearchName] = useState("");
  const [searchVisitNumber, setSearchVisitNumber] = useState("");
  const [searchPatientNumber, setSearchPatientNumber] = useState("");

  const { triageWaitingList: patients } = useSelector(
    (state) => state.getTriageWaitingList
  );
  const { loading: treatmentListLoading, patients: treatmentList } =
    useSelector((state) => state.docTreatmentList);

  useEffect(() => {
    dispatch(getTriageWaitingList());
    dispatch(getOutPatientTreatmentList());
  }, [dispatch]);

  // TODO: filter the record by own id
  const canReadOwnRecords = (doctorId) =>
    ability.can("read", subject("ownDoctorVisitRecords", { doctorId }));

  console.log({ treatmentList });

  const filterConsultations = (status) => {
    return treatmentList?.filter((item) => {
      const matchesStatus = item.Status === status;
      const matchesDoctor = canReadOwnRecords(item.DoctorID);
      return matchesStatus && matchesDoctor;
    });
  };

  const openDoctorVisitList = useMemo(
    () => filterConsultations("New"),
    [treatmentList]
  );
  const activeConsultationList = useMemo(
    () => filterConsultations("Active"),
    [treatmentList]
  );
  const closedConsultationList = useMemo(
    () => filterConsultations("Completed"),
    [treatmentList]
  );

  const closedConsultationListWithPatientDetails = useMemo(() => {
    return patients?.map((patient) => ({
      PatientNo: patient.PatientNo,
      SearchName: patient.SearchName,
      IDNumber: patient.IDNumber,
      Age: patient.AgeinYears,
      PatientType: patient.PatientType,
      Inpatient: patient.Inpatient,
    }));
  }, [patients]);

  const combinedList = useMemo(() => {
    return closedConsultationList.map((room) => {
      const matchingPatient = closedConsultationListWithPatientDetails.find(
        (patient) => patient.PatientNo === room.PatientNo
      );

      return {
        ...room,
        PatientNo: room?.PatientNo,
        SearchName: matchingPatient?.SearchName || "",
        IDNumber: matchingPatient?.IDNumber || "",
        Age: matchingPatient?.Age || "",
        PatientType: matchingPatient?.PatientType || "",
        Inpatient: matchingPatient?.Inpatient || "",
      };
    });
  }, [closedConsultationList, closedConsultationListWithPatientDetails]);

  const handleNavigate = (record, treatmentNo) => {
    navigate(
      `Dashboard/Consultation-List/Patient?PatientNo=${record.PatientNo}&TreatmentNo=${treatmentNo}`,
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

      {treatmentListLoading ? (
        <Loading />
      ) : (
        <Table
          columns={waitingListColumns({
            searchName,
            handleNavigate,
            searchVisitNumber,
            searchPatientNumber,
            checkInButton: "View Closed",
          })}
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
}

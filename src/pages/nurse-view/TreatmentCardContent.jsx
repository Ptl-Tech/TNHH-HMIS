import { Card, Space, Tabs, Typography } from "antd";
import { useLocation } from "react-router-dom";
import { DiffOutlined } from "@ant-design/icons";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import EncounterListTable from "./tables/nurse-tables/EncounterListTable";
import { getTriageWaitingList } from "../../actions/triage-actions/getTriageWaitingListSlice";
import { getConsultationSlice } from "../../actions/nurse-actions/getConsultationRoomSlice";
import EncounterListInPatientTable from "./tables/nurse-tables/EncounterListInPatientTable";
import { getQyAdmissionsDischargedListSlice } from "../../actions/nurse-actions/getPgInpatientDischargeListSlice";

const TreatmentCardContent = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const patientNo = new URLSearchParams(location.search).get("PatientNo");

  const { loadingConsultationRoomList, consultationRoomList } = useSelector(
    (state) => state.getPatientConsultationList
  );
  const { loading: loadingInpatientEncounters, data: inpatientEncounters } =
    useSelector((state) => state.getInpatientPastEncounters) || {};

  const { triageWaitingList } = useSelector(
    (state) => state.getTriageWaitingList
  );

  const formattedTriageWaitingList = useMemo(() => {
    return triageWaitingList?.map((patient) => ({
      PatientNo: patient?.PatientNo,
      SearchName: patient?.SearchName,
    }));
  }, [triageWaitingList]);

  const combinedList = useMemo(() => {
    return consultationRoomList?.map((room) => {
      const matchingPatient = formattedTriageWaitingList?.find(
        (patient) => patient?.PatientNo === room?.PatientNo
      );
      return {
        ...room,
        PatientNo: room?.PatientNo,
        SearchName: matchingPatient ? matchingPatient?.SearchName : null,
      };
    });
  }, [consultationRoomList, formattedTriageWaitingList]);

  const combinedInpatientList = useMemo(() => {
    return inpatientEncounters?.map((room) => {
      const matchingPatient = formattedTriageWaitingList?.find(
        (patient) => patient?.PatientNo === room?.patientNo
      );
      return {
        ...room,
        PatientNo: room?.patientNo,
        SearchName: matchingPatient ? matchingPatient?.SearchName : null,
      };
    });
  }, [inpatientEncounters, formattedTriageWaitingList]);

  const items = [
    {
      key: "1",
      label: "OutPatient Encounters",
      children: (
        <Card
          style={{
            padding: "10px 20px",
            boxShadow: "10px 10px 10px 10px #e6e6e6",
          }}
        >
          <EncounterListTable
            filteredList={combinedList}
            loadingConsultationRoomList={loadingConsultationRoomList}
          />
        </Card>
      ),
    },
    {
      key: "2",
      label: "Inpatient Encounters",
      children: (
        <Card
          style={{
            padding: "10px 20px",
            boxShadow: "10px 10px 10px 10px #e6e6e6",
          }}
        >
          <EncounterListInPatientTable
            patientNo={patientNo}
            filteredList={combinedInpatientList}
            loadingConsultationRoomList={loadingInpatientEncounters}
          />
        </Card>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getTriageWaitingList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getConsultationSlice(patientNo, "Completed"));
  }, [dispatch, patientNo]);

  useEffect(() => {
    if (patientNo) {
      dispatch(getQyAdmissionsDischargedListSlice(patientNo));
    }
  }, [dispatch, patientNo]);

  return (
    <div style={{ paddingTop: "30px" }}>
      <Space className="inpatient-header">
        <DiffOutlined />
        <Typography.Text className="inpatient-header-text">
          Past Encounter List
        </Typography.Text>
      </Space>

      <Tabs defaultActiveKey="1" items={items} type="card" />
    </div>
  );
};

export default TreatmentCardContent;

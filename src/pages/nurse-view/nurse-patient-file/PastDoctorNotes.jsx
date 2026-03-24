import { Space, Typography } from "antd";
import { ProfileOutlined } from "@ant-design/icons";
// import useAuth from "../../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import PastDoctorNotesTable from "../tables/nurse-tables/PastDoctorNotesTable";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { getPatientEncounterListSlice } from "../../../actions/Doc-actions/pastDoctorNotesEncounterActions";
import { listDoctors } from "../../../actions/DropdownListActions";

const DoctorNotes = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const { loading: loadingEncounters, patientEncounters } = useSelector(
    (state) => state.getPatientEncounters
  );
  const { loading: loadingDoctors, data } = useSelector(
    (state) => state.getDoctorsList
  );

  const formattedDoctorDetails = useMemo(() => {
    return data?.map((doctor) => ({
      DoctorID: doctor?.DoctorID,
      DoctorsName: doctor?.DoctorsName,
    }));
  }, [data]);

  const combinedPatients = patientEncounters?.map((patient) => {
    const matchingDoctor = formattedDoctorDetails?.find(
      (doctor) => patient?.Doctor === doctor?.DoctorID
    );
    return {
      ...patient,
      DoctorsName: matchingDoctor ? matchingDoctor?.DoctorsName : null,
    };
  });

  useEffect(() => {
    if (!patientNo) return;
    dispatch(getPatientEncounterListSlice(patientNo));
  }, [patientNo, dispatch]);

  useEffect(() => {
    dispatch(listDoctors());
  }, [dispatch]);

  return (
    <div>
      <Space
        style={{
          color: "#b96000",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          position: "relative",
        }}
      >
        <ProfileOutlined />
        <Typography.Text
          style={{ fontWeight: "bold", color: "#b96000", fontSize: "14px" }}
        >
          Past Encounter Notes
        </Typography.Text>
      </Space>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      ></div>

      <PastDoctorNotesTable
        combinedPatients={combinedPatients}
        loadingDoctors={loadingDoctors}
        loadingEncounters={loadingEncounters}
      />
    </div>
  );
};

export default DoctorNotes;

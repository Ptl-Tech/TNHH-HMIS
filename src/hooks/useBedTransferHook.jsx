import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPgBedsDetailsSlice } from "../actions/nurse-actions/getPgBedsSlice";
import { getPgAdmissionsAdmittedSlice } from "../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { getPgWardsListSlice } from "../actions/nurse-actions/getPgWardsListSlice";

const useBedTransferHook = (ward) => {
  const dispatch = useDispatch();

  // Fetch beds, wards, and admitted patients
  const { loading: loadingBeds, data: getBeds } = useSelector(
    (state) => state.getBedDetails
  );

  const { loading: loadingWards, getWards } = useSelector(
    (state) => state.getPgWardsList
  );

  const { loading: loadingAdmittedPatients, admittedPatients } =
    useSelector((state) => state.getPgAdmissionsAdmitted) || {};

  // Get patients in bed
  const patientInBed = useMemo(() => {
    return admittedPatients?.map((patient) => ({
      Ward: patient?.Ward,
      Room: patient?.Ward_Room,
      Bed_No: patient?.Bed,
      Patient_Name: patient?.PatientName,
      Admission_Date: patient?.Admission_Date,
    }));
  }, [admittedPatients]);

  // Combine patients and beds data
  const combinedPatientsBed = useMemo(() => {
    if (!patientInBed || !getBeds) return [];
    return getBeds?.map((bed) => {
      const patient = patientInBed.find(
        (patient) =>
          patient.Ward === bed.WardNo &&
          patient.Room === bed.Room_No &&
          patient.Bed_No === bed.BedNo
      );
      return {
        ...bed,
        Patient_Name: patient ? patient?.Patient_Name : null,
        Admission_Date: patient ? patient?.Admission_Date : null,
      };
    });
  }, [getBeds, patientInBed]);

  // Fetch data when component mounts or when `ward` changes
  useEffect(() => {
    if (ward) {
      dispatch(getPgBedsDetailsSlice(ward));
    }
  }, [dispatch, ward]);

  useEffect(() => {
    dispatch(getPgAdmissionsAdmittedSlice());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getPgWardsListSlice());
  }, [dispatch]);

  return {
    loadingBeds,
    getBeds,
    loadingWards,
    getWards,
    loadingAdmittedPatients,
    admittedPatients,
    combinedPatientsBed,
  };
};

export default useBedTransferHook;

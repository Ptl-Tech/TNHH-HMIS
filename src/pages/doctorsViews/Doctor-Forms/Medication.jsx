import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Tabs } from "antd";

// import useAuth from "../../../hooks/useAuth";
import PrescriptionForm from "./PrescriptionForm";
import PrescriptionTable from "../tables/PrescriptionTable";
import { getQyPrescriptionLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import { pharmacyTable } from "../../pharmacy-views/pharmacy-utils";

const Medication = () => {
  const dispatch = useDispatch();
  const getLocation = useLocation();
  const role = null.userData.departmentName;
  const queryParams = new URLSearchParams(location.search);

  const treatmentNo = queryParams.get("TreatmentNo");
  const patientDetails = getLocation.state?.patientDetails;

  const { data: sendtoPharmacyData } = useSelector(
    (state) => state.sendtoPharmacy
  );
  const { loadingPrescriptions, prescriptions } = useSelector(
    (state) => state.getQyPrescriptionLine
  );

  useEffect(() => {
    dispatch(getQyPrescriptionLineSlice(treatmentNo));
  }, [treatmentNo, sendtoPharmacyData]);

  return (
    <div>
      {(role === "Doctor" || role === "Psychology") &&
        patientDetails?.Status !== "Completed" && (
          <Tabs
            type="card"
            items={[
              {
                key: "createPrescriptions",
                label: "Create Prescription",
                children: <PrescriptionForm />,
              },
              {
                key: "sentPrescriptions",
                label: "Sent Prescriptions",
                children: (
                  <PrescriptionTable
                    columns={pharmacyTable}
                    filteredPrescriptions={prescriptions}
                    loadingPrescriptions={loadingPrescriptions}
                  />
                ),
              },
            ]}
          />
        )}
    </div>
  );
};

export default Medication;

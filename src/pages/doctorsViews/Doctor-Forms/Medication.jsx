import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Tabs } from "antd";

// import useAuth from "../../../hooks/useAuth";
import PrescriptionForm from "./PrescriptionForm";
import PrescriptionTable from "../tables/PrescriptionTable";
import { getQyPrescriptionLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import { pharmacyTable } from "../../pharmacy-views/pharmacy-utils";
import { useAbility } from "../../../hooks/casl";

const Medication = () => {
  const ability = useAbility();
  const dispatch = useDispatch();
  const getLocation = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const canCreatePrescriptionRequest = ability.can(
    "create",
    "prescriptionRequest"
  );

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
      {patientDetails?.Status !== "Completed" && (
        <Tabs
          type="card"
          items={[
            ...(canCreatePrescriptionRequest
              ? [
                  {
                    key: "createPrescriptions",
                    label: "Create Prescription",
                    children: <PrescriptionForm />,
                  },
                ]
              : []),
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

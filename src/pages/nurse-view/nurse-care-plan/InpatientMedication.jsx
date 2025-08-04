import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Tabs } from "antd";

// import useAuth from "../../../hooks/useAuth";
import PrescriptionTable from "../../doctorsViews/tables/PrescriptionTable";
import InpatientPrescriptionForm from "../../doctorsViews/Doctor-Forms/InPatientPrescriptionForm";
import { getInPatientQyPrescriptionLineSlice } from "../../../actions/Doc-actions/QyPrescriptionLinesSlice";
import { IpPhramcyTable } from "../../pharmacy-views/pharmacy-utils";
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

  const admissionNo = queryParams.get("AdmNo");
  const patientDetails = getLocation.state?.patientDetails;

  const { data: sendtoPharmacyData } = useSelector(
    (state) => state.sendtoPharmacy
  );
  const { loading: loadingPrescriptions, data: prescriptions } = useSelector(
    (state) => state.getInPatientPrescriptionLine
  );

  useEffect(() => {
    dispatch(getInPatientQyPrescriptionLineSlice(admissionNo));
  }, [admissionNo, sendtoPharmacyData]);

  return (
    <div>
      {canCreatePrescriptionRequest &&
        patientDetails?.Status !== "Completed" && (
          <Tabs
            type="card"
            items={[
              {
                key: "createPrescriptions",
                label: "Create Prescription",
                children: <InpatientPrescriptionForm />,
              },
              {
                key: "sentPrescriptions",
                label: "Sent Prescriptions",
                children: (
                  <PrescriptionTable
                    columns={IpPhramcyTable}
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

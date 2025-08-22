import { Radio } from "antd";
import { useSelector } from "react-redux";

import { PharmacyCurrentPrescription } from "./PharmacyCurrentPrescription";

export const PharmacyPrescriptions = ({
  loading,
  pharmacyNo,
  onPharmacyChange,
  currentPrescriptions,
}) => {
  // Getting the drugs that are currently selected for this visit
  const { data: pharmacyLineData, loading: pharmacyLineDataLoading } =
    useSelector((state) => state.getPatientPharmacyReturnLines);

  return (
    <>
      <Radio.Group
        size="large"
        className="block-label"
        value={pharmacyNo}
        defaultValue={pharmacyNo}
        onChange={onPharmacyChange}
        options={currentPrescriptions.map((currP) => ({
          value: currP.Pharmacy_No,
          style: { width: "100%" },
          disabled:
            currP.Status === "Completed" || currP.Status === "Cancelled",
          label: (
            <PharmacyCurrentPrescription
              currentPrescription={currP}
              pharmacyLineData={(pharmacyLineData || []).filter(
                (lineData) => lineData.Pharmacy_No === currP.Pharmacy_No
              )}
              pharmacyLineDataLoading={loading || pharmacyLineDataLoading}
            />
          ),
        }))}
      />
    </>
  );
};

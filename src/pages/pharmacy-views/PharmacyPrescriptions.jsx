import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Radio } from "antd";

import { PharmacyCurrentPrescription } from "./PharmacyCurrentPrescription";
import { getPharmacyLineReturnbyPharmacyNos } from "../../actions/pharmacy-actions/getPharmacyLineReturns";

export const PharmacyPrescriptions = ({
  loading,
  pharmacyNo,
  currentVisit,
  onPharmacyChange,
  currentPrescriptions,
}) => {
  const dispatch = useDispatch();

  // Getting the drugs that are currently selected for this visit
  const { data: pharmacyLineData, loading: pharmacyLineDataLoading } =
    useSelector((state) => state.getPatientPharmacyReturnLines);

  // This get's the current patient's pharmacy lines
  useEffect(() => {
    dispatch(
      getPharmacyLineReturnbyPharmacyNos(
        "Pharmacy_No",
        (currentPrescriptions || []).map(({ Pharmacy_No }) => Pharmacy_No)
      )
    );
  }, [currentVisit, currentPrescriptions]);

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

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import dayjs from "dayjs";
import { message } from "antd";

import { getItemsSlice } from "../actions/triage-actions/getItemsSlice";
import { postPrescriptionQuantity } from "../actions/pharmacy-actions/postPharmacyAction";
import { getPharmacyRequestsAll } from "../actions/pharmacy-actions/getPharmacyRequestsAll";

export const usePharmacyCard = ({ type }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [dateRange, setDateRange] = useState(
    location.state?.dateRange || {
      from: dayjs(new Date()).format("YYYY-MM-DD"),
      to: dayjs(new Date()).format("YYYY-MM-DD"),
    }
  );

  // Local State
  const [currentVisit, setCurrentVisit] = useState(null);
  const [currentPharmacyNo, setCurrentPharmacyNo] = useState(null);
  const [Status, setStatus] = useState(searchParams.get("status") || "");

  // Redux state
  // These are the pharmacy requests
  const { data: pharmacyRequests, loading: pharmacyRequestsLoading } =
    useSelector((state) => state.getPharmacyRequestsAll);
  // This gets the value once we issue the drugs
  const { data: postDrugIssuanceData } = useSelector(
    (state) => state.postDrugIssuance
  );
  // This gets the value once we archive the prescription
  const { data: postArchivePrescriptionData } = useSelector(
    (state) => state.postArchivePrescription
  );
  // This gets the items for searching the meds
  const { items } = useSelector((state) => state.getItems);
  // This is after posting the pharmacy line
  const { data: postPharmacyLineData, loading: postPharmacyLineLoading } =
    useSelector((state) => state.postPrescriptionQuantity);
  // This gets the returned drugs
  const { data: returnedDrugs } = useSelector((state) => state.returnDrugs);

  const groupedRequests = Object.entries(
    Object.groupBy(
      pharmacyRequests,
      ({ Link_No, Search_Name, Patient_No }) =>
        `${Search_Name}__${Link_No}__${Patient_No}`
    )
  );

  console.log({ groupedRequests, currentVisit });

  const [_, currentPrescriptions] =
    groupedRequests.find(([key]) => key.split("__")[1] === currentVisit) || [];

  // Use Effects
  // getting the items to be searched with
  useEffect(() => {
    dispatch(getItemsSlice());
  }, [returnedDrugs, postDrugIssuanceData, postPharmacyLineData]);

  // This requests the pharmacy requests
  useEffect(() => {
    dispatch(getPharmacyRequestsAll({ type, status: "", dateRange }));
  }, [postArchivePrescriptionData, type, dateRange, postDrugIssuanceData]);

  const handleAddDrug = (drugNo) => {
    if (!currentPharmacyNo)
      return message.error(
        "Kindly select the pharmacy request to add drugs to"
      );

    dispatch(
      postPrescriptionQuantity({
        drugNo,
        quantity: 0,
        myAction: "create",
        pharmacyNo: currentPharmacyNo,
      })
    );
  };

  const handleVisitChange = (value) => {
    setCurrentPharmacyNo(null);
    setCurrentVisit(value.split("__").at(1));
  };

  const handleStatusChange = (value) => {
    setCurrentPharmacyNo(null);
    setStatus(value);
  };

  const handlePharmacyChange = (event) => {
    const value = event.target.value;
    setCurrentPharmacyNo(value);
  };

  return {
    items,
    Status,
    dateRange,
    currentVisit,
    setDateRange,
    handleAddDrug,
    groupedRequests,
    currentPharmacyNo,
    handleVisitChange,
    handleStatusChange,
    handlePharmacyChange,
    currentPrescriptions,
    postPharmacyLineLoading,
    pharmacyRequestsLoading,
  };
};

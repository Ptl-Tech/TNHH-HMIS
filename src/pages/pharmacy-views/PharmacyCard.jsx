import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Tag,
  Spin,
  Space,
  Select,
  message,
  DatePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";

import {
  postPrescriptionQuantity,
  POST_EDIT_PRESCRIPTION_RESET,
} from "../../actions/pharmacy-actions/postPharmacyAction";
import { getItemsSlice } from "../../actions/triage-actions/getItemsSlice";
import { getPharmacyRequestsAll } from "../../actions/pharmacy-actions/getPharmacyRequestsAll";

import { SearchDrugTable } from "./SearchDrugTable";
import { PharmacyPatientCard } from "./PharmacyPatientCard";
import { PharmacyPrescriptions } from "./PharmacyPrescriptions";
import { pharmacyCardSearchDrugsColumns } from "./pharmacy-utils";
import { getPharmacyLineReturnbyPharmacyNos } from "../../actions/pharmacy-actions/getPharmacyLineReturns";

const PharmacyCard = ({ type, title, hideSelector }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { Title } = Typography;
  const SpaceCompact = Space.Compact;
  const { RangePicker } = DatePicker;

  const statuses = [
    { label: "All", value: "" },
    { label: "New", value: "New" },
    { label: "Forwarded", value: "Forwarded" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];
  const [dateRange, setDateRange] = useState(
    location.state?.dateRange || {
      from: dayjs(new Date()).format("YYYY-MM-DD"),
      to: dayjs(new Date()).format("YYYY-MM-DD"),
    }
  );
  const [currentVisit, setCurrentVisit] = useState(null);
  const [currentPharmacyNo, setCurrentPharmacyNo] = useState(null);
  const [Status, setStatus] = useState(searchParams.get("status") || "");

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
  const {
    data: postPharmacyLineData,
    error: postPharmacyLineError,
    loading: postPharmacyLineLoading,
  } = useSelector((state) => state.postPrescriptionQuantity);
  // This gets the returned drugs
  const { data: returnedDrugs } = useSelector((state) => state.returnDrugs);

  const groupedRequests = Object.entries(
    Object.groupBy(
      pharmacyRequests,
      ({ Link_No, Search_Name, Patient_No }) =>
        `${Search_Name}__${Link_No}__${Patient_No}`
    )
  );
  const [_, currentPrescriptions] =
    groupedRequests.find(([key]) => key.split("__")[1] === currentVisit) || [];

  // getting the items to be searched with
  useEffect(() => {
    // if we don't have items, then we get the items
    if (!items.length) {
      dispatch(getItemsSlice());
    }
  }, [items, returnedDrugs, postDrugIssuanceData, postPharmacyLineData]);

  // This requests the pharmacy patients
  useEffect(() => {
    dispatch(getPharmacyRequestsAll({ type, status: "", dateRange }));
  }, [postArchivePrescriptionData, type, dateRange]);

  // This get's the current patient's pharmacy lines
  useEffect(() => {
    dispatch(
      getPharmacyLineReturnbyPharmacyNos(
        "Pharmacy_No",
        (currentPrescriptions || []).map(({ Pharmacy_No }) => Pharmacy_No)
      )
    );
  }, [currentVisit, currentPrescriptions]);

  // to track once the pharmacy line has been updated
  useEffect(() => {
    if (postPharmacyLineData) {
      const status = postPharmacyLineData.status;

      message[status === "success" ? status : "error"](
        status === "success"
          ? "Pharmacy line updated successfully"
          : postPharmacyLineData.data.msg
      );

      dispatch({ type: POST_EDIT_PRESCRIPTION_RESET });
    }
    if (postPharmacyLineError) {
      message.error("Something wen't wrong while deleting the pharmacy line");
      dispatch({ type: POST_EDIT_PRESCRIPTION_RESET });
    }
  }, [postPharmacyLineData, postPharmacyLineError]);

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
    setCurrentVisit(value.split("-").at(1));
  };

  const handleStatusChange = (value) => {
    setCurrentPharmacyNo(null);
    setStatus(value);
  };

  const handlePharmacyChange = (event) => {
    const value = event.target.value;
    setCurrentPharmacyNo(value);
  };

  return (
    <div style={{ display: "grid", gap: "16px", padding: "16px 0" }}>
      {/* Pharmacy Title */}
      <Title level={4} style={{ color: "#0f5689", marginBottom: "0px" }}>
        {title}
      </Title>
      {/* Pharmacy filter */}
      <Space>
        <SpaceCompact direction="horizontal">
          {!hideSelector && (
            <Select
              showSearch
              options={statuses}
              placeholder="Status"
              defaultValue={Status}
              style={{ width: "200px" }}
              onChange={handleStatusChange}
              disabled={!Boolean(currentVisit)}
              prefix={<Tag color="#ac8342">Status</Tag>}
            />
          )}
          <RangePicker
            size={"middle"}
            onChange={(value) =>
              setDateRange({
                from: dayjs(value[0]).format("YYYY-MM-DD"),
                to: dayjs(value[1]).format("YYYY-MM-DD"),
              })
            }
            defaultValue={[
              dayjs(new Date(dateRange.from)),
              dayjs(new Date(dateRange.to)),
            ]}
          />
          <Select
            showSearch
            style={{ width: "400px" }}
            onChange={handleVisitChange}
            placeholder="Select a patient's visit"
            notFoundContent={
              pharmacyRequestsLoading ? (
                <Spin size="small" />
              ) : (
                "No results found"
              )
            }
            options={
              pharmacyRequestsLoading
                ? []
                : groupedRequests.map(([key, value]) => {
                    const [SearchName, LinkNo, PatientNo] = key.split("__");
                    return {
                      label: (
                        <span>
                          {SearchName} - {LinkNo}
                        </span>
                      ),
                      value: `${SearchName}-${LinkNo}-${PatientNo}`,
                    };
                  })
            }
          />
        </SpaceCompact>
      </Space>
      {/* Pharmacy Patient Information Card */}
      <PharmacyPatientCard
        currentVisit={groupedRequests.find(
          ([key, value]) => key?.split("__")[1] === currentVisit
        )}
      />
      {currentVisit && (
        <>
          {/* Pharmacy Current Prescription Drugs */}
          <PharmacyPrescriptions
            pharmacyNo={currentPharmacyNo}
            loading={pharmacyRequestsLoading}
            onPharmacyChange={handlePharmacyChange}
            currentPrescriptions={(
              (currentPrescriptions || []).filter((cP) =>
                cP.Status.includes(Status)
              ) || []
            ).toReversed()}
          />
          {/* Pharmacy Drugs to select from */}
          <SearchDrugTable
            items={items}
            loading={postPharmacyLineLoading}
            columns={pharmacyCardSearchDrugsColumns(handleAddDrug)}
          />
        </>
      )}
    </div>
  );
};

export default PharmacyCard;

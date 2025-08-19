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
import {
  GET_PHARMACY_RETURN_LIST_RESET,
  getPharmacyLineReturnbyPharmacyNo,
} from "../../actions/pharmacy-actions/getPharmacyLineReturns";
import { getItemsSlice } from "../../actions/triage-actions/getItemsSlice";
import { getPharmacyRequestsAll } from "../../actions/pharmacy-actions/getPharmacyRequestsAll";

import { SearchDrugTable } from "./SearchDrugTable";
import { PharmacyPatientCard } from "./PharmacyPatientCard";
import { pharmacyCardSearchDrugsColumns } from "./pharmacy-utils";
import { PharmacyCurrentPrescription } from "./PharmacyCurrentPrescription";

const PharmacyCard = ({ type, title, hideSelector }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { RangePicker } = DatePicker;

  const searchParams = new URLSearchParams(location.search);

  const [currentRequest, setCurrentRequest] = useState(null);
  const [Status, setStatus] = useState(searchParams.get("status") || "");
  const [dateRange, setDateRange] = useState(
    location.state?.dateRange || {
      from: dayjs(new Date()).format("YYYY-MM-DD"),
      to: dayjs(new Date()).format("YYYY-MM-DD"),
    }
  );

  const { Title } = Typography;
  const SpaceCompact = Space.Compact;

  const statuses = [
    { label: "All", value: "" },
    { label: "New", value: "New" },
    { label: "Forwarded", value: "Forwarded" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

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

  // Success after getting the currently selected drugs
  const { success: pharmacyLineDataSuccess } = useSelector(
    (state) => state.getPatientPharmacyReturnLine
  );

  // This gets the returned drugs
  const { data: returnedDrugs } = useSelector((state) => state.returnDrugs);

  // getting the items to be searched with
  useEffect(() => {
    // if we don't have items, then we get the items
    if (!items.length) {
      dispatch(getItemsSlice());
    }

    if (
      (!pharmacyLineDataSuccess && currentRequest) ||
      postPharmacyLineData?.status === "success" ||
      returnedDrugs
    ) {
      dispatch(
        getPharmacyLineReturnbyPharmacyNo("Pharmacy_No", currentRequest)
      );
    } else {
      dispatch({ type: GET_PHARMACY_RETURN_LIST_RESET });
    }
  }, [
    items,
    returnedDrugs,
    currentRequest,
    postDrugIssuanceData,
    postPharmacyLineData,
    pharmacyLineDataSuccess,
  ]);

  // This requests the pharmacy patients
  useEffect(() => {
    dispatch(getPharmacyRequestsAll({ type, status: Status, dateRange }));
  }, [postArchivePrescriptionData, type, Status, dateRange]);

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
    dispatch(
      postPrescriptionQuantity({
        drugNo,
        quantity: 0,
        myAction: "create",
        pharmacyNo: currentRequest,
      })
    );
  };

  const handleRequestChange = (value) => {
    setCurrentRequest(value.split("-").at(-1));
  };

  const handleStatusChange = (value) => {
    setStatus(value);
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
              prefix={<Tag color="#ac8342">Status</Tag>}
              placeholder="Status"
              defaultValue={Status}
              style={{ width: "200px" }}
              onChange={handleStatusChange}
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
            onChange={handleRequestChange}
            placeholder="Select a patient"
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
                : pharmacyRequests.map((request) => ({
                    label: (
                      <span>
                        {request.Search_Name} - {request.Link_No}
                      </span>
                    ),
                    value: `${request.Search_Name}-${request.Link_No}-${request.Pharmacy_No}`,
                  }))
            }
          />
        </SpaceCompact>
      </Space>
      {/* Pharmacy Patient Information Card */}
      <PharmacyPatientCard currentRequest={currentRequest} />
      {currentRequest && (
        <>
          {/* Pharmacy Current Prescription Drugs */}
          <PharmacyCurrentPrescription currentRequest={currentRequest} />
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

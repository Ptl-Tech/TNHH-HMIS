import { Typography } from "antd";

import { usePharmacyCard } from "../../hooks/usePharmacyCard";

import { PharmacyFilter } from "./PharmacyFilter";
import { SearchDrugTable } from "./SearchDrugTable";
import { PharmacyPatientCard } from "./PharmacyPatientCard";
import { PharmacyPrescriptions } from "./PharmacyPrescriptions";
import { pharmacyCardSearchDrugsColumns } from "./pharmacy-utils";

const PharmacyCard = ({ type, title, hideSelector }) => {
  const { Title } = Typography;

  const {
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
  } = usePharmacyCard({ type });

  console.log({ currentPrescriptions });

  return (
    <div style={{ display: "grid", gap: "16px", padding: "16px 0" }}>
      {/* Pharmacy Title */}
      <Title level={4} style={{ color: "#b96000", marginBottom: "0px" }}>
        {title}
      </Title>
      {/* Pharmacy filter */}
      <PharmacyFilter
        Status={Status}
        dateRange={dateRange}
        showStatus={hideSelector}
        setDateRange={setDateRange}
        currentVisit={currentVisit}
        loading={pharmacyRequestsLoading}
        groupedRequests={groupedRequests}
        handleVisitChange={handleVisitChange}
        handleStatusChange={handleStatusChange}
      />
      {/* Pharmacy Patient Information Card */}
      <PharmacyPatientCard
        currentVisit={groupedRequests.find(
          ([key]) => key?.split("__")[1] === currentVisit
        )}
      />
      {/* Pharmacy Current Prescription Drugs */}
      {currentVisit && (
        <PharmacyPrescriptions
          currentVisit={currentVisit}
          pharmacyNo={currentPharmacyNo}
          loading={pharmacyRequestsLoading}
          onPharmacyChange={handlePharmacyChange}
          currentPrescriptions={(
            (currentPrescriptions || []).filter((cP) =>
              cP.Status.includes(Status)
            ) || []
          ).toReversed()}
        />
      )}
      {/* Pharmacy Drugs to select from */}
      {currentVisit && (
        <SearchDrugTable
          items={items}
          loading={postPharmacyLineLoading}
          columns={pharmacyCardSearchDrugsColumns(handleAddDrug)}
        />
      )}
    </div>
  );
};

export default PharmacyCard;

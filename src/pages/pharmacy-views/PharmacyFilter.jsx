import dayjs from "dayjs";
import { DatePicker, Select, Space, Spin, Tag } from "antd";

export const PharmacyFilter = ({
  Status,
  loading,
  dateRange,
  showStatus,
  setDateRange,
  currentVisit,
  groupedRequests,
  handleVisitChange,
  handleStatusChange,
}) => {
  const { RangePicker } = DatePicker;
  const { Compact: SpaceCompact } = Space;

  const statuses = [
    { label: "All", value: "" },
    { label: "New", value: "New" },
    { label: "Forwarded", value: "Forwarded" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <SpaceCompact direction="horizontal">
      {!showStatus && (
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
        notFoundContent={loading ? <Spin size="small" /> : "No results found"}
        options={
          loading
            ? []
            : groupedRequests.map(([key, value]) => {
                const [SearchName, LinkNo, PatientNo] = key.split("__");
                return {
                  label: (
                    <span>
                      {SearchName} - {LinkNo}
                    </span>
                  ),
                  value: `${SearchName}__${LinkNo}__${PatientNo}`,
                };
              })
        }
      />
    </SpaceCompact>
  );
};

import dayjs from "dayjs";

import { IoCalendarOutline } from "react-icons/io5";
import { Form, Space, Table, Typography } from "antd";

import { useCurrentPrescription } from "../../hooks/useCurrentPrescription";

import { PharmacyCurrentSelection } from "./PharmacyCurrentSelection";
import { pharmacyCardCurrentSelectionColumns } from "./pharmacy-utils";
import { PharmacyPrescriptionActionButtons } from "./PharmacyPrescriptionActionButtons";

export const PharmacyCurrentPrescription = ({
  pharmacyLineData,
  currentPrescription,
  pharmacyLineDataLoading,
}) => {
  const {
    edit,
    save,
    cancel,
    disabled,
    isEditing,
    showConfirm,
    postDrugIssuanceLoading,
    postPharmacyLineLoading,
    postArchivePrescriptionLoading,
  } = useCurrentPrescription({ currentPrescription });

  // This gets the data once we post the prescription
  const [form] = Form.useForm();
  const { Title, Text } = Typography;
  const {
    Summary: { Row: TableSummaryRow, Cell: TableSummaryCell },
  } = Table;

  const summary = (pageData) => {
    const totalValue = pageData.reduce(
      (acc, { Quantity, UnitPrice }) => (acc += Quantity * UnitPrice),
      0
    );

    return pageData.length ? (
      <TableSummaryRow>
        <TableSummaryCell index={0} colSpan={8} />
        <TableSummaryCell index={0}>
          <Text style={{ fontWeight: "bold", color: "#0f5689" }}>Total</Text>
        </TableSummaryCell>
        <TableSummaryCell index={1}>
          <Text style={{ fontWeight: "bold", color: "#0f5689" }}>
            {new Intl.NumberFormat("en-US").format(Math.round(totalValue))}
          </Text>
        </TableSummaryCell>
        <TableSummaryCell index={2} />
      </TableSummaryRow>
    ) : (
      <></>
    );
  };

  if (!pharmacyLineData) return;

  return (
    <div
      style={{
        gap: "16px",
        width: "100%",
        display: "grid",
        paddingBottom: "32px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title
          level={5}
          style={{
            gap: "8px",
            fontSize: "24",
            display: "flex",
            color: "#777",
            fontWeight: "400",
            alignItems: "center",
          }}
        >
          <Space.Compact
            className="border"
            style={{
              display: "flex",
              borderRadius: "4px",
              alignItems: "center",
            }}
          >
            <div
              className="p-2"
              style={{
                display: "flex",
                alignItems: "center",
                borderRight: "1px solid #dee2e6",
              }}
            >
              <IoCalendarOutline />
            </div>
            <span className="px-2">
              {`${dayjs(currentPrescription?.Pharmacy_Date).format(
                "DD MMM YYYY"
              )} at
              ${dayjs(
                currentPrescription?.Pharmacy_Date +
                  " " +
                  currentPrescription?.Pharmacy_Time
              ).format("hh:mm A")}`}
            </span>
          </Space.Compact>
        </Title>
        <PharmacyPrescriptionActionButtons
          disabled={disabled}
          currentRequest={currentPrescription.Pharmacy_No}
          loading={postArchivePrescriptionLoading || postDrugIssuanceLoading}
        />
      </div>
      <Form form={form} component={false}>
        <PharmacyCurrentSelection
          columns={pharmacyCardCurrentSelectionColumns({
            edit,
            save,
            cancel,
            disabled,
            isEditing,
            showConfirm,
            completed: currentPrescription?.Status === "Completed",
          })}
          data={[...pharmacyLineData]
            .sort(
              ({ line_no: LineNoA }, { line_no: LineNoB }) => LineNoA - LineNoB
            )
            .map((pharmacyLine, Index) => ({
              ...pharmacyLine,
              Index: Index + 1,
            }))}
          summary={summary}
          loading={pharmacyLineDataLoading || postPharmacyLineLoading}
        />
      </Form>
    </div>
  );
};

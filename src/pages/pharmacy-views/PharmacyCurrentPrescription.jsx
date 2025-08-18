import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Form, Modal, Table, Typography } from "antd";
import { SignatureOutlined, ExclamationCircleFilled } from "@ant-design/icons";

import { postPrescriptionQuantity } from "../../actions/pharmacy-actions/postPharmacyAction";

import { PharmacyCurrentSelection } from "./PharmacyCurrentSelection";
import { pharmacyCardCurrentSelectionColumns } from "./pharmacy-utils";
import { PharmacyPrescriptionActionButtons } from "./PharmacyPrescriptionActionButtons";

export const PharmacyCurrentPrescription = ({ currentRequest }) => {
  const dispatch = useDispatch();

  // This gets a single patient record
  const { data: pharmacyRecord } = useSelector(
    (state) => state.getSinglePharmacyRecord
  );
  // This gets the data once we post the prescription
  const { loading: postDrugIssuanceLoading } = useSelector(
    (state) => state.postDrugIssuance
  );

  const { loading: postArchivePrescriptionLoading } = useSelector(
    (state) => state.postArchivePrescription
  );

  // Getting the drugs that are currently selected for this prescription
  const { data: pharmacyLineData, loading: pharmacyLineDataLoading } =
    useSelector((state) => state.getPatientPharmacyReturnLine);

  const { loading: postPharmacyLineLoading } = useSelector(
    (state) => state.postPrescriptionQuantity
  );

  const { confirm } = Modal;
  const [form] = Form.useForm();

  const [editingKey, setEditingKey] = useState("");

  const disabled =
    pharmacyRecord?.Status === "Completed" ||
    pharmacyRecord?.Status === "Cancelled";

  const isEditing = (record) => record.No === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.No);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const deleteRecord = (record) => {
    // deleting a pharmacy line
    dispatch(
      postPrescriptionQuantity({
        myAction: "delete",
        recId: record.SystemId,
        pharmacyNo: record.Pharmacy_No,
        quantity: record.Quantity,
        drugNo: record.No,
      })
    );
  };

  const save = async (record) => {
    try {
      const row = await form.validateFields();
      const { SystemId, Pharmacy_No, No, UnitPrice } = record;
      const {
        Dosage,
        Duration_Days,
        Frequency,
        Quantity,
        Take = 0,
        remarks = "",
      } = row;

      console.log({ row });

      dispatch(
        postPrescriptionQuantity({
          myAction: "edit",
          recId: SystemId,
          pharmacyNo: Pharmacy_No,
          quantity: Quantity,
          take: Take,
          drugNo: No,
          noOfDays: Duration_Days,
          frequency: Frequency,
          dosage: Dosage,
          TotalAmount: Math.round(UnitPrice * Quantity * 1) / 1,
          remarks,
        })
      );

      setEditingKey("");
    } catch (error) {
      console.log({ error });
    }
  };

  const showConfirm = (record) => {
    confirm({
      title: "Delete the pharmacy line?",
      icon: <ExclamationCircleFilled />,
      content: "Are you sure you want to delete the pharmacy line?",
      onOk() {
        deleteRecord(record);
      },
      onCancel() {},
    });
  };

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

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title
          level={5}
          style={{
            gap: "8px",
            display: "flex",
            color: "#0f5689",
            alignItems: "center",
          }}
        >
          <SignatureOutlined />
          Prescription
        </Title>
        <PharmacyPrescriptionActionButtons
          disabled={disabled}
          currentRequest={currentRequest}
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
            completed: pharmacyRecord?.Status === "Completed",
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

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { message, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import {
  postPrescriptionQuantity,
  POST_EDIT_PRESCRIPTION_RESET,
} from "../actions/pharmacy-actions/postPharmacyAction";

export const useCurrentPrescription = ({ currentPrescription }) => {
  const { confirm } = Modal;
  const dispatch = useDispatch();

  const disabled =
    currentPrescription?.Status === "Completed" ||
    currentPrescription?.Status === "Cancelled";
  const isEditing = (record) => record.No === editingKey;

  const [editingKey, setEditingKey] = useState("");

  // When the line has been updated
  const {
    data: postPharmacyLineData,
    error: postPharmacyLineError,
    loading: postPharmacyLineLoading,
  } = useSelector((state) => state.postPrescriptionQuantity);
  const { loading: postDrugIssuanceLoading } = useSelector(
    (state) => state.postDrugIssuance
  );
  const { loading: postArchivePrescriptionLoading } = useSelector(
    (state) => state.postArchivePrescription
  );

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

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.No);
  };

  const cancel = () => {
    setEditingKey("");
  };

  // deleting a pharmacy line
  const deleteRecord = (record) => {
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
      console.error({ error });
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

  return {
    edit,
    save,
    cancel,
    disabled,
    isEditing,
    showConfirm,
    postDrugIssuanceLoading,
    postPharmacyLineLoading,
    postArchivePrescriptionLoading,
  };
};

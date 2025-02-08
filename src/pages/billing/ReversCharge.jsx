import { Modal } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { postReverseCharges } from "../../actions/Charges-Actions/postReverseCharges";

const ReversCharge = ({ visible, onClose, patientNo, amount, recId }) => {
    console.log("recId", recId);
    console.log("amount", amount);
    console.log("patientNo", patientNo);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.postReverseCharges);

  const handleReverseCharge = async () => {
    const receiptRec = {
      recId: recId,
      patientNo: patientNo,
    };
    await dispatch(postReverseCharges(receiptRec));
    onClose(); // Close the modal
  };

  return (
    <Modal
      title="Confirm Charge Reversal"
      visible={visible}
      onCancel={onClose}
      onOk={handleReverseCharge}
      cancelText="Cancel"
      okText={loading ? "Processing..." : "Confirm"}
      confirmLoading={loading}
    >
      <p>
        You are about to reverse a charge for <strong className="text-primary">Patient No: {patientNo} </strong>  
        with an amount of <strong>{amount}</strong>. <br />
        <span className="text-danger fst-italic mt-4">
          This action cannot be undone.
        </span>
      </p>
    </Modal>
  );
};

export default ReversCharge;

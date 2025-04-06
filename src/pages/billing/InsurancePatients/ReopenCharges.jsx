import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spin, Modal } from "antd";
import { UndoOutlined } from "@ant-design/icons";
import { reopensalesInvoice } from "../../../actions/Charges-Actions/postReopenInvoice";
import { getPatientCharges } from "../../../actions/Charges-Actions/getPatientCharges";

const ReopenCharges = ({ patientNo, activeVisitNo }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { error, data } = useSelector((state) => state.getPatientCharges);

  // Trigger modal before taking action
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Perform the actual reopen action
  const handleConfirmReopen = () => {
    setLoading(true);
    const payload = {
        appointmentNo: activeVisitNo,
      patientNo,
    };

    dispatch(reopensalesInvoice(payload))
      .then((status) => {
        if (status === "success") {
          dispatch(getPatientCharges(activeVisitNo));
        }
      })
      .finally(() => {
        setLoading(false);
        setIsModalVisible(false);
      });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button onClick={showModal} icon={<UndoOutlined />}>
        Re Open Charges
      </Button>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <Spin size="large" tip="Processing..." />
        </div>
      )}

      <Modal
        title="Re Open Charges"
        open={isModalVisible}
        onCancel={handleModalClose}
        onOk={handleConfirmReopen}
        destroyOnClose
        style={{ top: 5 }}
      >
        Are you sure you want to re-open charges?
      </Modal>
    </>
  );
};

export default ReopenCharges;

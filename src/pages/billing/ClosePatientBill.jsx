import React, { useState } from "react";
import { Button, Modal, Spin, notification } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { postClosePatientBill } from "../../actions/Charges-Actions/postCloseBill";
import useFetchPatientVisitDetailsHook from "../../hooks/useFetchPatientVisitDetailsHook";

const ClosePatientBill = () => {
  const dispatch = useDispatch();
  const activeVisitNo = new URLSearchParams(location.search).get("PatientNo");
  const { loadingPatientVisitDetails, patientVisitDetails } = useFetchPatientVisitDetailsHook(activeVisitNo);
  
  const { loading, error, data } = useSelector((state) => state.closePatientBill);
  const [visible, setVisible] = useState(false);

  // Handle Close Bill Action
  const handleCloseBill = () => {
    const payload = {
      patientNo: patientVisitDetails.PatientNo,
    };

    dispatch(postClosePatientBill(payload))
      .then((status) => {
        // Success notification
        notification.success({
          message: "Bill Closed Successfully",
          description: `Patient bill for ${patientVisitDetails?.SearchNames} has been closed.`,
        });
        setVisible(false); // Close the modal
      })
      .catch((error) => {
        // Error notification
        notification.error({
          message: "Error Closing Bill",
          description: error.message || "An error occurred while closing the bill. Please try again later.",
        });
      });
  };

  return (
    <div>
      <Button
        type="default"
        icon={<CloseOutlined />}
        onClick={() => setVisible(true)}
        disabled={loadingPatientVisitDetails}
      >
        Close Bill
      </Button>

      <Modal
        title="Close Bill"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        width={600}
        confirmLoading={loading}
      >
        {/* Show Spinner if still loading */}
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "auto", padding: "20px" }} />
        ) : (
          <>
            Are you sure you want to close the bill for this patient{" "}
            <span className="fw-bold">{patientVisitDetails?.SearchNames.toUpperCase()}</span>?
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Button onClick={handleCloseBill} type="primary" danger>
                Confirm Close
              </Button>
            </div>
          </>
        )}
      </Modal>

      {/* Full Screen Loading */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default ClosePatientBill;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Spin, Modal, message } from "antd";
import { IoPrintOutline } from "react-icons/io5";
import PDFViewer from "../../../components/PDFView";
import { postInterimInvoice } from "../../../actions/Charges-Actions/printInterimInvoice";
import { postPrintInvoice, PRINT_INVOICE_RESET } from "../../../actions/Charges-Actions/postprintInvoice";

export const PrintInterimInvoice = ({ activeVisitNo, patientNo }) => {
  const dispatch = useDispatch();

  const [base64, setBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePrintInterimInvoice = () => {
    setLoading(true); // Start loading state
    const data = {
      PatientNo: patientNo,
      visitNo: activeVisitNo,
    };

    dispatch(postInterimInvoice(data))
      .then((response) => {
        setBase64(response.data.base64);
        setLoading(false);
        setIsModalVisible(true);
        // window.open('data:application/pdf;base64,' + response.data.base64);
      })
      .catch((error) => {
        setLoading(false); // Stop loading in case of error
        message.error("Error fetching receipt:", error);
      });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Button to print receipt */}
      <Button onClick={handlePrintInterimInvoice} icon={<IoPrintOutline />}>
        Print Interim Invoice
      </Button>

      {/* Loading spinner */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "9999",
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      {/* PDF Viewer in a modal */}
      <Modal
        title="Interim Invoice"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="80%" // Make it wide
        destroyOnClose
        style={{ maxWidth: "80%", top: 5 }}
        bodyStyle={{ overflow: "auto" }}
      >
        {base64 && <PDFViewer base64String={base64} />}
      </Modal>

      {/* Uncomment below to open in a new tab */}
      {/* {base64 && window.open('data:application/pdf;base64,' + base64)} */}
    </>
  );
};


export const PrintFinalInvoice = ({ patientNo, activeVisitNo }) => {
  const dispatch = useDispatch();

  const [base64, setBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePrintFinalInvoice = () => {
    setLoading(true); // Start loading state
    const data = {
      PatientNo: patientNo,
      encounterNO: activeVisitNo,
    };
    
    dispatch(postPrintInvoice(data))
      .then((response) => {
        setBase64(response.data.base64);
        setLoading(false); // End loading state after receiving the data
        // Open the result in a new tab or wide modal
        setIsModalVisible(true); // For modal option
        // Uncomment below line to open in a new tab
        // window.open('data:application/pdf;base64,' + response.data.base64);
      })
      .catch((error) => {
        setLoading(false); // Stop loading in case of error
        console.error("Error fetching receipt:", error);
      });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Button to print receipt */}
      <Button type="text" onClick={handlePrintFinalInvoice} icon={<IoPrintOutline />}>
        Print  Invoice
      </Button>

      {/* Loading spinner */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: "9999",
          }}
        >
          <Spin size="large" tip="Loading..." />
        </div>
      )}

      {/* PDF Viewer in a modal */}
      <Modal
        title="Patient Invoice"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="80%" // Make it wide
        destroyOnClose
        style={{ maxWidth: "80%", top: 5 }}
        bodyStyle={{ overflow: "auto" }}
        afterClose={() => {
          dispatch({ type: PRINT_INVOICE_RESET });
        }}
      >
        {base64 && <PDFViewer base64String={base64} />}
      </Modal>

      {/* Uncomment below to open in a new tab */}
      {/* {base64 && window.open('data:application/pdf;base64,' + base64)} */}
    </>
  );
};

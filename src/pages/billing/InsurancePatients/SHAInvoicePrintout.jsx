import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spin, Modal, message } from "antd";
import { IoPrintOutline } from "react-icons/io5";
import PDFViewer from "../../../components/PDFView";
import { postInterimInvoice, printSHAInvoice } from "../../../actions/Charges-Actions/printInterimInvoice";
import { postPrintInvoice, PRINT_INVOICE_RESET } from "../../../actions/Charges-Actions/postprintInvoice";

export const SHAInvoicePrintout = ({ activeVisitNo, patientNo }) => {
  const dispatch = useDispatch();

  const [base64, setBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
const {error,  data}=useSelector((state)=>state.printSHAInvoice);
  const handlePrintSHAInvoice = () => {
    const data = {
      patientNo: patientNo,
      encounterNo: activeVisitNo,
    };

    setLoading(true); // Start loading state
    dispatch(printSHAInvoice(data))
      .then((response) => {
        setBase64(response.data.base64);
        setLoading(false);
        setIsModalVisible(true);
        // window.open('data:application/pdf;base64,' + response.data.base64);
      })
      .catch((error) => {
        setLoading(false); // Stop loading in case of error
       
      });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      {/* Button to print receipt */}
      <Button onClick={handlePrintSHAInvoice} icon={<IoPrintOutline />}>
        Print SHA Invoice
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



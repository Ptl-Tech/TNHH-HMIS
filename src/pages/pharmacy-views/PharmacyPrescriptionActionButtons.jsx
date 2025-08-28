import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { pdf } from "@react-pdf/renderer";

import { Button, Modal, Space, message } from "antd";

import PharmacyLabel from "./PharmacyLabel";
import PDFViewer from "../../components/PDFView";

import {
  postDrugIssuance,
  postArchivePrescription,
  POST_ARCHIVE_PRESCRIPTION_RESET,
  POST_PHARMACY_DRUG_ISSUANCE_RESET,
} from "../../actions/pharmacy-actions/postPharmacyAction";

export const PharmacyPrescriptionActionButtons = ({
  disabled,
  pharmacyRecord,
  currentRequest,
}) => {
  const dispatch = useDispatch();
  const { Compact: SpaceCompact } = Space;

  const [pdfLabels, setPdfLabels] = useState(null);
  const [viewPDFLabel, setViewPDFLabel] = useState(false);

  // This gets the data once we post the prescription
  const {
    data: postDrugIssuanceData,
    error: postDrugIssuanceError,
    loading: postDrugIssuanceLoading,
  } = useSelector((state) => state.postDrugIssuance);
  // Getting the drugs that are currently selected for this prescription
  const { data: pharmacyLineData } = useSelector(
    (state) => state.getPatientPharmacyReturnLines
  );

  // This gets the data once we archive the prescription
  const {
    data: postArchivePrescriptionData,
    loading: postArchivePrescriptionLoading,
  } = useSelector((state) => state.postArchivePrescription);

  // to track once we post the drug issuance
  useEffect(() => {
    if (postDrugIssuanceData) {
      const status = postDrugIssuanceData.status;

      if (status) {
        message[status](
          status === "success"
            ? "The prescription has been posted successfully"
            : "Something went wrong when posting the prescription"
        );
      }
    }

    if (postDrugIssuanceError) message.error(postDrugIssuanceError);

    dispatch({ type: POST_PHARMACY_DRUG_ISSUANCE_RESET });
  }, [postDrugIssuanceData, postDrugIssuanceError]);

  // The archive functionality
  useEffect(() => {
    if (postArchivePrescriptionData) {
      const status = postArchivePrescriptionData.status;

      message[status](
        status === "success"
          ? "The prescription has been archived successfully"
          : "Something went wrong when acrchiving the prescription"
      );
      dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
    }
  }, [postArchivePrescriptionData]);

  const handleArchivePrescription = () => {
    dispatch(postArchivePrescription(currentRequest));
  };

  const handleIssuePrescription = () => {
    dispatch(postDrugIssuance(currentRequest));
  };

  const handlePrintLabels = async () => {
    try {
      const blob = await pdf(
        <PharmacyLabel
          items={pharmacyLineData?.map((pLineData) => ({
            ...pLineData,
            patientName: pharmacyRecord?.Search_Name,
          }))}
        />
      ).toBlob();

      const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob); // This reads the blob as a Data URL (base64 with MIME)
          reader.onloadend = () => {
            const base64data = reader.result;
            // Strip the data prefix to get only the base64 string (optional)
            const base64 = base64data.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
        });
      };

      const base64String = await blobToBase64(blob);

      // Displaying the printables
      setViewPDFLabel(() => {
        setPdfLabels(base64String);
        return true;
      });
    } catch (error) {
      console.error({ error: error?.message });
    }
  };

  const handleCloseLabelModal = () => {
    setPdfLabels(null);
    setViewPDFLabel(false);
  };

  return (
    <SpaceCompact direction="horizontal">
      <Button
        style={{ height: "32px" }}
        disabled={
          disabled || postDrugIssuanceLoading || postArchivePrescriptionLoading
        }
        onClick={handleArchivePrescription}
      >
        Cancel Prescription
      </Button>
      <Button
        type="primary"
        style={{
          height:
            disabled ||
            postDrugIssuanceLoading ||
            postArchivePrescriptionLoading
              ? "32px"
              : "30px",
        }}
        disabled={
          disabled || postDrugIssuanceLoading || postArchivePrescriptionLoading
        }
        onClick={handleIssuePrescription}
      >
        Issue Drugs
      </Button>
      <Button
        style={{ height: "32px" }}
        onClick={handlePrintLabels}
        disabled={!Boolean(pharmacyLineData?.length)}
      >
        Print Labels
      </Button>
      <Modal
        destroyOnHidden
        title="Basic Modal"
        open={viewPDFLabel}
        onOk={handleCloseLabelModal}
        onCancel={handleCloseLabelModal}
        closable={{ "aria-label": "Custom Close Button" }}
      >
        <PDFViewer base64String={pdfLabels} />
      </Modal>
    </SpaceCompact>
  );
};

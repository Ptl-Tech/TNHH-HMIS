import { Collapse, message } from "antd";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { FileOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import BedTransferTable from "./tables/nurse-tables/BedTransferTable";
import WardTransferTable from "./tables/nurse-tables/WardTransferTable";
import { useDispatch } from "react-redux";
import { getPgBedsDetailsSlice } from "../../actions/nurse-actions/getPgBedsSlice";
import { POST_BED_TRANSFER_LINE_SUCCESS, POST_SAVE_BED_TRANSFER_LINE_SUCCESS, postBedTransferLineSlice, postSaveBedTransferLineSlice } from "../../actions/nurse-actions/postReleaseBedSlice";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { getPgWardsListSlice } from "../../actions/nurse-actions/getPgWardsListSlice";
import useBedTransferHook from "../../hooks/useBedTransferHook";

const WardTransfer = () => {
  const location = useLocation();
  const patientDetail = location.state?.patientDetails || {};
  const dispatch = useDispatch();
  const {
    loadingBeds,
    loadingWards,
    getWards,
    loadingAdmittedPatients,
    combinedPatientsBed,
  } = useBedTransferHook(patientDetail?.Ward);

  const handleBedTransfer = async (record) => {
    try {
      const bedTransferData = {
        myAction: "create",
        recId: "",
        admissionNo: patientDetail?.Admission_No,
        newWard: record?.WardNo,
        newBedNo: record?.BedNo,
        currentWard: patientDetail?.Ward,
        currentBedNo: patientDetail?.Bed,
      };
  
      const saveBedTransferData = {
        myAction: "create",
        recId: "",
        admissionNo: patientDetail?.Admission_No,
        patientNo: patientDetail?.Patient_No,
      };
  
      // Dispatch bed transfer
      const bedTransferResult = await dispatch(postBedTransferLineSlice(bedTransferData));
  
      if (bedTransferResult.type !== POST_BED_TRANSFER_LINE_SUCCESS) {
        message.error("Failed to transfer patient");
      }
  
      // Refresh bed details
      dispatch(getPgBedsDetailsSlice(patientDetail?.Ward));
  
      // Dispatch save bed transfer
      const saveBedTransferResult = await dispatch(postSaveBedTransferLineSlice(saveBedTransferData));
  
      if (saveBedTransferResult.type !== POST_SAVE_BED_TRANSFER_LINE_SUCCESS) {
        message.error("Failed to save bed transfer details");
      }
  
      message.success("Patient transferred successfully");
    } catch (error) {
      message.error(error.message || "An error occurred");
    }
  };
  

  const items = [
    {
      key: "1",
      label: (
        <p style={{ fontWeight: "bold", color: "#0f5689" }}>
          Transfer to another bed in this ward - {patientDetail?.Ward}
        </p>
      ),
      children: (
        <BedTransferTable
          handleBedTransfer={handleBedTransfer}
          combinedPatientsBed={combinedPatientsBed}
          loadingBeds={loadingBeds}
          loadingAdmittedPatients={loadingAdmittedPatients}
        />
      ),
    },
    {
      key: "2",
      label: (
        <p style={{ fontWeight: "bold", color: "#0f5689" }}>
          Transfer to another ward
        </p>
      ),
      children: (
        <WardTransferTable
          getWards={getWards}
          loadingWards={loadingWards}
          currentWard={patientDetail?.Ward}
        />
      ),
    },
  ];
  const onChange = (key) => {
    if (Array.isArray(key) && key.includes("1")) {
      dispatch(getPgBedsDetailsSlice(patientDetail?.Ward));
      dispatch(getPgAdmissionsAdmittedSlice());
    } else if (Array.isArray(key) && key.includes("2")) {
      dispatch(getPgWardsListSlice());
    }
  };

  return (
    <div>
      <NurseInnerHeader
        icon={<FileOutlined />}
        title="Where should the patient be transferred to?"
      />
      <div>
        <Collapse
          accordion
          onChange={onChange}
          destroyInactivePanel={false}
          items={items}
        />
      </div>
    </div>
  );
};

export default WardTransfer;

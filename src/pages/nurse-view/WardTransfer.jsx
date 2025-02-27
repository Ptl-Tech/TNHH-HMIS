import { Collapse, message } from "antd";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { FileOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import BedTransferTable from "./tables/nurse-tables/BedTransferTable";
import WardTransferTable from "./tables/nurse-tables/WardTransferTable";
import { useDispatch } from "react-redux";
import { getPgBedsDetailsSlice } from "../../actions/nurse-actions/getPgBedsSlice";
import { postReleaseBedSlice } from "../../actions/nurse-actions/postReleaseBedSlice";
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

  console.log('patient detail', patientDetail)

  const handleBedTransfer = (record) => {
    const result = dispatch(postReleaseBedSlice(record));
    if (result.type === "POST_RELEASE_BED_SUCCESS") {
      dispatch(getPgBedsDetailsSlice(patientDetail?.Ward));
      message.success("Patient transferred successfully");
    } else {
      message.error("Failed to transfer patient");
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

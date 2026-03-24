import { Collapse, message, Tabs } from "antd";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";
import { FileOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import BedTransferTable from "./tables/nurse-tables/BedTransferTable";
import WardTransferTable from "./tables/nurse-tables/WardTransferTable";
import { useDispatch, useSelector } from "react-redux";
import { getPgBedsDetailsSlice } from "../../actions/nurse-actions/getPgBedsSlice";
import {
  getQyBedTransferLines,
  postBedTransferLineSlice,
} from "../../actions/nurse-actions/postReleaseBedSlice";
import { getPgAdmissionsAdmittedSlice } from "../../actions/nurse-actions/getPgAdmissionsAdmittedSlice";
import { getPgWardsListSlice } from "../../actions/nurse-actions/getPgWardsListSlice";
import useBedTransferHook from "../../hooks/useBedTransferHook";
import { useEffect, useState } from "react";
import BedTransferLinesTable from "./tables/nurse-tables/BedTransferLinesTable";

const WardTransfer = () => {
  const location = useLocation();
  const patientDetail = location.state?.patientDetails || {};
  const admissionNo = new URLSearchParams(location.search).get("AdmNo");
  const patientNo = new URLSearchParams(location.search).get("PatientNo");
  const dispatch = useDispatch();
  const {
    loadingBeds,
    loadingWards,
    getWards,
    loadingAdmittedPatients,
    combinedPatientsBed,
  } = useBedTransferHook(patientDetail?.Ward);

  const [activeBedTab, setActiveBedTab] = useState("1");
  const { loading: loadingQyBedTransferLines, data: bedTransferLines } =
    useSelector((state) => state.getQyBedTransferLine);

  const { loading: loadingBedTransferLines } = useSelector(
    (state) => state.postBedTransfer
  );

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

      // Dispatch bed transfer
      await dispatch(
        postBedTransferLineSlice(bedTransferData)
      ).then((res) => {
        const { status, msg } = res?.payload || {};

        if (status === "success") {
          message.success(msg || "Successfully signed new bed, please go to save bed.");
          dispatch(getQyBedTransferLines(admissionNo));
          setActiveBedTab("2");
        } else {
          message.error(msg || "Failed to save bed transfer details");
        }
      });
    } catch (error) {
      message.error(error.message || "An error occurred");
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <p style={{ fontWeight: "bold", color: "#b96000" }}>
          Transfer to another bed in this ward - {patientDetail?.Ward}
        </p>
      ),
      children: (
        <Tabs activeKey={activeBedTab} onChange={(key) => setActiveBedTab(key)}>
          <Tabs.TabPane tab="Assign New Ward and Bed" key="1">
            <BedTransferTable
              handleBedTransfer={handleBedTransfer}
              combinedPatientsBed={combinedPatientsBed}
              loadingBeds={loadingBeds}
              loadingAdmittedPatients={loadingAdmittedPatients}
              loadingBedTransferLines={loadingBedTransferLines}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Save New Ward and Bed" key="2">
            <BedTransferLinesTable
              bedTransferLines={bedTransferLines}
              loadingQyBedTransferLines={loadingQyBedTransferLines}
              patientNo={patientNo}
              dispatch={dispatch}
            />
          </Tabs.TabPane>
        </Tabs>
      ),
    },
    {
      key: "2",
      label: (
        <p style={{ fontWeight: "bold", color: "#b96000" }}>
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

  useEffect(() => {
    dispatch(getQyBedTransferLines(admissionNo));
  }, [dispatch, admissionNo]);

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

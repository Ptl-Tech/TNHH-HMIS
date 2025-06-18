import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { Card, Drawer, Space, Tabs, message, Button, Skeleton } from "antd";
import { PrinterOutlined, CloseCircleFilled } from "@ant-design/icons";

import PDFViewer from "../../../components/PDFView";
import { NoData } from "../../../components/NoData";
import SickOffFormData from "../nurse-forms/SickOffFormData";

import {
  postPrintSickOff,
  POST_PRINT_SICK_OFF_RESET,
} from "../../../actions/Doc-actions/postPrintSickOff";

const SickOff = ({ currentInpatient }) => {
  const searchParams = new URLSearchParams(useLocation().search);

  const admissionNo = searchParams.get("AdmNo");
  const treatmentNo = searchParams.get("TreatmentNo");

  const isInpatient = Boolean(admissionNo) || false;

  const items = [
    {
      key: "sickOffForm",
      label: "Sick off Form",
      children: <SickOffFormData currentInpatient={currentInpatient} />,
    },
    {
      key: "sickOffCard",
      label: "Print Sick Off",
      children: (
        <SickOffCard
          posted={true}
          admissionNo={admissionNo}
          treatmentNo={treatmentNo}
          isInpatient={isInpatient}
        />
      ),
    },
  ];
  return <Tabs items={items} size="small" type="card" />;
};

function SickOffCard({ posted, admissionNo, treatmentNo, isInpatient }) {
  const dispatch = useDispatch();
  const encounterNo = admissionNo || treatmentNo;

  const [printData, setPrintData] = useState(null);
  const {
    data: printSickOffData,
    error: printSickOffError,
    loading: printSickOffLoading,
  } = useSelector((state) => state.postPrintSickOff);

  useEffect(() => {
    dispatch(postPrintSickOff({ isInpatient, encounterNo }));
  }, []);

  useEffect(() => {
    if (printSickOffData) setPrintData(printSickOffData.data?.base64);

    if (printSickOffError) message.error(printSickOffError);

    if (printSickOffData || printSickOffError)
      dispatch({ type: POST_PRINT_SICK_OFF_RESET });
  }, [printSickOffData, printSickOffError, printSickOffLoading]);

  return (
    <Skeleton loading={printSickOffLoading}>
      {posted && printData ? (
        <Card
          styles={{ header: { color: "#0f5689", fontWeight: "700" } }}
          size="small"
          title={"Off Duty Info"}
          children={<PDFViewer base64String={printData} />}
        />
      ) : (
        <NoData content="No sick off issued" />
      )}
    </Skeleton>
  );
}

export default SickOff;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Col, Row, Card, Typography } from "antd";
import { IdcardOutlined } from "@ant-design/icons";

import { pharmacyCardPatientData } from "./pharmacy-utils";

import {
  POST_ARCHIVE_PRESCRIPTION_RESET,
  POST_PHARMACY_DRUG_ISSUANCE_RESET,
} from "../../actions/pharmacy-actions/postPharmacyAction";
import { getSinglePharmacyRecord } from "../../actions/pharmacy-actions/getSinglePharmacyRecord";

export const PharmacyPatientCard = ({ currentRequest }) => {
  const { Title, Text } = Typography;

  const dispatch = useDispatch();

  // This gets the value once we issue the drugs
  const { data: postDrugIssuanceData } = useSelector(
    (state) => state.postDrugIssuance
  );
  const { data: postPharmacyLineData } = useSelector(
    (state) => state.postPrescriptionQuantity
  );
  const { data: postArchivePrescriptionData } = useSelector(
    (state) => state.postArchivePrescription
  );

  // This gets a single patient record
  const { data: pharmacyRecord } = useSelector(
    (state) => state.getSinglePharmacyRecord
  );

  // to get a single pharmacy record
  useEffect(() => {
    // We cannot update based on whether we have archived or not because the request will not be found
    if (
      (currentRequest && !pharmacyRecord) ||
      (currentRequest &&
        pharmacyRecord &&
        currentRequest !== pharmacyRecord.Pharmacy_No) ||
      postDrugIssuanceData?.status === "success" ||
      postArchivePrescriptionData?.status === "success"
    ) {
      dispatch(getSinglePharmacyRecord("Pharmacy_No", currentRequest));
      if (postArchivePrescriptionData)
        dispatch({ type: POST_ARCHIVE_PRESCRIPTION_RESET });
      if (postDrugIssuanceData)
        dispatch({ type: POST_PHARMACY_DRUG_ISSUANCE_RESET });
    }
  }, [
    currentRequest,
    pharmacyRecord,
    postDrugIssuanceData,
    postPharmacyLineData,
    postArchivePrescriptionData,
  ]);

  return (
    <Card
      style={{ background: "#00000006" }}
      title={
        <Title
          level={5}
          style={{
            gap: "8px",
            display: "flex",
            color: "#0f5689",
            alignItems: "center",
          }}
        >
          <IdcardOutlined />
          Pharmacy Card
        </Title>
      }
      variant="borderless"
    >
      <div
        style={{
          color: "#0F5689",
          padding: "0 16px",
          borderRadius: "5px",
          fontWeight: "semibold",
        }}
      >
        <Row>
          {pharmacyCardPatientData.map((patientRow) => (
            <Col span={12}>
              {patientRow.map(({ name, value, noBorder }) => (
                <Row
                  style={{
                    gap: "8px",
                    display: "flex",
                    padding: "8px 16px",
                    borderBottom: !noBorder && "1px solid #ebebeb",
                  }}
                >
                  <Text strong>{name} :</Text>
                  {` ${
                    pharmacyRecord
                      ? value === "Link_Type" &&
                        pharmacyRecord[value] === "DOCTOR"
                        ? `${pharmacyRecord[value]} (${
                            pharmacyRecord["Doctor_Name"] || "From Reception"
                          })`
                        : pharmacyRecord[value]
                      : ""
                  }`}
                </Row>
              ))}
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

import { Col, Row, Card, Typography } from "antd";
import { IdcardOutlined } from "@ant-design/icons";

import { pharmacyCardPatientData } from "./pharmacy-utils";

export const PharmacyPatientCard = ({ currentVisit }) => {
  const [key, value] = currentVisit || [];
  const [pharmacyRecord] = value || [];

  const { Title, Text } = Typography;

  return (
    <Card
      style={{ background: "#00000006" }}
      title={
        <Title
          level={5}
          style={{
            gap: "8px",
            display: "flex",
            color: "#b96000",
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
          color: "#b96000",
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

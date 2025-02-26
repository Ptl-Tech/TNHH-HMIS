import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Card, Typography, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getPatientDetails } from "../../../../actions/Doc-actions/OutPatientAction";

const RadiologyTopSection = ({ radiologyDetails }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        radiologyDetails.PatientNo && dispatch(getPatientDetails(radiologyDetails.PatientNo));
    }, [dispatch, radiologyDetails]);

    const { loading: loadingPatientDetails, patient: patientDetails } = useSelector(
        (state) => state.getPatient
    );
    const capitalizeWords = (name) =>
        name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    console.log({ patientDetails })
    console.log(radiologyDetails.PatientNo)
    const patientName = patientDetails?.SearchName
        ? capitalizeWords(patientDetails.SearchName)
        : capitalizeWords(
            [
                patientDetails?.Surname,
                patientDetails?.FirstName,
                patientDetails?.MiddleName,
            ]
                .filter(Boolean)
                .join(" ")
        );

    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "green";
            case "New":
                return "orange";
            case "Cancelled":
                return "red";
            case "Forwarded":
                return "blue";
            default:
                return "gray";
        }
    };
    const calculateAge = (dateString) => {
        const birthDate = new Date(dateString);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // Adjust age if the birthday has not occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age;
    };

    return (
        <Row gutter={[16, 16]} style={{ margin: 0 }}>
            <Col xs={24} md={8}>
                <Card
                    style={{
                        padding: "10px 16px",
                        background: "#e5e3e3",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        minHeight: "250px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "16px",
                        }}
                    >
                        <Avatar icon={<UserOutlined />} size={48} />
                        <div>
                            <Typography.Title level={5} style={{ margin: 0 }}>
                                {patientName}
                            </Typography.Title>
                            <Typography.Text style={{ color: "gray", fontSize: "12px" }}>
                                DOB: {patientDetails?.DateOfBirth}
                            </Typography.Text>
                        </div>
                    </div>
                    <Typography.Title
                        level={5}
                        style={{ color: "#0F5689", marginBottom: "12px" }}
                    >
                        Patient Information
                    </Typography.Title>
                    <InfoRow label="Patient Number" value={patientDetails?.PatientNo} />
                    {/* <InfoRow label="Lab Observation Number" value={labObservationNo || labNo} /> */}
                    <InfoRow label="Age" value={`${calculateAge(patientDetails?.DateOfBirth)} Years`} />
                    <InfoRow label="Gender" value={patientDetails?.Gender} />
                </Card>
            </Col>

            <Col xs={24} md={8}>
                <Card
                    style={{
                        padding: "10px 16px",
                        background: "#e5e3e3",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        minHeight: "250px",
                    }}
                >
                    <Typography.Title
                        level={5}
                        style={{ color: "#0F5689", marginBottom: "12px" }}
                    >
                        Radiology Information
                    </Typography.Title>
                    <InfoRow label="Radiology No" value={radiologyDetails?.RadiologyNo} />
                    <InfoRow label="Link No" value={radiologyDetails?.Link_No} />
                    <InfoRow label="Link Type" value={radiologyDetails?.Link_Type} />
                    <InfoRow label="Radiology Date" value={radiologyDetails?.RadiologyDate} />
                    <InfoRow
                        label="Radiology Status"
                        value={
                            <span style={{ color: getStatusColor(radiologyDetails.Status) }}>
                                {radiologyDetails?.Status || "N/A"}
                            </span>
                        }
                    />
                </Card>
            </Col>

            <Col xs={24} md={8}>
                <Card
                    style={{
                        padding: "10px 16px",
                        background: "#e5e3e3",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        minHeight: "250px",
                    }}
                >
                    <Typography.Title
                        level={5}
                        style={{ color: "#0f5689", marginBottom: "12px" }}
                    >
                        Settlement Information
                    </Typography.Title>
                    <InfoRow label="Settlement Type" value={patientDetails?.PatientType} />
                    <InfoRow label="Insurance" value={patientDetails?.SchemeName || "N/A"} />
                    <InfoRow
                        label="Patient Bill Balance"
                        value={`KSH. ${patientDetails?.TotalBilled || "0.00"}`}
                    />
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "16px",
                        }}
                    >
                        {/* <Button
                            type="primary"
                            style={{ flex: "1 1 calc(50% - 5px)" }}
                        // onClick={() => handleMarkAsCompleted(labObservationNo)}
                        >
                            Mark as Completed
                        </Button> */}
                        <Button
                            type="default"
                            style={{ flex: "1 1 calc(50% - 5px)" }}
                            onClick={() => handlePrintInvoice(patientDetails?.PatientId)}
                        >
                            Print Interim Invoice
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

const InfoRow = ({ label, value }) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
        }}
    >
        <Typography.Title
            level={5}
            style={{ fontSize: "14px", margin: 0, color: "black" }}
        >
            {label}
        </Typography.Title>
        <Typography.Text
            style={{
                fontSize: "14px",
                color: "gray",
                fontWeight: "bold",
            }}
        >
            {value || "N/A"}
        </Typography.Text>
    </div>
);

export default RadiologyTopSection
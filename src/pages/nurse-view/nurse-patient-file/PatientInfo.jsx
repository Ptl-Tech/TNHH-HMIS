import { Card, Col, Row, Typography } from "antd"
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import LoadingParagraphs from "../../../partials/nurse-partials/LoadingParagraphs";
import { UserOutlined } from "@ant-design/icons";
import { calculateAge } from "../../../utils/helpers";
import useFetchPatientDetailsHook from "../../../hooks/useFetchPatientDetailsHook";

const PatientInfo = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientNo = queryParams.get("PatientNo");

  const { loadingPatientDetails, patientDetails} = useFetchPatientDetailsHook(patientNo);

    const patientPrimaryInfo = [
    {
        title: 'Patient Name',
        description: patientDetails?.SearchName || 'N/A',
    },
    {
        title: 'Branch Name',
        description: patientDetails?.GlobalDimension1Code || 'N/A',
    },
    {
        title: 'Admission Number',
        description: patientDetails?.CurrentAdmNo || 'N/A',
    },
    {
        title: 'Date of Admission',
        description: patientDetails?.AdmissionsDate || 'N/A',
    },
    {
        title: 'Age',

        description: calculateAge(patientDetails?.DateOfBirth) || 'N/A',
    },
    {
        title: 'Gender',
        description: patientDetails?.Gender || 'N/A',
    },
    {
        title: 'Nationality',
        description: patientDetails?.Nationality || 'N/A',
    },
]

const patientSecondaryInfo = [
    {
        title: 'Date of Birth',
        description: patientDetails?.DateOfBirth || 'N/A',
    },
    {
        title: 'Address 1',
        description: patientDetails?.SpouseAddress2 || 'N/A',
    },
    {
        title: 'Address 2',
        description: patientDetails?.SpouseAddress1 || 'N/A',
    },
    {
        title: 'County Ward',
        description: patientDetails?.CountyWard || 'N/A',
    },
    {
        title: 'Sub County',
        description: patientDetails?.SubCountyName || 'N/A',
    },
    
    {
        title: 'Home Telephone',
        description: patientDetails?.TelephoneNo2 || 'N/A',
    },
    {
        title: 'Mobile Phone',
        description: patientDetails?.TelephoneNo1 || 'N/A',
    }
]
  return (
    <div>
        
        <NurseInnerHeader icon={<UserOutlined />} title="Patient Information" />

        {
          loadingPatientDetails ? (
            <LoadingParagraphs paragraphs={10} />
          ):(
            <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={{ padding: '10px 16px', borderTop: '3px solid #0f5689', boxShadow: "10px 10px 10px 10px #e6e6e6" }}>
                    {patientPrimaryInfo.map((info, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography.Text strong style={{ paddingTop: '5px'}}>{info.title}</Typography.Text>
                            <Typography.Text>{info.description}</Typography.Text>
                        </div>
                    ))}
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={{ padding: '10px 16px', borderTop: '3px solid #0f5689', boxShadow: "10px 10px 10px 10px #e6e6e6" }}>
                    {patientSecondaryInfo.map((info, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography.Text strong style={{ paddingTop: '5px'}}>{info.title}</Typography.Text>
                            <Typography.Text>{info.description}</Typography.Text>
                        </div>
                    ))}
                </Card>
            </Col>
        </Row>
          )
        }
    </div>
  )
}

export default PatientInfo

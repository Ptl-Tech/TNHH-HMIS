import { Card, Col, Row, Typography } from "antd"
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import useFetchAllPatientsHook from "../../../hooks/useFetchAllPatientsHook";
import Loading from "../../../partials/nurse-partials/Loading";
import { UserOutlined } from "@ant-design/icons";

const PatientInfo = () => {
  const { loadingTriageWaitingList, triageWaitingList } = useFetchAllPatientsHook();
  const { patientDetails } = useLocation().state;
  const filteredPatient = triageWaitingList?.filter(patient => patient.PatientNo === patientDetails?.Patient_No);
 
    const patientPrimaryInfo = [
    {
        title: 'Patient Name',
        description: patientDetails?.PatientName || 'N/A',
    },
    {
        title: 'Patient ID',
        description: patientDetails?.Patient_No || 'N/A',
    },
    {
        title: 'Admission Number',
        description: patientDetails?.Admission_No || 'N/A',
    },
    {
        title: 'Date of Admission',
        description: patientDetails?.AdmissionsDate || 'N/A',
    },
    {
        title: 'Identification Number',
        description: filteredPatient[0]?.IDNumber || 'N/A',
    },
    {
        title: 'Gender',
        description: filteredPatient[0]?.Gender || 'N/A',
    },
    {
        title: 'Marital Status',
        description: filteredPatient[0]?.MaritalStatus || 'N/A',
    },
    {
        title: 'Nationality',
        description: filteredPatient[0]?.Nationality || 'N/A',
    },
]

const patientSecondaryInfo = [
    {
        title: 'Date of Birth',
        description: filteredPatient[0]?.DateOfBirth || 'N/A',
    },
    {
        title: 'Address 1',
        description: filteredPatient[0]?.SpouseAddress2 || 'N/A',
    },
    {
        title: 'Address 2',
        description: filteredPatient[0]?.SpouseAddress1 || 'N/A',
    },
    {
        title: 'County Ward',
        description: filteredPatient[0]?.CountyWard || 'N/A',
    },
    {
        title: 'Sub County',
        description: filteredPatient[0]?.SubCountyName || 'N/A',
    },
    
    {
        title: 'Home Telephone',
        description: filteredPatient[0]?.TelephoneNo2 || 'N/A',
    },
    {
        title: 'Mobile Phone',
        description: filteredPatient[0]?.TelephoneNo1 || 'N/A',
    }
]
  return (
    <div>
        
        <NurseInnerHeader icon={<UserOutlined />} title="Patient Information" />

        {
          loadingTriageWaitingList ? (
            <Loading />
          ):(
            <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={{ padding: '10px 16px', borderTop: '3px solid #0f5689' }}>
                    {patientPrimaryInfo.map((info, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <Typography.Text strong style={{ paddingTop: '5px'}}>{info.title}</Typography.Text>
                            <Typography.Text>{info.description}</Typography.Text>
                        </div>
                    ))}
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Card style={{ padding: '10px 16px', borderTop: '3px solid #0f5689' }}>
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

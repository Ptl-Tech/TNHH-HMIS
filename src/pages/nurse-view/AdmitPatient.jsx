import { Col, Row } from "antd"
import AdmitPatientForm from "./forms/nurse-forms/AdmitPatient";
import NurseInnerHeader from "../../partials/nurse-partials/NurseInnerHeader";

const AdmitPatient = () => {  
  return (   
    <div>
    <Row style={{ margin: '20px 10px 10px 10px' }}>
            <Col span={24}>
                
                <NurseInnerHeader title="Patient Admission Form" />

            </Col>
        </Row>
        <AdmitPatientForm /> 
    </div>
  )
}

export default AdmitPatient
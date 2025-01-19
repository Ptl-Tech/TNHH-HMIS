import { Col, List, Row, Typography } from "antd"
import { useLocation } from "react-router-dom";
import useFetchAllPatientsHook from "../../../hooks/useFetchAllPatientsHook";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import Loading from "../../../partials/nurse-partials/Loading";
import { UserAddOutlined } from "@ant-design/icons";

const NextOfKin = () => {

    const { loadingTriageWaitingList, triageWaitingList } = useFetchAllPatientsHook();
    const { patientDetails } = useLocation().state;
    const filteredPatient = triageWaitingList?.filter(patient => patient.PatientNo === patientDetails?.Patient_No);

  const data = [
   
    {
        title: 'Next of Kin Full Name',
        description: filteredPatient[0]?.NextOfkinFullName || 'N/A',
    },
    {
        title: 'Next of Kin Relationship',
        description: filteredPatient[0]?.NextofkinRelationship || 'N/A',
    },
    {
        title: 'Next of Kin ID Number',
        description: filteredPatient[0]?.NextOfKinIDCardNo || 'N/A',
    },
    {
        title: 'Next of Kin Address 1',
        description: filteredPatient[0]?.NextOfkinAddress1 || 'N/A',
    },
    {
        title: 'Next of Kin Address 2',
        description: filteredPatient[0]?.NextOfkinAddress2 || 'N/A',
    }
]
  return (
    
   <div>
      <NurseInnerHeader icon={<UserAddOutlined />}title="Next of Kin Information" />
       {
         loadingTriageWaitingList ? (
            <Loading />
         ):(
            <List 
            style={{ marginTop: '20px' }}
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
                <Row 
                    key={item.id} 
                    gutter={8} 
                    align="middle" 
                    style={{
                        marginBottom: '10px',
                        borderBottom: '1px solid #e8e8e8', // Adds a subtle bottom border
                        paddingBottom: '10px' // Adds space between the content and border
                    }}
                >
                    <Col xs={24} sm={12}>
                        <Typography.Text style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {item.title}
                        </Typography.Text>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Typography.Text>{item.description}</Typography.Text>
                    </Col>
                </Row>
            )}
        />
         )
       }
   </div>
  )
}

export default NextOfKin
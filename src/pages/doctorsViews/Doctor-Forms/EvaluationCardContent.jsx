import { Card, Tabs } from 'antd';
import PatientRequests from './PatientRequests';
import ConsultationroomDetails from './ConsultationroomDetails';
import AdmissionTab from './AdmissionTab';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Medication from './Medication';

const EvaluationCardContent = ({
  treatmentNo,
  observationNo,
  patientNo,
  patientDetails,
  role,
}) => {
  const location = useLocation();
  const patientDetail = location.state?.patientDetails;

  return (
    <div>
      <Card
        variant="borderless"
        styles={{ body: { boxShadow: 'none' } }}
        style={{ padding: '12px', boxShadow: 'none' }}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab="Consultation Room "
            key="1"
          >
            <ConsultationroomDetails
              treatmentNo={treatmentNo}
              observationNo={observationNo}
              patientNo={patientNo}
            />
          </Tabs.TabPane>
          {(role === 'Doctor' || role === 'Nurse') && (
            <>
              <Tabs.TabPane
                tab="Medication"
                key="2"
              >
                <Medication
                  treatmentNo={treatmentNo}
                  observationNo={observationNo}
                  patientNo={patientNo}
                />
              </Tabs.TabPane>
            </>
          )}
          {(role === 'Doctor' || role === 'Nurse') && (
            <>
              <Tabs.TabPane
                tab="Procedures"
                key="3"
              >
                <PatientRequests />
              </Tabs.TabPane>{' '}
            </>
          )}
          {role === 'Doctor' && patientDetail?.Status !== 'Completed' && (
            <>
              <Tabs.TabPane
                tab="Admission & Referral"
                key="4"
              >
                <AdmissionTab />
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
      </Card>
    </div>
  );
};

export default EvaluationCardContent;
// props validation
EvaluationCardContent.propTypes = {
  treatmentNo: PropTypes.string,
  observationNo: PropTypes.string,
  patientNo: PropTypes.string,
  patientDetails: PropTypes.object,
  role: PropTypes.string,
};

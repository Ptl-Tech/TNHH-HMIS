import { Card, Tabs } from 'antd'
import PatientFile from './PatientFile'
import CarePlan from './CarePlan'
import Requests from './Requests'
import Discharges from './Discharges'

const InpatientCardContent = ({patientDetails}) => {
  return (
    <>
        <Card className="card">
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Patient File" key="1">
                    <PatientFile patientDetails={patientDetails} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Care Plan" key="2">
                    <CarePlan />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Requests" key="3">
                    <Requests />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Discharge" key="4">
                    <Discharges/>
                </Tabs.TabPane>
            </Tabs>
        </Card>
    </>
  )
}

export default InpatientCardContent
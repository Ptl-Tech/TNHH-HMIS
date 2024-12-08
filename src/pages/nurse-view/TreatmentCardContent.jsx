import { Button, Card, Tabs } from "antd"
import { CheckOutlined, PrinterOutlined } from "@ant-design/icons"

const TreatmentCardContent = () => {
  return (
    <div>
        <Card className="card">
            <div className="treatment-card-buttons">
                <Button color="default" variant="outlined"><CheckOutlined /> Mark as Complete</Button>
                <Button color="default" variant="outlined"><CheckOutlined /> Transfer/Assign Patient</Button>
                <Button color="default" variant="outlined"><PrinterOutlined /> Print Interim Invoice</Button>
            </div>
        </Card>
        <Card className="treatment-card-patient-treatment-info">
            <Tabs>
                <Tabs.TabPane tab="Doctor Notes" key="1">
                </Tabs.TabPane>
                <Tabs.TabPane tab="Lab results" key="2">
                </Tabs.TabPane>
                <Tabs.TabPane tab="Diagnosis" key="3">
                </Tabs.TabPane>
                <Tabs.TabPane tab="Charges" key="4">
                </Tabs.TabPane>
                <Tabs.TabPane tab="Consumables" key="5">
                </Tabs.TabPane>
            </Tabs>
        </Card>
    </div>
  )
}

export default TreatmentCardContent
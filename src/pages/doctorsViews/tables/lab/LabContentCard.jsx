import { Button, Card, Tabs } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FileSearchOutlined,
  ContainerOutlined,
  EditOutlined,
  FileAddOutlined,
  DollarOutlined,
} from "@ant-design/icons"; // Importing icons
import LabTestRequest from "./LabTestRequest";
import SampleCollection from "./SampleCollection";
import LabResultsEntry from "./LabResultsEntry";
import ExternalLabResults from "./ExternalLabResults";
import Charges from "../../../nurse-view/nurse-patient-file/Charges";

const LabContentCard = ({ patientNo, labObservationNo, patientLabRecord }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Card className="card" style={{ padding: "10px 16px", marginTop: "20px" }}>
        <Tabs
          defaultActiveKey="1"
          tabBarStyle={{
            display: "flex",
            justifyContent: "space-around",
            borderBottom: "none", // Remove the default underline
          }}
          tabBarGutter={16} // Adjust spacing between tabs
        >
          <Tabs.TabPane
            tab={
              <Button type="primary" style={{ borderRadius: "4px" }}>
                <FileSearchOutlined style={{ marginRight: "8px" }} />
                Lab Test Requests
              </Button>
            }
            key="1"
          >
            <LabTestRequest/>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <Button type="primary" style={{ borderRadius: "4px" }}>
                <ContainerOutlined style={{ marginRight: "8px" }} />
                Sample Collection
              </Button>
            }
            key="2"
          >
            <SampleCollection/>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <Button type="primary" style={{ borderRadius: "4px" }}>
                <EditOutlined style={{ marginRight: "8px" }} />
                Lab Results Entry
              </Button>
            }
            key="3"
          >
            <LabResultsEntry/>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <Button type="primary" style={{ borderRadius: "4px" }}>
                <FileAddOutlined style={{ marginRight: "8px" }} />
                Lab External Orders
              </Button>
            }
            key="4"
          >

            <ExternalLabResults/>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <Button type="primary" style={{ borderRadius: "4px" }}>
                <DollarOutlined style={{ marginRight: "8px" }} />
                Charges
              </Button>
            }
            key="5"
          >
           <Charges/>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default LabContentCard;

import React from "react";

import AllergyAndMedication from "../../nurse-view/forms/triage-forms/AllergyAndMedication";
import Injections from "../../nurse-view/forms/triage-forms/Injections";
import { Typography, Card, List } from "antd";
import PrescriptionForm from "./PrescriptionForm";

const Medication = () => {
  const allergyItems = [
    {
      title: 'Food Allergies',
      description: 'Penicillin, Sulphur, Penicillin, Penicillin',
    },
    {
      title: 'Medications Allergies',
      description: 'Paracetamol, Aspirin, Penicillin, Penicillin',
    },
  ]
  return (
    <div>
        
         <div>
        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
          Allergy and Medication
        </Typography.Title>
        <Card className="card" style={{ width: '100%', backgroundColor: '#e5e3e3', border: 'none', padding: '10px', marginBottom: '20px' }}>
        
            <List header={<div style={{ fontSize: '14px', fontWeight: 'bold', color: 'red' }}>Allergies and Chronics</div>}
            itemLayout="horizontal"
            dataSource={allergyItems}
            renderItem={(item) => (
            <List.Item style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography.Text className="allergies-item-list-title">{item.title}</Typography.Text>
                <Typography.Text>{item.description}</Typography.Text>
            </List.Item>
            )}
            >
            </List>

        </Card>
      </div>
      <div>
        <Typography.Title
          level={5}
          style={{
            color: "#0F5689",
            fontSize: "16px",
            marginBottom: "12px",
          }}
        >
         Prescription Details
        </Typography.Title>
        
        <PrescriptionForm />
      </div>

    </div>
  )
}

export default Medication
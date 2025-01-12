import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Steps, Row, Col, Tabs, Typography } from 'antd';
import { FiFileText } from 'react-icons/fi';

const { Step } = Steps;
const { TabPane } = Tabs;

const FourPsForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5)); // Now we have 5 steps: 1 for Aetiology and 4 for 4Ps
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        console.log('Saved Data:', values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div>
          <Typography.Title
        level={5}
        style={{
          color: "#0F5689",
          fontSize: "16px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FiFileText style={{ marginRight: "8px" }} />
        Patient Assessment
      </Typography.Title>
      {/* <h2>Patient Assessment</h2> */}

      {/* Using Ant Design Tabs for steps */}
      <Tabs activeKey={String(currentStep)} onChange={(key) => setCurrentStep(parseInt(key))} type="card">
        <TabPane tab="Aetiology" key="0">
          {/* Aetiology (Cause of the Condition) */}
          <Form form={form}>
            <Form.Item name="aetiology" label="Aetiology">
              <Input.TextArea rows={4} placeholder="Describe the cause and origin of the condition" />
            </Form.Item>
          </Form>
        </TabPane>

        {/* 4Ps - Predisposing Factors */}
        <TabPane tab="Predisposing Factors" key="1">
          <Form form={form}>
            <Form.Item name="familyHistory" label="Family History">
              <Input placeholder="Family history of mental illness" />
            </Form.Item>
            <Form.Item name="traumaHistory" label="Trauma History">
              <Input placeholder="Any past trauma or abuse?" />
            </Form.Item>
            <Form.Item name="geneticFactors" label="Genetic Factors">
              <Checkbox>Any genetic predisposition to mental disorders?</Checkbox>
            </Form.Item>
          </Form>
        </TabPane>

        {/* 4Ps - Precipitating Factors */}
        <TabPane tab="Precipitating Factors" key="2">
          <Form form={form}>
            <Form.Item name="recentStressors" label="Recent Stressors">
              <Input placeholder="Recent life events or stressors" />
            </Form.Item>
            <Form.Item name="substanceUse" label="Substance Use">
              <Checkbox>Any recent substance use (drugs, alcohol)?</Checkbox>
            </Form.Item>
            <Form.Item name="physicalHealth" label="Physical Health Issues">
              <Input placeholder="Any recent physical health issues?" />
            </Form.Item>
          </Form>
        </TabPane>

        {/* 4Ps - Perpetuating Factors */}
        <TabPane tab="Perpetuating Factors" key="3">
          <Form form={form}>
            <Form.Item name="negativeThoughts" label="Negative Thought Patterns">
              <Input placeholder="Negative thought patterns (e.g., rumination)" />
            </Form.Item>
            <Form.Item name="socialIsolation" label="Social Isolation">
              <Checkbox>Social isolation or lack of support?</Checkbox>
            </Form.Item>
            <Form.Item name="substanceMisuse" label="Substance Misuse">
              <Checkbox>Ongoing substance misuse?</Checkbox>
            </Form.Item>
          </Form>
        </TabPane>

        {/* 4Ps - Protective Factors */}
        <TabPane tab="Protective Factors" key="4">
          <Form form={form}>
            <Form.Item name="socialSupport" label="Social Support">
              <Input placeholder="Support from family/friends" />
            </Form.Item>
            <Form.Item name="healthyHabits" label="Healthy Habits">
              <Checkbox>Engagement in healthy activities (exercise, hobbies)?</Checkbox>
            </Form.Item>
            <Form.Item name="personalStrengths" label="Personal Strengths">
              <Input placeholder="Strengths or coping mechanisms" />
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>

      {/* Navigation buttons */}
      <Row justify="space-between" style={{ marginTop: 20 }}>
        <Col>
          <Button onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </Button>
        </Col>
        <Col>
          {currentStep === 4 ? (
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button type="primary" onClick={nextStep}>
              Next
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FourPsForm;

import React, { useState, useEffect } from "react"; 
import { Form, Input, Button, Select, Typography, Row, Col, Popconfirm } from "antd"; 
import { FileTextOutlined, PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons"; 
import { useDispatch, useSelector } from "react-redux"; 
import { getSymptomsRequest } from "../../../actions/Doc-actions/qySymptomsSetup"; 
import { getSignsSetup } from "../../../actions/Doc-actions/qySignsSetup"; 
import { getHMSsetup } from "../../../actions/Doc-actions/qyHMSSystems"; 
import { useLocation } from "react-router-dom"; 
import { postSignsRequest } from "../../../actions/Doc-actions/postSigns"; 
import { postSymptomsRequest } from "../../../actions/Doc-actions/postSyptoms";

const DoctorNotes = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const treatmentNo = queryParams.get("TreatmentNo");

  const [signsData, setSignsData] = useState([]);
  const [symptomsData, setSymptomsData] = useState([]);

  const dispatch = useDispatch();

  const { loading: systemLoading, data: system = [] } = useSelector((state) => state.getHMSsetup);
  const { loading: symptomLoading, data: symptoms = [] } = useSelector((state) => state.getSymptoms);
  const { loading: signsLoading, data: signs = [] } = useSelector((state) => state.getSignsSetup);
  const { loading: postsignsLoading } = useSelector((state) => state.saveSigns);
  const { loading: postsyptomsLoading} = useSelector((state) => state.saveSyptoms);

  useEffect(() => {
    dispatch(getSymptomsRequest());
    dispatch(getSignsSetup());
    dispatch(getHMSsetup());
  }, [dispatch]);

  const handleSignsChange = (value) => {
    const selectedSign = signs.find((sign) => sign.SignCode === value);
    if (selectedSign) {
      setSignsData([...signsData, { key: `${Date.now()}-${Math.random()}`, signCode: value, description: selectedSign.SignsName }]);
    }
  };

  const handleSymptomsChange = (value) => {
    const selectedSymptom = symptoms.find((symptom) => symptom.SymptomCode === value);
    if (selectedSymptom) {
      setSymptomsData([...symptomsData, { key: `${Date.now()}-${Math.random()}`, symptomCode: value, description: selectedSymptom.SymptomName, xtics: "", duration: "" }]);
    }
  };

  const handleSymptomDescriptionChange = (value, key) => {
    setSymptomsData((prevData) => prevData.map((item) => (item.key === key ? { ...item, description: value } : item)));
  };

  const handleXticsChange = (value, key) => {
    setSymptomsData((prevData) => prevData.map((item) => (item.key === key ? { ...item, xtics: value } : item)));
  };

  const handleDurationChange = (value, key) => {
    setSymptomsData((prevData) => prevData.map((item) => (item.key === key ? { ...item, duration: value } : item)));
  };

  const deleteItem = (key, type) => {
    if (type === "signs") {
      setSignsData(signsData.filter((item) => item.key !== key));
    } else {
      setSymptomsData(symptomsData.filter((item) => item.key !== key));
    }
  };

  const onFinish = (values) => {
    const signs = signsData.map((sign) => ({
      myAction: "create", 
      treatmentNo,
      signNo: sign.signCode, 
      system: values.system, 
    }));

    const symptoms = symptomsData.map((symptom) => ({
      myAction: "create", 
      treatmentNo,
      symptomCode: symptom.symptomCode, 
      system: values.system, 
      duration: symptom.duration,
      description: symptom.description,
      characteristics: symptom.xtics,
    }));

    dispatch(postSignsRequest(signs));
    dispatch(postSymptomsRequest(symptoms));
  };

  return (
    <div>
      <Typography.Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
        <FileTextOutlined />
        Patient Signs and Symptoms
      </Typography.Title>

      <Form name="patientData" onFinish={onFinish} layout="vertical">
        <Typography.Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
          Signs
        </Typography.Title>
        <Row gutter={16}>
          <Col span={9}>
            <Form.Item label="Select Sign" name="system" rules={[{ required: true, message: "Please select a system!" }]}>
              <Select placeholder="Select System" loading={systemLoading} style={{ width: "100%" }}>
                {system.map((sys) => (
                  <Select.Option key={sys.Code} value={sys.Code}>
                    {sys.Description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item label="Select Sign" name="sign" rules={[{ required: true, message: "Please select a sign!" }]}>
              <Select placeholder="Select Sign" loading={signsLoading} onChange={handleSignsChange} style={{ width: "100%" }}>
                {signs.map((sign) => (
                  <Select.Option key={sign.SignCode} value={sign.SignCode}>
                    {sign.SignsName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: "#0F5689", color: "white", marginTop: "30px" }}>
              <PlusOutlined />
              Add Sign
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={8}><strong>Description</strong></Col>
          <Col span={8}><strong>Action</strong></Col>
        </Row>
        {signsData.map((item) => (
          <Row key={item.key} gutter={[16, 16]}>
            <Col span={8}>{item.description}</Col>
            <Col span={8}>
              <Popconfirm title="Are you sure to delete?" onConfirm={() => deleteItem(item.key, "signs")} okText="Yes" cancelText="No">
                <Button type="link" icon={<DeleteOutlined />} danger>Remove</Button>
              </Popconfirm>
            </Col>
          </Row>
        ))}

        <Typography.Title level={5} style={{ marginTop: "24px", color: "#0F5689" }}>
          Symptoms
        </Typography.Title>
        <Row gutter={16}>
          <Col span={9}>
            <Form.Item label="Select System" name="system" rules={[{ required: true, message: "Please select a system!" }]}>
              <Select placeholder="Select System" loading={systemLoading} style={{ width: "100%" }}>
                {system.map((sys) => (
                  <Select.Option key={sys.Code} value={sys.Code}>
                    {sys.Description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item label="Select Symptom" name="symptom" rules={[{ required: true, message: "Please select a symptom!" }]}>
              <Select placeholder="Select Symptom" loading={symptomLoading} onChange={handleSymptomsChange} style={{ width: "100%" }}>
                {symptoms.map((symptom) => (
                  <Select.Option key={symptom.SymptomCode} value={symptom.SymptomCode}>
                    {symptom.SymptomName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button type="primary" onClick={() => setSymptomsData([...symptomsData])} icon={<PlusOutlined />} style={{ marginTop: "30px" }}>
                Add Symptom
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
          <Col span={6}><strong>Description</strong></Col>
          <Col span={6}><strong>Characteristics</strong></Col>
          <Col span={6}><strong>Duration</strong></Col>
          <Col span={6}><strong>Action</strong></Col>
        </Row>
        {symptomsData.map((item) => (
          <Row key={item.key} gutter={[16, 16]}>
            <Col span={6}>
              <Input value={item.description} onChange={(e) => handleSymptomDescriptionChange(e.target.value, item.key)} />
            </Col>
            <Col span={6}>
              <Input value={item.xtics} onChange={(e) => handleXticsChange(e.target.value, item.key)} />
            </Col>
            <Col span={6}>
              <Input value={item.duration} onChange={(e) => handleDurationChange(e.target.value, item.key)} />
            </Col>
            <Col span={6}>
              <Popconfirm title="Are you sure to delete?" onConfirm={() => deleteItem(item.key, "symptoms")} okText="Yes" cancelText="No">
                <Button type="link" icon={<DeleteOutlined />} danger>Remove</Button>
              </Popconfirm>
            </Col>
          </Row>
        ))}

        <Button
          type="primary"
          htmlType="submit"
          style={{ backgroundColor: "#0F5689", color: "white", marginTop: "30px" }}
          icon={<SaveOutlined />}
        >
          Save Signs & Symptoms
        </Button>
      </Form>
    </div>
  );
};

export default DoctorNotes;

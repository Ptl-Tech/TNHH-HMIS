import {
    Form,
    Input,
    Row,
    Col,
    Button,
    Typography,
    Select,
    Table,
    message,
  } from "antd";
  import React, { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { postLabRequest } from "../../../../actions/Doc-actions/postLabRequest";
  import { getLabRequestSetup } from "../../../../actions/Doc-actions/qyLabTestsSetup";
  import { SaveOutlined, PlusOutlined } from "@ant-design/icons";
  import TextArea from "antd/es/input/TextArea";
import { getItemUnitsOfMeasureSlice } from "../../../../actions/triage-actions/getItemUnitsOfMeasureSlice";
import { getSpecimenSampleSetupSlice } from "../../../../actions/Doc-actions/getSampleCollectionSetup";
  
  const { Option } = Select;
  
  const SampleCollection = () => {
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false); // Toggle between table and form
  
    const { data: labTestSetupData } = useSelector(
      (state) => state.getlabRequestSetup
    );
    const { itemUnitsOfMeasure } = useSelector((state) => state.getItemUnits);
    const { specimens } = useSelector((state) => state.getSampleSetup);

    const { loading: loadingLabRequestPost } = useSelector(
      (state) => state.postLabRequest
    );
    const { data: patientLabTest } = useSelector(
      (state) => state.patientLabTest
    );
    const [labRequest, setLabRequest] = useState({
      myAction: "create", // Action type (create or update)
      recId: "", // To be filled dynamically (perhaps from SystemId)
      laboratoryNo: "", // From header or dynamic data
      specimenCode: "",
      unitOfMeasure: "",
      countValue: 0,
      positive: true, // true/false
      remarks: "",
    });
  
    useEffect(() => {
      dispatch(getLabRequestSetup());
    }, [dispatch]);

      useEffect(() => {
        dispatch(getItemUnitsOfMeasureSlice());
      }, [dispatch]);
    

      useEffect(() => {
        dispatch(getSpecimenSampleSetupSlice());
        }, [dispatch]);
  
    const handleFieldChange = (field, value) => {
      setLabRequest((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleSave = () => {
      dispatch(postLabRequest(labRequest)).then((data) => {
        if (data.status === "success") message.success(data.status);
      });
    };
  
    const columns = [
      { title: "Specimen Code", dataIndex: "specimenCode", key: "specimenCode" },
      { title: "Unit of Measure", dataIndex: "unitOfMeasure", key: "unitOfMeasure" },
      { title: "Count Value", dataIndex: "countValue", key: "countValue" },
      { title: "Positive", dataIndex: "positive", key: "positive" },
      { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    ];
  
    const dataSource = Array.isArray(patientLabTest)
      ? patientLabTest // Filter if necessary
      : [];
  
    return (
      <div>
        <Typography.Title level={5} style={{ color: "#0F5689", marginBottom: "12px" }}>
          Sample Collection
        </Typography.Title>
  
        <div className="d-flex justify-content-end my-2">
          <Button
            type="primary"
            onClick={() => setShowForm(!showForm)}
            icon={showForm ? <PlusOutlined /> : <PlusOutlined />}
          >
            {!showForm ? "New Request" : "View History"}
          </Button>
        </div>
  
        {!showForm ? (
          <Table columns={columns} dataSource={dataSource} pagination={false} />
        ) : (
          <Form layout="vertical" autoComplete="off">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="specimenCode" label="Specimen Sample Code" rules={[{ required: true }]}>
                 
                  <Select
                    placeholder="Select Specimen Sample Code"
                    value={labRequest.specimenCode}
                    onChange={(e) => handleFieldChange("specimenCode", e.target.value)}
                  >
                    {specimens?.map((item) => (
                  <Select.Option key={item.Code} value={item.Code}>
                    {item.Description}
                  </Select.Option>
                ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="unitOfMeasure" label="Unit of Measure" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Unit of Measure"
                    value={labRequest.unitOfMeasure}
                    onChange={(value) => handleFieldChange("unitOfMeasure", value)}
                  >
                    {itemUnitsOfMeasure.map((item) => (
                  <Select.Option key={item.Code} value={item.Code}>
                    {item.Description}
                  </Select.Option>
                ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
  
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="countValue" label="Count Value" rules={[{ required: true }]}>
                  <Input
                    type="number"
                    value={labRequest.countValue}
                    onChange={(e) => handleFieldChange("countValue", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="positive" label="Positive" rules={[{ required: true }]}>
                  <Select
                    placeholder="Select Positive"
                    value={labRequest.positive}
                    onChange={(value) => handleFieldChange("positive", value)}
                  >
                    <Option value={true}>True</Option>
                    <Option value={false}>False</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
  
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item name="remarks" label="Remarks">
                  <TextArea
                    value={labRequest.remarks}
                    onChange={(e) => handleFieldChange("remarks", e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
  
            <div className="my-2">
              <Button
                type="primary"
                style={{
                  marginTop: "16px",
                  marginBottom: "16px",
                  marginRight: "16px",
                  float: "right",
                  width: "150px",
                }}
                onClick={handleSave}
                loading={loadingLabRequestPost}
              >
                <SaveOutlined />
                Save Sample
              </Button>
            </div>
          </Form>
        )}
      </div>
    );
  };
  
  export default SampleCollection;
  
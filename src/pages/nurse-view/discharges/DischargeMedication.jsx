import { Button, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd"
import { PlusOutlined, FileMarkdownOutlined, FolderViewOutlined } from "@ant-design/icons"
import { useState } from "react";
import DischargeMedicationTable from "../tables/nurse-tables/DischargeMedicationTable";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
// import useAuth from "../../../hooks/useAuth";

const DischargeMedication = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const role = null.userData.departmentName
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    const [ form ] = Form.useForm();
  return (
    <div>
        
        <NurseInnerHeader icon={<FileMarkdownOutlined/>} title="Discharge Medication" />

        {
          role === 'Doctor' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
            <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Discharge Medication
          </Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><FolderViewOutlined />
            Preview Discharge Medication
          </Button>
        </div>
          ) : (
            null
          )
        }


        <DischargeMedicationTable />

        <Modal title="Discharge Medication" 
        open={isModalOpen} 
        onOk={handleOk} 
        onCancel={handleCancel}
        okText="Discharge Medication"
        >
        <Form
            layout="vertical" 
            style={{ paddingTop: '10px'}} 
            form={form}
            autoComplete="off"
            
            >

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Drug Name" 
                    name="drugName"
                    rules={[{ required: true, message: 'Please select a drug name!' }]}
                    hasFeedback
                    >
                    <Select placeholder="Select a category">
                        <Select.Option value="General">Drug 1</Select.Option>
                        <Select.Option value="Allergy">Drug 2</Select.Option> 
                    </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Dosage"
                    name="dosage"
                    rules={[{ required: true, message: 'Please enter a dosage!' }]}
                    hasFeedback
                    >
                        <Input placeholder="Enter dosage" 
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Route" 
                name="route"
                rules={[{ required: true, message: 'Please select a route!' }]}
                hasFeedback
                >
                  <Select placeholder="Select a route">
                      <Select.Option value="General">Oral</Select.Option>
                      <Select.Option value="Allergy">Intravenous</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Frequency" 
                name="frequency"
                rules={[{ required: true, message: 'Please select a frequency!' }]}
                hasFeedback
                >
                  <Select placeholder="Select a frequency">
                    <Select.Option value="General">Once a day</Select.Option>
                    <Select.Option value="Allergy">Twice a day</Select.Option>
                  </Select>
              </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
              <Form.Item label="Duration"
              name="duration"
              rules={[{ required: true, message: 'Please select a duration!' }]}
              hasFeedback
              >
                <Input placeholder="Enter duration" type="number" />
              </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter a quantity!' }]}
                hasFeedback
                >
                  <Input placeholder="Enter quantity" type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
              <Form.Item label="Start Date" 
              rules={[{ required: true, message: 'Please select a start date!' }]}
              name="startDate"
              hasFeedback
              >
                <DatePicker type='text' placeholder="Enter date" style={{ width: '100%' }}/>
                  
              </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item label="End Date"
              rules={[{ required: true, message: 'Please select an end date!' }]}
              name="endDate"
              hasFeedback
              >
                <DatePicker type='text' placeholder="Enter date" style={{ width: '100%' }}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
            <Col span={24}>
                <Form.Item label="UOM" 
                name="UOM"
                rules={[{ required: true, message: 'Please select a UOM!' }]}
                hasFeedback
                >
                  <Select placeholder="Select a UOM">
                    <Select.Option value="General">Once a day</Select.Option>
                    <Select.Option value="Allergy">Twice a day</Select.Option>
                  </Select>
              </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
              <Form.Item label="Instructions" name="instructions"
              rules={[{ required: true, message: 'Please enter instructions!' }]}
              hasFeedback
              >
                <Input.TextArea type='text' placeholder="Enter instructions"
                />
              </Form.Item>
              </Col>
              </Row>

            </Form>
        </Modal>


    </div>
  )
}

export default DischargeMedication
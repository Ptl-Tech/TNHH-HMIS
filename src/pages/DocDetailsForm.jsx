import React, { useState } from 'react'; 
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { postDoctorTreatment } from '../actions/patientActions';
import { useDispatch, useSelector } from 'react-redux';

const { TextArea } = Input;
const { Option } = Select;

const DoctorDetailsForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const patient = location.state?.patient || {};
    const triageRecord = location.state?.triage || {};
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const { loading, success, error } = useSelector(state => state.postDoctorTreatment);
    const [submitting, setSubmitting] = useState(false);
    // Ensure that vitals is defined and has the required properties
    const initialVitals = triageRecord.vitals || { height: '', weight: '', heartRate: '', temperature: '', bloodPressure: '', respiratoryRate: '' };

    const onFinish = async (values) => {
        setSubmitting(true);
       
        const vitals = {
            height: initialVitals.height,
            weight: initialVitals.weight,
            heartRate: initialVitals.heartRate,
            temperature: initialVitals.temperature,
            bloodPressure: initialVitals.bloodPressure,
            respiratoryRate: initialVitals.respiratoryRate
        };
    
        const { symptoms, notes, diagnosis, treatment, additionalNotes, consultationDate } = values;
    

        try {
            await dispatch(postDoctorTreatment(triageRecord.id, vitals, symptoms, notes, diagnosis, treatment, additionalNotes, consultationDate));
            navigate('/Doctor/Outpatient-list');
        } catch (error) {
            console.error('Failed to submit observation:', error);
        } finally {
            setSubmitting(false);
        }
    };
    const handleBack = () => {
        navigate('/Doctor/Outpatient-list');
    };

    return (
        <div className="container">
            <h4 className="text-center p-3">Doctor's Details Form</h4>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="link" onClick={handleBack}>
                    Back to Patients List
                </Button>
            </div>
            {patient && (
                <div className="card-header text-dark">
                    <h5>Patient Details</h5>
                    <p><strong>First Name:</strong> {patient.firstName}</p>
                    <p><strong>Last Name:</strong> {patient.lastName}</p>
                    <p><strong>ID Number:</strong> {patient.idNumber}</p>
                </div>
            )}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    consultationDate: moment(), // Automatically set current date
                }}
            >
                <Form.Item
                    label="Date of Consultation"
                    name="consultationDate"
                    rules={[{ required: true, message: 'Please select the consultation date' }]}
                >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Vital Signs">
                    <div style={{ border: '1px solid #d9d9d9', padding: '10px', borderRadius: '4px' }}>
                        <p><strong>Height:</strong> {initialVitals.height} cm</p>
                        <p><strong>Weight:</strong> {initialVitals.weight} kg</p>
                        <p><strong>Heart Rate:</strong> {initialVitals.heartRate} bpm</p>
                        <p><strong>Temperature:</strong> {initialVitals.temperature} °C</p>
                        <p><strong>Blood Pressure:</strong> {initialVitals.bloodPressure} mmHg</p>
                        <p><strong>Respiratory Rate:</strong> {initialVitals.respiratoryRate} breaths/min</p>
                    </div>
                </Form.Item>

                <Form.Item
                    label="Symptoms"
                    name="symptoms"
                    rules={[{ required: true, message: 'Please describe the symptoms' }]}
                >
                    <TextArea rows={4} placeholder="Enter symptoms observed or reported by the patient" />
                </Form.Item>

                <Form.Item
                    label="Doctor's Notes"
                    name="notes"
                    rules={[{ required: true, message: 'Please enter any notes' }]}
                >
                    <TextArea rows={4} placeholder="Enter any additional notes or observations" />
                </Form.Item>

                <Form.Item
                    label="Diagnosis"
                    name="diagnosis"
                    rules={[{ required: true, message: 'Please provide a diagnosis' }]}
                >
                    <Input placeholder="Enter the diagnosis" />
                </Form.Item>

                <Form.Item
                    label="Recommended Treatment"
                    name="treatment"
                    rules={[{ required: true, message: 'Please recommend a treatment' }]}
                >
                    <TextArea rows={4} placeholder="Enter the recommended treatment plan" />
                </Form.Item>

                <Form.Item
                    label="Follow-up Required"
                    name="followUp"
                    rules={[{ required: true, message: 'Please select follow-up requirement' }]}
                >
                    <Select placeholder="Select if follow-up is needed" style={{ width: '100%' }}>
                        <Option value="yes">Yes</Option>
                        <Option value="no">No</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Additional Notes (Optional)"
                    name="additionalNotes"
                >
                    <TextArea rows={4} placeholder="Enter any additional notes or recommendations" />
                </Form.Item>

                <Form.Item className="text-center">
                    <Button type="primary" htmlType="submit" loading={submitting}>
                        Submit Details
                    </Button>
                    <Button type="default" onClick={handleBack} style={{ marginLeft: '10px' }}>
                        Back to Patients List
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default DoctorDetailsForm;

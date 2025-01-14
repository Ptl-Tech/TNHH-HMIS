import { Button, Col, Form, message, Row, Select } from "antd"
import TextArea from "antd/es/input/TextArea";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { POST_DISPATCH_TO_DOCTOR_FAIL, POST_DISPATCH_TO_DOCTOR_SUCCESS, postDispatchToDoctorSlice } from "../../../actions/triage-actions/postDispatchToDoctorSlice";
import { useEffect } from "react";
import { getQyUrgencyColorCodingSetupSetupSlice } from "../../../actions/nurse-actions/getQyUrgencyColorCodingSetupSlice";

const TriageDispatchToDoctorFormData = ({ staffNo, observationNo, setIsDispatchFormVisible }) => {
    const { form } = Form.useForm();
    const dispatch = useDispatch();
    const { loadingColorCode, colorCode } = useSelector((state) => state.getQyUrgencyColorCodingSetup);
    const { loadingDispatchToDoctor } = useSelector((state)=> state.dispatchToDoctor);
   
    const handleOnFinish = async (values) => {
        const dispatchData = {
            observationNo,
            staffNo,
            urgencyStatus: values.status,
            tcaStatusRemarks: values.urgencyStatus,
            observationRemark: values.remarks,
        }
        
        try{
            const result = await dispatch(postDispatchToDoctorSlice(dispatchData))
            if(result.type === POST_DISPATCH_TO_DOCTOR_SUCCESS){
                message.success(result?.payload?.status || 'Dispatch to doctor successful');
                setIsDispatchFormVisible(false);
                form.resetFields()
            }else if(result.type === POST_DISPATCH_TO_DOCTOR_FAIL){
                message.error(result?.payload?.status || 'Dispatch to doctor failed');
                setIsDispatchFormVisible(false);
            }
        }catch(error){
           message.error(error?.message || 'Dispatch to doctor failed');
        }
        
        
    }

    useEffect(() => {
        if(!colorCode.length){
            dispatch(getQyUrgencyColorCodingSetupSetupSlice())
        }
    }, [dispatch, colorCode?.length]);
  return (
    <>
        <Form
            layout="vertical"
            form={form}
            onFinish={handleOnFinish}
            initialValues={{
                status: '',
                urgencyStatus: '',
                observationRemarks: '',
            }}
        >
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Urgency Status" name="status"
                    hasFeedback
                    rules={[{ required: true, message: 'Please select status!' }]}
                    
                >
                    <Select 
                        loading={loadingColorCode}
                        placeholder="Select Status"
                        options={colorCode.map((item) => ({
                            label: item.UrgencyStatus,
                            value: item.LineNo,
                        }))}
                    />

                </Form.Item>
            </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Urgency Status Remarks" name="urgencyStatus"
                        hasFeedback
                        
                    >
                        <TextArea 
                        placeholder="Enter Remarks"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
            <Col span={12}>
                <Form.Item label="Observation Remarks" name="remarks"
                    hasFeedback
                    
                >
                    <TextArea 
                    placeholder="Enter Remarks"
                    />
                </Form.Item>
            </Col>
        </Row>
        <Form.Item>
            <Button htmlType="submit" type="primary"
            loading={loadingDispatchToDoctor}
            disabled={loadingDispatchToDoctor}
            >
                Dispatch to Doctor
            </Button>
        </Form.Item>

        </Form>
    </>
  )
}

export default TriageDispatchToDoctorFormData

// props validation 
TriageDispatchToDoctorFormData.propTypes = {
    staffNo: PropTypes.string.isRequired,
    observationNo: PropTypes.string.isRequired,
    setIsDispatchFormVisible: PropTypes.bool.isRequired,
}
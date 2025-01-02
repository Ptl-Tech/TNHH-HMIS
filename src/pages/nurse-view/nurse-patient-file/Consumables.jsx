import { Button, Form, Input, message, Modal, Select, Space, Typography } from "antd"
import { ProfileOutlined, PlusOutlined, PrinterOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { POST_PATIENT_CONSUMABLES_FAILURE, POST_PATIENT_CONSUMABLES_SUCCESS, postPatientConsumablesSlice } from "../../../actions/nurse-actions/postPatientConsumablesSlice";
import { getPatientConsumablesSlice } from "../../../actions/nurse-actions/getPatientConsumablesSlice";
import useAuth from "../../../hooks/useAuth";
import { getQyLocationsSlice } from "../../../actions/nurse-actions/getQyLocationsSlice";
import InpatientConsumablesTable from "../tables/nurse-tables/InpatientConsumablesTable";
import { getPgOpenPatientConsumablesSlice } from "../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";

const Consumables = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { patientDetails } = useLocation().state;
    const [ form ] = Form.useForm();
    const [isEditMode, setIsEditMode] = useState(false);
    const dispatch = useDispatch();
    const userDetails = useAuth();
    const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();

    const {loadingGetPgOpenPatientConsumables, getPgOpenPatientConsumables} = useSelector(state => state.getPgOpenPatientConsumables);


    const { qyLocations } = useSelector((state) => state.getQyLocations);

    const { loadingPostConsumables } = useSelector((state) => state.postPatientConsumables);

    const consumables = getPgOpenPatientConsumables?.filter(item => item.Admission_No === patientDetails?.AdmNo);

 
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = () => {
      form.submit();
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
  
    const handleOnFinish = async (values) => {
      try {
        const { location, quantity, remarks } = values;
    
        // Construct the visitor data
        const consumableData = {
          myAction: isEditMode ? "edit" : "create",
          admissionNo: patientDetails?.CurrentAdmNo,
          recId: "",
          location,
          quantity,
          remarks,
          documentNo: patientDetails?.CurrentAdmNo,
          branchCode: branchCode,
          staffNo: userDetails.userData.no
        };
    
        // Dispatch function to handle API call and feedback
        const dispatchPatientConsumablesData = async (data) => {
          await dispatch(postPatientConsumablesSlice('/GeneralProcesses/PatientConsumables', data))
            .then((result) => {
              if (result.type === POST_PATIENT_CONSUMABLES_SUCCESS) {
                const actionWord = isEditMode ? 'updated' : 'added';
                message.success(`Visitor ${result.payload.visitorName} ${actionWord} successfully!`);
                dispatch(getPatientConsumablesSlice(patientDetails?.CurrentAdmNo));
              } else if (result.type === POST_PATIENT_CONSUMABLES_FAILURE) {
                message.error(result.payload.message || "Internal server error, please try again later.");
              }
            })
            .then(() => {
              setIsModalOpen(false);
              form.resetFields();
            })
            .catch((err) => {
              message.error(err.message || "Internal server error, please try again later.");
            });
        };
    
        // Call the function
        await dispatchPatientConsumablesData(consumableData);
    
      } catch (error) {
        message.error(error.message || "An unexpected error occurred.");
      }
    };

    useEffect(() => {
        if(!getPgOpenPatientConsumables?.length){
            dispatch(getPgOpenPatientConsumablesSlice());
        }
    }, [dispatch, getPgOpenPatientConsumables?.length]);

    useEffect(() => {
      if(!qyLocations?.length){
        dispatch(getQyLocationsSlice());
      }
    }, [dispatch, qyLocations?.length]);

  return (
    <div>
      <Space style={{ color: '#0f5689', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '30px', position: 'relative'}}>
          <ProfileOutlined />
          <Typography.Text style={{ fontWeight: 'bold', color: '#0f5689', fontSize: '14px'}}>
              Patient Consumable
          </Typography.Text>
        </Space>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', paddingBottom: '20px'}}>
          <Button type="primary" style={{ width: '100%' }} onClick={()=>showModal()}><PlusOutlined /> Add Consumables</Button>
          <Button color="default" variant="outlined" style={{ width: '100%' }}><PrinterOutlined /> Print Consumables</Button>
        </div>


        <InpatientConsumablesTable loadingGetPgOpenPatientConsumables={loadingGetPgOpenPatientConsumables} consumables={consumables}/>


        <Modal title="Consumables" 
        open={isModalOpen} onOk={handleOk} 
        onCancel={handleCancel}
        okText={isEditMode ? 'Update Consumables' : 'Post Consumables'}
        okButtonProps={{ loading: loadingPostConsumables }}
        >
            <Form
            
                layout="vertical" 
                style={{ paddingTop: '10px'}} 
                form={form}
                onFinish={handleOnFinish}
                initialValues={{
                  location: '',
                  quantity: '',
                  remarks: '',
                }}
            >

            <Form.Item 
                label="Location" 
                name="location"
                rules={[{ required: true, message: 'Please select location!' }]}
              >
              <Select
                style={{ width: '100%' }}
                placeholder="Select Item"
                allowClear
                showSearch
                options={qyLocations?.map((item) => ({
                  value: item.Code,
                  label: item.Name,
                }))}
              />
            </Form.Item>
            <Form.Item 
                label="Quantity" 
                name="quantity"
                rules={[{ required: true, message: 'Please enter quantity!' }]}
              >
                  <Input type="number" placeholder="Enter Quantity"
             />
            </Form.Item>

            <Form.Item 
            label="Remarks" 
            name="remarks"
            rules={[
              {
                  validator: (_, value) => {
                    if (value && value.length > 150) {
                      return Promise.reject(new Error('Consumables Remarks cannot exceed 150 characters!'));
                    }
                    return Promise.resolve();
                  },
              }
            ]}
          >
          <TextArea placeholder="Enter consumables remarks" name="consumablesRemarks"
              rows={2}
          />
        </Form.Item>
            </Form>
        </Modal>

    </div>
  )
}

export default Consumables
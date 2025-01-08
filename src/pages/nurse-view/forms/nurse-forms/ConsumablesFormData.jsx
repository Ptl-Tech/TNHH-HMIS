import { Button, Col, Form, Input, message, Row, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { POST_PATIENT_CONSUMABLES_FAILURE, POST_PATIENT_CONSUMABLES_SUCCESS, postPatientConsumablesSlice } from "../../../../actions/nurse-actions/postPatientConsumablesSlice";
import { getPgOpenPatientConsumablesSlice } from "../../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";
import { useEffect } from "react";
import { getQyLocationsSlice } from "../../../../actions/nurse-actions/getQyLocationsSlice";
import { getItemsSlice } from "../../../../actions/triage-actions/getItemsSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
const ConsumablesFormData = ({ setIsConsumableFormVisible }) => {
    const [ form ] = Form.useForm();
    const { patientDetails } = useLocation().state;
    const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();
    const userDetails = useAuth();
    const dispatch = useDispatch();
    const { loadingItems, items } = useSelector((state) => state.getItems);
    const { loadingQyLocations, qyLocations } = useSelector((state) => state.getQyLocations);
    const { loadingPostConsumables } = useSelector((state) => state.postPatientConsumables);
    const handleOnFinish = async (values) => {
        try {
          const { location, quantity, item, remarks } = values;
      
          // Construct the visitor data
          const consumableData = {
            myAction: "create",
            admissionNo: patientDetails?.CurrentAdmNo,
            recId: "",
            location,
            quantity,
            remarks,
            item,
            documentNo: patientDetails?.CurrentAdmNo,
            branchCode: branchCode,
            staffNo: userDetails.userData.no
          };
      
          // Dispatch function to handle API call and feedback
          const dispatchPatientConsumablesData = async (data) => {
            await dispatch(postPatientConsumablesSlice('/GeneralProcesses/PatientConsumables', data))
              .then((result) => {
                if (result.type === POST_PATIENT_CONSUMABLES_SUCCESS) {
                  message.success(`Consumables posted successfully!`);
                  dispatch(getPgOpenPatientConsumablesSlice());
                  setIsConsumableFormVisible(false);

                } else if (result.type === POST_PATIENT_CONSUMABLES_FAILURE) {
                  message.error(result?.payload?.message || "Internal server error, please try again later.");
                }
              })
              .then(() => {
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
        if(!qyLocations?.length){
          dispatch(getQyLocationsSlice());
        }
      }, [dispatch, qyLocations?.length]);
  
      useEffect(() => {
        if(!items?.length){
          dispatch(getItemsSlice());
        }
      }, [dispatch, items?.length]);
  return (
    <>
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

        <Row gutter={[16, 16]}>
            <Col span={8}>
                <Form.Item 
                label="Location" 
                name="location"
                rules={[{ required: true, message: 'Please select location!' }]}
                hasFeedback
                >
                <Select
                style={{ width: '100%' }}
                placeholder="Select Location"
                allowClear
                showSearch
                loading={loadingQyLocations}
                options={qyLocations?.map((item) => ({
                    key: item.AdmNo,
                    value: item.Code,
                    label: item.Name,
                }))}
                />
            </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item
            label="Item"
            name="item"
            rules={[{ required: true, message: 'Please select item!' }]}
            hasFeedback
        >

            <Select 
            style={{ width: '100%' }}
            placeholder="Select Item"
            allowClear
            showSearch
            loading={loadingItems}
            options={items?.map((item) => ({
                key: item.No,
                value: item.No,
                label: item.Description,
            }))}
            />

        </Form.Item>
        </Col>
        <Col span={8}>
        <Form.Item 
            label="Quantity" 
            name="quantity"
            rules={[{ required: true, message: 'Please enter quantity!' }]}
            hasFeedback
            >
                <Input type="number" placeholder="Enter Quantity"
            />
        </Form.Item>
        </Col>
        </Row>
        
        <Form.Item 
        label="Remarks" 
        name="remarks"
        hasFeedback
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
        <Form.Item>
            <Space>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}
                    loading={loadingPostConsumables}
                    disabled={loadingPostConsumables}
                >
                    Post Consumables
                </Button>
                <Button color="danger" variant="outlined" icon={<CloseOutlined />} onClick={() => setIsConsumableFormVisible(false)}>
                    Cancel
                </Button>
            </Space>
            
        </Form.Item>
        </Form>
    </>
  )
}

export default ConsumablesFormData

// props validation
ConsumablesFormData.propTypes = {
    setIsConsumableFormVisible: PropTypes.bool.isRequired,
    setConsumablesFormData: PropTypes.array.isRequired,
};

  

                        
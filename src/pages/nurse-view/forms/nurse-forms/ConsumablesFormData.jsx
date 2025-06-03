import { Button, Col, Form, Input, message, Row, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useLocation } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  POST_PATIENT_CONSUMABLES_FAILURE,
  POST_PATIENT_CONSUMABLES_SUCCESS,
  postPatientConsumablesSlice,
} from "../../../../actions/nurse-actions/postPatientConsumablesSlice";
import { getPgOpenPatientConsumablesSlice } from "../../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";
import { useEffect } from "react";
import { getQyLocationsSlice } from "../../../../actions/nurse-actions/getQyLocationsSlice";
import { getItemsSlice } from "../../../../actions/triage-actions/getItemsSlice";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { POST_NURSE_ORDER_SHEET_FAILURE, POST_NURSE_ORDER_SHEET_SUCCESS, postNurseOrderSheetSlice } from "../../../../actions/nurse-actions/postNurseOrderSheet";
const ConsumablesFormData = ({ setIsConsumableFormVisible }) => {
  const [form] = Form.useForm();
  const { patientDetails } = useLocation().state;
  const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase();
  const userDetails = useAuth();
  const dispatch = useDispatch();
  const { loadingItems, items } = useSelector((state) => state.getItems);
  const { loadingQyLocations, qyLocations } = useSelector(
    (state) => state.getQyLocations
  );
  const { loadingPostConsumables } = useSelector(
    (state) => state.postPatientConsumables
  );
  const { loadingpostNurseOrderSheet } = useSelector(
    (state) => state.postNurseOrderSheet
  );
  
const handleOnFinish = async (values) => {
  try {
    const { location, quantity, item, remarks } = values;

    const consumableData = {
      myAction: "create",
      admissionNo: patientDetails?.Admission_No,
      recId: "",
      branchCode: location,
  prescriptionDose: parseInt(quantity, 10),
      drugNo: item,
      staffNo: userDetails.userData.no,
    };

    // Dispatch postPatientConsumablesSlice and wait for result
    const consumablesResult = await dispatch(
      postPatientConsumablesSlice("/Nurse/NurseOrderSheet", consumableData)
    );

    if (consumablesResult.type === POST_PATIENT_CONSUMABLES_SUCCESS) {
      message.success("Consumables posted successfully!");

      // Dispatch postNurseOrderSheetSlice and wait for result
      const orderSheetResult = await dispatch(
        postNurseOrderSheetSlice("/Nurse/SendOrderToPharmacy", {
          admissionNo: patientDetails?.Admission_No,
          branchCode: location,
          staffNo: userDetails.userData.no,
        })
      );

      if (orderSheetResult.type === POST_NURSE_ORDER_SHEET_SUCCESS) {
        message.success("Order sheet sent to pharmacy successfully!");
        dispatch(getPgOpenPatientConsumablesSlice());
        setIsConsumableFormVisible(false);
        form.resetFields();
      } else if (orderSheetResult.type === POST_NURSE_ORDER_SHEET_FAILURE) {
        message.error(
          orderSheetResult?.payload?.message ||
            "Failed to send order sheet to pharmacy."
        );
      }
    } else if (consumablesResult.type === POST_PATIENT_CONSUMABLES_FAILURE) {
      message.error(
        consumablesResult?.payload?.message ||
          "Internal server error, please try again later."
      );
    }
  } catch (error) {
    message.error(error.message || "An unexpected error occurred.");
  }
};


  useEffect(() => {
    if (!qyLocations?.length) {
      dispatch(getQyLocationsSlice());
    }
  }, [dispatch, qyLocations?.length]);

  useEffect(() => {
    if (!items?.length) {
      dispatch(getItemsSlice());
    }
  }, [dispatch, items?.length]);
  return (
    <>
      <Form
        layout="vertical"
        style={{ paddingTop: "10px" }}
        form={form}
        onFinish={handleOnFinish}
        initialValues={{
          location: undefined,
          quantity: "",
          remarks: "",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please select location!" }]}
              hasFeedback
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select Location"
                allowClear
                showSearch
                loading={loadingQyLocations}
                options={qyLocations?.map((item) => ({
                  key: item.AdmNo,
                  value: item.Code,
                  label: item.Name,
                }))}
                 size="large"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Item"
              name="item"
              rules={[{ required: true, message: "Please select item!" }]}
              hasFeedback
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select Item"
                allowClear
                showSearch
                loading={loadingItems}
                options={items?.map((item) => ({
                  key: item.No,
                  value: item.No,
                  label: item.Description,
                }))}
                 size="large"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: "Please enter quantity!" }]}
              hasFeedback
            >
              <Input type="number" size="large" placeholder="Enter Quantity" />
            </Form.Item>
          </Col>
        </Row>

        {/* <Form.Item
          label="Remarks"
          name="remarks"
          hasFeedback
          rules={[
            {
              validator: (_, value) => {
                if (value && value.length > 150) {
                  return Promise.reject(
                    new Error(
                      "Consumables Remarks cannot exceed 150 characters!"
                    )
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea
            placeholder="Enter consumables remarks"
            name="consumablesRemarks"
            rows={2}
          />
        </Form.Item> */}
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loadingPostConsumables}
              disabled={loadingPostConsumables}
            >
              Post Consumables
            </Button>
            <Button
              color="danger"
              variant="outlined"
              icon={<CloseOutlined />}
              onClick={() => setIsConsumableFormVisible(false)}
            >
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default ConsumablesFormData;

// props validation
ConsumablesFormData.propTypes = {
  setIsConsumableFormVisible: PropTypes.bool,
  setConsumablesFormData: PropTypes.array.isRequired,
};

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Select, Space } from "antd";

// import useAuth from "../../../../hooks/useAuth";
import {
  postNurseOrderSheetSlice,
  POST_NURSE_ORDER_SHEET_FAILURE,
  POST_NURSE_ORDER_SHEET_SUCCESS,
} from "../../../../actions/nurse-actions/postNurseOrderSheet";
import {
  postPatientConsumablesSlice,
  POST_PATIENT_CONSUMABLES_FAILURE,
  POST_PATIENT_CONSUMABLES_SUCCESS,
} from "../../../../actions/nurse-actions/postPatientConsumablesSlice";
import { getItemsSlice } from "../../../../actions/triage-actions/getItemsSlice";
import { getQyLocationsSlice } from "../../../../actions/nurse-actions/getQyLocationsSlice";
import { getPgOpenPatientConsumablesSlice } from "../../../../actions/nurse-actions/getPgOpenPatientConsumablesSlice";
import { frequencyOptions } from "../../../pharmacy-views/pharmacy-utils";
import { useAuth } from "../../../../hooks/auth";

const ConsumablesFormData = ({ setIsConsumableFormVisible }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const { patientDetails } = useLocation().state;
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
      const { location, quantity, item, remarks, prescriptionDosage } = values;

      const consumableData = {
        myAction: "create",
        admissionNo: patientDetails?.Admission_No,
        recId: "",
        branchCode: user?.branchCode,
        quantity: 0,
        prescriptionDose: prescriptionDosage || 0,
        drugNo: item,
        staffNo: user?.staffNo,
      };

      // Dispatch postPatientConsumablesSlice and wait for result
      const consumablesResult = await dispatch(
        postPatientConsumablesSlice("/Nurse/NurseOrderSheet", consumableData)
      );

      if (consumablesResult.type === POST_PATIENT_CONSUMABLES_SUCCESS) {
        message.success("Consumables posted successfully!");

        // Dispatch postNurseOrderSheetSlice and wait for result
        dispatch(getPgOpenPatientConsumablesSlice());
        setIsConsumableFormVisible(false);
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
              <Input
                type="number"
                size="large"
                placeholder="Enter Quantity"
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Prescription Dosage"
              name="prescriptionDosage"
              hasFeedback
            >
              <Select
                style={{ width: "100%" }}
                placeholder="Select Prescription Dosage"
                allowClear
                showSearch
                options={frequencyOptions?.map((item) => ({
                  key: item.value,
                  value: item.value,
                  label: item.label,
                }))}
                size="large"
              />
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
              Add Item
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

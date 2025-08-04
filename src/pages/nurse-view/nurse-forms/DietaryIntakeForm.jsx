import { Button, Form, message, Modal, Select } from "antd";
import {
  PlusOutlined,
  FolderViewOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import DietaryIntakeTable from "../tables/nurse-tables/DietaryIntakeTable";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getQyIpLookupValuesSlice } from "../../../actions/nurse-actions/getQyIPLookupValuesSlice";
import { getQyDietaryFormLinesSlice } from "../../../actions/nurse-actions/getQyIPDietaryFormLinesSlice";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import DietaryIntakeFormData from "./DietaryIntakeFormData";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
// import useAuth from "../../../hooks/useAuth";
import {
  POST_DIETARY_INTAKE_FORM_LINE_FAILURE,
  POST_DIETARY_INTAKE_FORM_LINE_SUCCESS,
  postDietaryIntakeFormLineSlice,
} from "../../../actions/nurse-actions/postDietaryIntakeFormLineSlice";
import { useAbility } from "../../../hooks/casl";

const DietaryIntakeForm = () => {
  const ability = useAbility();
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const canCreateDietaryIntake = ability.can("create", "dietaryIntake");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { selectedRowKey, rowSelection, selectedRow } =
    useSetTableCheckBoxHook();

  const { patientDetails } = useLocation().state;
  const { loadingIpLookupValues, ipLookupValues } = useSelector(
    (state) => state.getQyIpLookupValues
  );
  const { loadingGetIpDietaryForm, ipGetDietaryForm } = useSelector(
    (state) => state.getQyDietaryFormLine
  );
  const { loadingDietaryIntake } = useSelector(
    (state) => state.postDietaryIntakeFormLine
  );

  console.log("Lookup values", ipLookupValues[0]?.Description);

  const handleViewForm = () => {
    if (selectedRow[0]) {
      form.resetFields();
      form.setFieldsValue({
        category: selectedRow[0]?.Category || "",
        comments: selectedRow[0]?.Comment || "",
      });
      setIsModalOpen(true);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleUpdate = async () => {
    const values = await form.validateFields();
    const LineNo = selectedRow[0]?.LineNo;
    const formattedData = {
      ...values,
      LineNo,
      myAction: "edit",
    };
    await dispatch(postDietaryIntakeFormLineSlice(formattedData))
      .then((result) => {
        if (result.type === POST_DIETARY_INTAKE_FORM_LINE_SUCCESS) {
          message.success(`Records updated successfully!`);
          dispatch(getQyDietaryFormLinesSlice(patientDetails?.Admission_No));
          setIsModalOpen(false);
        } else if (result.type === POST_DIETARY_INTAKE_FORM_LINE_FAILURE) {
          message.error(
            result.payload.message || "Internal server error, please try again."
          );
          setIsModalOpen(false);
        }
      })
      .then(() => {
        form.resetFields();
      })
      .catch((err) => {
        message.error(
          err.message || "Internal server error, please try again later."
        );
      });
  };

  useEffect(() => {
    dispatch(getQyDietaryFormLinesSlice(patientDetails?.Admission_No));
    dispatch(getQyIpLookupValuesSlice("Dietary Intake Form"));
  }, [dispatch, patientDetails?.Admission_No]);

  return (
    <div>
      <NurseInnerHeader icon={<FileOutlined />} title="Dietary Intake Form" />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          paddingBottom: "20px",
        }}
      >
        {!isFormVisible &&
          (canCreateDietaryIntake ? (
            <>
              <Button type="primary" onClick={handleButtonVisibility}>
                <PlusOutlined /> New Dietary Form
              </Button>
              <Button
                type="primary"
                disabled={!selectedRowKey}
                onClick={handleViewForm}
              >
                <FolderViewOutlined />
                View Form
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              style={{ width: "100%" }}
              disabled={!selectedRowKey}
              onClick={handleViewForm}
            >
              <FolderViewOutlined />
              View Form
            </Button>
          ))}
      </div>

      {isFormVisible && (
        <DietaryIntakeFormData
          filterIpLookupValues={ipLookupValues}
          form={form}
          patientDetails={patientDetails}
          setIsFormVisible={setIsFormVisible}
          loadingDietaryIntake={loadingDietaryIntake}
          loadingIpLookupValues={loadingIpLookupValues}
        />
      )}

      {!isFormVisible && (
        <DietaryIntakeTable
          filterDietaryIntakeForm={ipGetDietaryForm}
          loadingGetIpDietaryForm={loadingGetIpDietaryForm}
          rowSelection={rowSelection}
        />
      )}

      <Modal
        title="Dietary Intake Form"
        open={isModalOpen}
        footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          style={{ paddingTop: "10px" }}
          form={form}
          initialValues={{
            category: "",
            comments: "",
          }}
        >
          <Form.Item label="Category" name="category">
            <Select
              placeholder="Select a category"
              showSearch
              loading={loadingIpLookupValues}
              options={ipLookupValues?.map((item) => ({
                value: item?.Category,
                label: item?.Description,
              }))}
              allowClear
            />
          </Form.Item>

          <Form.Item label="Comments" name="comments">
            <TextArea placeholder="Comments" type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DietaryIntakeForm;

import { Button, Form, message, Modal, Select } from "antd";
import {
  PlusOutlined,
  FolderViewOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import MentalStatusExaminationTable from "../tables/nurse-tables/MentalStatusExaminationTable";
import { useDispatch, useSelector } from "react-redux";
import { getMentalExaminationFormSlice } from "../../../actions/nurse-actions/getMentalExaminationFormSlice";
import { useLocation } from "react-router-dom";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import MseStatusFormData from "./MseStatusFormData";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
// import useAuth from "../../../hooks/useAuth";
import {
  POST_MENTAL_EXAMINATION_FORM_FAILURE,
  POST_MENTAL_EXAMINATION_FORM_SUCCESS,
  postMentalExaminationFormSlice,
} from "../../../actions/nurse-actions/postMentalExaminationFormSlice";

const MentalStateExaminationForm = () => {
  const role = null.userData.departmentName;
  const { patientDetails } = useLocation().state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { selectedRowKey, rowSelection, selectedRow } =
    useSetTableCheckBoxHook();

  const { loadingIpGetMentalStatusForm, ipGetMentalStatusForm } = useSelector(
    (state) => state.getMentalStatusExaminationForm
  );
  const { loadingMentalStatus } = useSelector(
    (state) => state.postMentalStatusExaminationForm
  );

  const dispatch = useDispatch();

  const handleViewMSEForm = () => {
    if (selectedRow[0]) {
      form.resetFields();
      form.setFieldsValue({
        status: selectedRow[0]?.Status,
        comments: selectedRow[0]?.Comments,
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
    await dispatch(
      postMentalExaminationFormSlice(
        "/InpatientForms/MentalStatusCheckForm",
        formattedData
      )
    )
      .then((result) => {
        if (result.type === POST_MENTAL_EXAMINATION_FORM_SUCCESS) {
          message.success(
            `Mental state examination form updated successfully!`
          );
          dispatch(getMentalExaminationFormSlice(patientDetails?.Admission_No));
          setIsModalOpen(false);
        } else if (result.type === POST_MENTAL_EXAMINATION_FORM_FAILURE) {
          message.error(
            result.payload.message ||
              "Internal server error, please try again later."
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
    dispatch(getMentalExaminationFormSlice(patientDetails?.Admission_No));
  }, [dispatch, patientDetails?.Admission_No]);

  return (
    <div>
      <NurseInnerHeader
        icon={<FileOutlined />}
        title="Mental Status Level Checklist"
      />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isFormVisible &&
          (role === "Nurse" ? (
            <>
              <Button type="primary" onClick={handleButtonVisibility}>
                <PlusOutlined /> New MSE Level Checklist
              </Button>
              <Button
                type="primary"
                disabled={!selectedRowKey}
                onClick={handleViewMSEForm}
              >
                <FolderViewOutlined />
                View MSE Level Checklist
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              disabled={!selectedRowKey}
              onClick={handleViewMSEForm}
            >
              <FolderViewOutlined />
              View MSE Level Checklist
            </Button>
          ))}
      </div>

      {isFormVisible && (
        <MseStatusFormData
          patientDetails={patientDetails}
          form={form}
          setIsFormVisible={setIsFormVisible}
          loadingMentalStatus={loadingMentalStatus}
        />
      )}

      {!isFormVisible && (
        <MentalStatusExaminationTable
          rowSelection={rowSelection}
          loadingIpGetMentalStatusForm={loadingIpGetMentalStatusForm}
          filterMSEFormData={ipGetMentalStatusForm}
          patientDetails={patientDetails}
        />
      )}

      <Modal
        title="Mental Status Level Checklist"
        open={isModalOpen}
        footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleUpdate}
            loading={loadingMentalStatus}
            disabled={loadingMentalStatus}
          >
            Update
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          style={{ paddingTop: "10px" }}
          form={form}
          initialValues={{
            date: "",
            status: "",
            comments: "",
          }}
        >
          <Form.Item
            label="Status"
            name="status"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please select status!",
              },
            ]}
          >
            <Select
            placeholder="Select status"
              options={[
                { value: "0", label: "Severe" },
                { value: "1", label: "Moderate" },
                { value: "2", label: "Mild" },
                { value: "3", label: "Normal" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Comments"
            name="comments"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input comments!",
              },
            ]}
          >
            <TextArea placeholder="Comments" type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MentalStateExaminationForm;

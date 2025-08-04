import { Button, Form, Input, Modal } from "antd";
import {
  PlusOutlined,
  FolderViewOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import SuicidalFormTable from "../tables/nurse-tables/SuicidalFormTable";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSuicidalFormSlice } from "../../../actions/nurse-actions/getSuicidalFormSlice";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import SuicidalFormData from "../forms/nurse-forms/SuicidalFormData";
import { useAbility } from "../../../hooks/casl";
import { useAuth } from "../../../hooks/auth";
// import useAuth from '../../../hooks/useAuth';

const SuicidalForm = () => {
  const ability = useAbility();

  const canCreateSuicidalForm = ability.can("create", "suicidalForm");
  const { selectedRowKey, rowSelection, selectedRow } =
    useSetTableCheckBoxHook();
  const { patientDetails } = useLocation().state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { ipSuicidalForm, loadingIpSuicidalForm } = useSelector(
    (state) => state.getIpSuicidalForm
  );
  const { loadingSuicidalForm } = useSelector(
    (state) => state.postSuicidalForm
  );
  const [isFormVisible, setIsFormVisible] = useState(false);

  const userInfo = useAuth();
  const staffNo = userInfo?.staffNo;

  let formattedSffNo =
    staffNo.charAt(0).toUpperCase() + staffNo.slice(1).toLowerCase();

  const dispatch = useDispatch();

  const showModal = (record) => {
    form.resetFields();
    if (record) {
      form.setFieldsValue({
        handingOver: record?.HandingOver || "",
        remarks: record?.Remarks || "",
      });
    }
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleViewForm = () => {
    if (selectedRow[0]) {
      form.resetFields();
      form.setFieldsValue({
        handingOver: selectedRow[0]?.HandingOver || "",
        takingOver: selectedRow[0]?.TakingOver || "",
        remarks: selectedRow[0]?.Remarks || "",
      });
      setIsModalOpen(true);
    }
  };

  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    dispatch(getSuicidalFormSlice(patientDetails?.Admission_No));
  }, [dispatch, patientDetails?.Admission_No]);

  return (
    <div>
      <NurseInnerHeader
        icon={<FileOutlined />}
        title="Suicidal Precaution Form"
      />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isFormVisible &&
          (canCreateSuicidalForm ? (
            <>
              <Button type="primary" onClick={handleButtonVisibility}>
                <PlusOutlined /> New Suicidal Precaution Form
              </Button>
              <Button
                type="primary"
                disabled={!selectedRowKey}
                onClick={handleViewForm}
              >
                <FolderViewOutlined />
                View Data
              </Button>
            </>
          ) : (
            <>
              <Button type="primary" onClick={handleButtonVisibility}>
                <PlusOutlined /> New Suicidal Precaution Form
              </Button>
              <Button
                type="primary"
                disabled={!selectedRowKey}
                onClick={handleViewForm}
              >
                <FolderViewOutlined />
                View Data
              </Button>
            </>
          ))}
      </div>

      {isFormVisible && (
        <SuicidalFormData
          setIsFormVisible={setIsFormVisible}
          patientDetails={patientDetails}
          loadingSuicidalForm={loadingSuicidalForm}
          formattedSffNo={formattedSffNo}
          form={form}
        />
      )}

      {!isFormVisible && (
        <SuicidalFormTable
          rowSelection={rowSelection}
          showModal={showModal}
          ipSuicidalForm={ipSuicidalForm}
          loadingIpSuicidalForm={loadingIpSuicidalForm}
        />
      )}

      <Modal
        title="Suicidal Precaution Form"
        open={isModalOpen}
        footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          style={{ paddingTop: "10px" }}
          form={form}
          initialValues={{
            date: "",
            time: "",
            handingOver: "",
            takingOver: formattedSffNo,
            remarks: "",
          }}
        >
          <Form.Item label="Handing Over" name="handingOver">
            <Input placeholder="Handing Over Nurse" type="text" />
          </Form.Item>

          <Form.Item label="Taking Over" name="takingOver">
            <Input placeholder="Taking Over Nurse" type="text" />
          </Form.Item>
          <Form.Item label="Remarks" name="remarks">
            <TextArea placeholder="Remarks" type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SuicidalForm;

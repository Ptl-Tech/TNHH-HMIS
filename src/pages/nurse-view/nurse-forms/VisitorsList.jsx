import { Button, Form, Input, message, Modal } from "antd";
import {
  PlusOutlined,
  FileOutlined,
  FolderViewOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import VisitorFormTable from "../tables/nurse-tables/VisitorFormTable";
import { useDispatch, useSelector } from "react-redux";
import { getVisitorsListSlice } from "../../../actions/nurse-actions/getVisitorsListSlice";
import NurseInnerHeader from "../../../partials/nurse-partials/NurseInnerHeader";
import useSetTableCheckBoxHook from "../../../hooks/useSetTableCheckBoxHook";
import VisitorsListFormData from "../forms/nurse-forms/VisitorsListFormData";
import { useLocation } from "react-router-dom";
// import useAuth from "../../../hooks/useAuth";
import {
  POST_VISITOR_LIST_FAILURE,
  POST_VISITOR_LIST_SUCCESS,
  postVisitorListSlice,
} from "../../../actions/nurse-actions/postVisitorListSlice";
import { useAbility } from "../../../hooks/casl";

const VisitorsList = () => {
  const ability = useAbility();

  const canCreatePatienVisitor = ability.can("create", "patientVisitor");

  const { patientDetails } = useLocation().state;
  const { selectedRowKey, rowSelection, selectedRow } =
    useSetTableCheckBoxHook();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isFormVisible, setIsFormVisible] = useState(false);

  const { loadingIpVisitors, ipVisitors } = useSelector(
    (state) => state.getIPVisitors
  );
  const { loadingVisitor } = useSelector((state) => state.postVisitorList);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleViewVisitor = () => {
    if (selectedRow[0]) {
      form.resetFields();
      form.setFieldsValue({
        visitorName: selectedRow[0]?.VisitorName || "",
        idNumber: selectedRow[0]?.IdNumber || "",
        phoneNumber: selectedRow[0]?.PhoneNumber || "",
      });
      setIsModalOpen(true);
    }
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
      postVisitorListSlice("/InpatientForms/VisitorsListForm", formattedData)
    )
      .then((result) => {
        if (result.type === POST_VISITOR_LIST_SUCCESS) {
          message.success(`Records updated successfully!`);
          dispatch(getVisitorsListSlice(patientDetails?.Admission_No));
          setIsModalOpen(false);
        } else if (result.type === POST_VISITOR_LIST_FAILURE) {
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

  const handleButtonVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  useEffect(() => {
    dispatch(getVisitorsListSlice(patientDetails?.Admission_No));
  }, [dispatch, patientDetails?.Admission_No]);

  return (
    <div>
      <NurseInnerHeader icon={<FileOutlined />} title="Visitors List" />

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {!isFormVisible &&
          (canCreatePatienVisitor ? (
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleButtonVisibility}
              >
                {" "}
                New Visitor
              </Button>
              <Button
                type="primary"
                disabled={!selectedRowKey}
                onClick={handleViewVisitor}
              >
                <FolderViewOutlined />
                View Visitor Details
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              style={{ width: "100%" }}
              disabled={!selectedRowKey}
              onClick={handleViewVisitor}
            >
              <FolderViewOutlined />
              View Visitor Details
            </Button>
          ))}
      </div>

      {isFormVisible && (
        <VisitorsListFormData
          setIsFormVisible={setIsFormVisible}
          loadingIpVisitors={loadingIpVisitors}
          loadingVisitor={loadingVisitor}
          patientDetails={patientDetails}
        />
      )}

      {!isFormVisible && (
        <VisitorFormTable
          rowSelection={rowSelection}
          loadingIpVisitors={loadingIpVisitors}
          filterVisitorList={ipVisitors}
        />
      )}

      <Modal
        title="View Visitor Details"
        open={isModalOpen}
        footer={[
          <Button key="cancel" color="danger" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={handleUpdate}
            loading={loadingVisitor}
            disabled={loadingVisitor}
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
            visitorName: "",
            idNumber: "",
            phoneNumber: "",
          }}
        >
          <Form.Item label="Visitor Name" name="visitorName">
            <Input placeholder="Visitor Name" type="text" />
          </Form.Item>

          <Form.Item label="ID Number" name="idNumber">
            <Input placeholder="ID Number" type="text" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            placeholder="e.g 0712345678"
          >
            <Input placeholder="Phone Number" type="text" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorsList;

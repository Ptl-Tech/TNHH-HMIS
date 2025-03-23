import React from "react";
import { Modal , Typography} from "antd";

export const ClearVisitorModal = ({ modalVisible, setModalVisible, confirmClearVisitor, clearVisitorLoading, visitor, errorMessage }) => {
  return (
    <Modal
      title="Confirm Visitor Clearance"
      visible={modalVisible}
      onOk={confirmClearVisitor}
      onCancel={() => setModalVisible(false)}
      okText="Yes, Clear"
      cancelText="Cancel"
      confirmLoading={clearVisitorLoading}
    >
      <p>Are you sure you want to clear visitor <strong>{visitor?.VisitorName}</strong>?</p>
      {errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}
    </Modal>
  );
};

export const AdmitVisitModal = ({ visible, visitor, onClose, confirmAdmitVisitor, admitVisitorLoading, errorMessage }) => {
  return (
    <Modal
      title="Admit Visitor"
      visible={visible}
      onOk={confirmAdmitVisitor}
      onCancel={onClose}
      okText="Yes, Check In"
      cancelText="Cancel"
      confirmLoading={admitVisitorLoading}
    >
      <p>Are you sure you want to admit visitor <strong>{visitor?.VisitorName}</strong>?</p>
      {errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}
    </Modal>
  );
};
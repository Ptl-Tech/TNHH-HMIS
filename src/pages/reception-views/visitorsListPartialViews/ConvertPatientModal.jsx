import { Modal, Typography } from "antd";

// Modal Component
export const ConvertPatientModal = ({ modalVisible, setModalVisible, confirmClearVisitor, clearVisitorLoading, visitor, errorMessage }) => {
    return (
      <Modal
        title="Convert Visitor to Patient"
        open={modalVisible} // Fix: use 'open' instead of 'visible'
        onOk={confirmClearVisitor}
        onCancel={() => setModalVisible(false)}
        okText="Yes, Convert"
        cancelText="Cancel"
        confirmLoading={clearVisitorLoading}
      >
        <p>
          Are you sure you want to convert visitor <strong>{visitor?.VisitorName}</strong> to a patient?
        </p>
        {errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}
      </Modal>
    );
  };
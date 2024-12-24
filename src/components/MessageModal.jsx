import React from "react";
import { Modal } from "antd";

const ModalComponent = ({ type, title, content, visible, onOk }) => {
  if (!visible) return null;

  const modalConfig = {
    success: Modal.success,
    error: Modal.error,
    warning: Modal.warning,
    info: Modal.info,
  };

  const ModalType = modalConfig[type];

  return (
    ModalType && ModalType({
      title,
      content,
      onOk,
    })
  );
};

export default ModalComponent;

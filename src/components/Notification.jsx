import { notification } from "antd";

const showNotification = (type, message, description, placement, duration) => {
    notification[type]({
      key: "updatable",
      //destroyOnClose

      message,
      description,
      placement,
      duration,
    });
  };

  export { showNotification };
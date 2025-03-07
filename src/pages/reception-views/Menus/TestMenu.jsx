import { createContext } from "react";

import { Dropdown, Modal } from "antd";
import { AiOutlineMore } from "react-icons/ai";

const TestMenu = ({ record, handleEditRequest, handleForwardRequest }) => {
  const [modal, contextHolder] = Modal.useModal();
  const ReachableContext = createContext(null);

  const config = {
    title: 'Forward Request',
    content: (
      <>
        <p>
          Are you sure you want to forward this request? You will not be able to
          make further changes on it
        </p>
      </>
    ),
  };

  const items = [
    {
      key: '1',
      label: <div onClick={() => handleEditRequest(record)}>Edit Request</div>,
    },
    {
      key: '2',
      label: (
        <ReachableContext.Provider value="Light">
          <div
            onClick={async () => {
              const confirmed = await modal.confirm(config);
              if (confirmed) {
                handleForwardRequest(record);
              }
            }}
          >
            Forward Request
          </div>
          {contextHolder}
        </ReachableContext.Provider>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{ items }}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <AiOutlineMore size={28} />
    </Dropdown>
  );
};

export default TestMenu;
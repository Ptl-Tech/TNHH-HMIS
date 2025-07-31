import { useDispatch, useSelector } from "react-redux";

import { MdLogout } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { GiRamProfile } from "react-icons/gi";
import { Menu, Dropdown, Avatar, Space } from "antd";

import { logout } from "../actions/auth-actions/logout";

const Signout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleSignOut = () => {
    dispatch(logout());
  };

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "signout":
        handleSignOut();
        break;
      default:
        break;
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="view-profile" icon={<GiRamProfile />}>
        View Profile
      </Menu.Item>
      <Menu.Item key="signout" icon={<MdLogout />} danger>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  const getSalutation = () => {
    // Ensure userDetails is available before accessing properties
    if (user && user.staffName) {
      return `Hi ${user.staffName}`;
    }
    return "Hi there"; // Default greeting if userDetails is not available
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "row-reverse",
        gap: "20px",
      }}
    >
      <Dropdown overlay={menu}>
        <div className="">
          <Avatar
            icon={<FaUserAlt />}
            style={{ fontSize: "30px", color: "#fff", marginRight: "10px" }}
          />
        </div>
      </Dropdown>
      <Space style={{ display: "flex" }}>
        <span
          className="text-white"
          style={{
            border: "1px solid #ac8342",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          {user?.branchCode &&
            `Branch : ${
              user?.branchCode.charAt(0).toUpperCase() +
              user?.branchCode.slice(1)
            }`}
        </span>

        <span
          className="text-white"
          style={{
            border: "1px solid #ac8342",
            padding: "5px",
            borderRadius: "5px",
          }}
        >
          {getSalutation() + "👋"}
        </span>
      </Space>
    </div>
  );
};

export default Signout;

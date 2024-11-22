import { Button } from 'antd'
import { Header } from 'antd/es/layout/layout'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import logo from "../../assets/images/logo.png";
import smallLogo from "../../assets/images/smallLogo.png";
import PropTypes from 'prop-types';
import Signout from '../../Auth/Signout';

const NurseHeader = ({ collapsed, setCollapsed }) => {

  return (
    
    <Header className="headerstyle">
        <div className="d-flex justify-content-center pt-2">
          <div className="demo-logo-vertical">
            {collapsed ? (
              <img
                src={smallLogo}
                height={70}
                className="mb-3 pt-1"
                alt="Logo"
              />
            ) : (
              <img src={logo} height={70} className="mb-3 pt-1" alt="Logo" />
            )}
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "22px",
              width: 64,
              height: 64,
              color: "#fff",
            }}
          />
        </div>
        {/* <Signout /> */}
      </Header>

  )
}

export default NurseHeader

//propType validation
NurseHeader.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
};
import { useState } from "react";
import { Outlet, useLocation} from "react-router-dom";
import { Layout, theme, Breadcrumb } from "antd";
import NurseFooter from "../partials/nurse-partials/NurseFooter";
import NurseSideMenu from "../partials/nurse-partials/NurseSideMenu";
import NurseHeader from "../partials/nurse-partials/NurseHeader";

const { Content } = Layout;
const NurseLayout = () => {
  const location = useLocation();

  // Extract the current route name from the location pathname
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["/"]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      
      <NurseHeader collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout hasSider>
        
        <NurseSideMenu collapsed={collapsed} setCollapsed={setCollapsed} openKeys={openKeys} setOpenKeys={setOpenKeys}/>

       <Layout className="site-layout">
       <div className="site-layout">
          <Breadcrumb
            style={{
              marginLeft: collapsed ? 80 : 230,
              transition: "all 0.2s",
              padding: 12,
              color: "#67336d",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            {pathSegments.map((segment, index) => (
              <Breadcrumb.Item key={index}>
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Content
            className="contentStyle"
            style={{
              marginLeft: collapsed ? 80 : 230,

              transition: "all 0.2s",
              padding: 12,
              minHeight: 680,
              background: colorBgContainer,
              borderRadius: 8,
            }}
          >
            <Outlet />

          </Content>
        </div>
        </Layout>
      </Layout>

      <NurseFooter/>
    </Layout>
  );
};

export default NurseLayout;

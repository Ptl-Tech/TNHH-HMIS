import { useState } from "react";
import { Outlet, useLocation} from "react-router-dom";
import { Layout } from "antd";
import NurseFooter from "../partials/nurse-partials/NurseFooter";
import NurseSideMenu from "../partials/nurse-partials/NurseSideMenu";
import NurseHeader from "../partials/nurse-partials/NurseHeader";
import NurseBreadcrumb from "../partials/nurse-partials/NurseBreadcrumb";

const { Content } = Layout;
const NurseLayout = () => {
  const location = useLocation();

  // Extract the current route name from the location pathname
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState(["/"]);


  return (
    <Layout>
      
      <NurseHeader collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout hasSider>
        
        <NurseSideMenu collapsed={collapsed} setCollapsed={setCollapsed} openKeys={openKeys} setOpenKeys={setOpenKeys}/>

       <Layout className="site-layout">
     
          
          <Content
            className="contentStyle"
            style={{
              marginLeft: collapsed ? 80 : 230,
              transition: "all 0.2s",
              padding: '20px 15px 10px 10px',
            }}
          >
            <NurseBreadcrumb pathSegments={pathSegments} />

            <Outlet />

          </Content>
     
        </Layout>
      </Layout>

      <NurseFooter/>
    </Layout>
  );
};

export default NurseLayout;

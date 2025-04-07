
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom'; // Assuming React Router is used
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { HomeOutlined } from '@ant-design/icons';

const DynamicBreadcrumb = ({ collapsed }) => {

  const verifyOtpHandler = useSelector((state) => state.otpVerify);
  const { verifyOtpUserInfo } = verifyOtpHandler;

  const location = useLocation();
  const role = verifyOtpUserInfo?.userData.departmentName;
  const userRole = role;

  // Define dynamic dashboard URLs based on roles
  const dashboardUrls = {
    Nurse: "/Nurse",
    Reception: "",
    Doctor: "/Doctor",
    Security: "/Security",
    //add more roles here    
  };
  // Determine the dashboard URL for the current user role
  const dashboardUrl = dashboardUrls[userRole] || "/"; // Fallback to '/' if role not found

  // Split the path into segments, skipping the leading slash
  const pathSegments = location.pathname.split('/').filter((segment) => segment);

  return (
    <Breadcrumb
      style={{
        marginLeft: collapsed ? 80 : 230,
        transition: "all 0.2s",
        padding: '10px 20px',
        fontWeight: "bold",
      }}
    >
      {/* Add Dashboard as a dynamic item */}
      <Breadcrumb.Item>
        <Link to={dashboardUrl} style={{ textDecoration: 'none', color: '#0f5689', backgroundColor: '#e5e3e3' }}><HomeOutlined /> Dashboard</Link>
      </Breadcrumb.Item>

      {/* Map path segments to breadcrumb items */}
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <Breadcrumb.Item key={path}>
            {/* Show a link if not the last segment */}
            {!isLast ? <Link to={path} style={{ textDecoration: 'none', color: '#0f5689', backgroundColor: '#e5e3e3' }}>{segment}</Link> : segment}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;

// propTypes validation

DynamicBreadcrumb.propTypes = {
  collapsed: PropTypes.bool.isRequired,
};

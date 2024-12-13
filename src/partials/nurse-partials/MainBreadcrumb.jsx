import { Breadcrumb, Space } from 'antd'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';


const MainBreadcrumb = ({ pathSegments }) => {
  return (
    
        <Breadcrumb
        style={{
            transition: "all 0.2s",
            padding: 12,
            color: "#67336d",
            fontWeight: "bold",
        }}
        >
        <Breadcrumb.Item>
        <Link to="/Nurse/Dashboard" style={{ color: "#67336d", textDecoration: "none" }}>
            <Space>
                <HomeOutlined />
                Home
            </Space>
        </Link>
        
        </Breadcrumb.Item>
        {pathSegments.map((segment, index) => (
            <Breadcrumb.Item key={index}>
            {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Breadcrumb.Item>
        ))}
        </Breadcrumb>
        
  )
}

export default MainBreadcrumb

//propType validation
MainBreadcrumb.propTypes = {
    pathSegments: PropTypes.array.isRequired,
};
import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { FaUserAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';
import useAuth from '../hooks/useAuth';
import { MdLogout } from 'react-icons/md';
import { GiRamProfile } from 'react-icons/gi';

const Signout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useAuth();  // Use the custom hook to get user info
  console.log("User details:", userDetails);
  const branchCode = localStorage.getItem("branchCode"); // Fetch branch code from localStorage

  const handleMenuClick = (e) => {
    if (e.key === 'signout' ) {
      dispatch(logout()); // Dispatch logout action
      navigate('/login'); // Navigate to login page
    } else if (e.key === 'view-profile' && userDetails) {
      navigate('/reception/view-profile');
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="view-profile" icon={<GiRamProfile />} >
        View Profile
      </Menu.Item>
      <Menu.Item key="signout" icon={<MdLogout />} danger>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  const getSalutation = () => {
    // Ensure userDetails is available before accessing properties
    if (userDetails && userDetails.userData.firstName) {
      console.log("User details:", userDetails.userData);
      return `Hi ${userDetails.userData.firstName}`;
    }
    return 'Hi there'; // Default greeting if userDetails is not available
  };

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div className="d-flex justify-content-end align-items-center py-3">
        <Avatar
          icon={<FaUserAlt />}
          style={{
            fontSize: '24px', // Adjust font size for the icon
            color: '#fff', // White color for the icon
            backgroundColor: '#67336d', // Dark background color for visibility
            marginRight: '10px', // Spacing between avatar and text
            borderRadius: '50%', // Ensures it's round
            width: '40px', // Set a fixed width and height for consistency
            height: '40px',
          }}
        />
        <div className="d-block">
          <h6 className="text-white">{branchCode && `Branch: ${branchCode}`}</h6>
          <h6 className="text-white">{getSalutation()}</h6>
        </div>
      </div>
    </Dropdown>
  );
};

export default Signout;

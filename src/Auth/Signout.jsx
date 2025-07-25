
import { Menu, Dropdown, Avatar, Space } from 'antd';
import { FaUserAlt } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';
import useAuth from '../hooks/useAuth';
import { MdLogout } from 'react-icons/md';
import { GiRamProfile } from 'react-icons/gi';
import { BsEmojiSmile } from 'react-icons/bs';

const Signout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useAuth();  // Use the custom hook to get user info
  const branchCode = localStorage.getItem("branchCode").toLocaleLowerCase(); // Fetch branch code from localStorage

  const handleMenuClick = (e) => {
    if (e.key === 'signout' ) {
      dispatch(logout()); // Dispatch logout action
      navigate('/login'); // Navigate to login page
    };
  };

  const menu = (
    <Menu onClick={handleMenuClick} >
      
      <Menu.Item key="signout" icon={<MdLogout />} danger>
        Sign Out
      </Menu.Item>
    </Menu>
  );

  const getSalutation = () => {
    // Ensure userDetails is available before accessing properties
    if (userDetails && userDetails.userData.firstName) {
      return `Hi ${userDetails.userData.firstName}`;
    }
    return 'Hi there'; // Default greeting if userDetails is not available
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', gap: '20px' }}>
      <Dropdown overlay={menu}>
        <div className="">
          <Avatar icon={<FaUserAlt />} style={{ fontSize: '30px', color: '#fff', marginRight: '10px' }} />
        </div>
      </Dropdown>
      <Space style={{ display: 'flex' }}>
          <span className="text-white" style={{ border : '1px solid #ac8342', padding: '5px', borderRadius: '5px' }}>
            {branchCode && `Branch : ${branchCode.charAt(0).toUpperCase() + branchCode.slice(1)}` }
            
          </span>

          <span className="text-white" style={{ border : '1px solid #ac8342', padding: '5px', borderRadius: '5px' }}>
            {
            getSalutation() + '👋' 
            }
          </span>

      </Space>
    </div>   
  );
};

export default Signout;

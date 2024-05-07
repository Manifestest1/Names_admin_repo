import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { cilAccountLogout } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import mypic from './../../assets/images/avatars/mypic.png';

const AppHeaderDropdown = () => {
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error("Token not found");
      navigate("/login");
      return;
    }
  
    let headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    axios.post('http://localhost:8000/api/auth/logout', null, { headers })
      .then((r) => {
        localStorage.removeItem('_token');
        setLogoutSuccess(true);
        navigate("/login");
      })
      .catch((error) => {
        console.error('Error during logout:', error);
        // Handle specific errors (e.g., 401) here
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('_token');
    if (!token) {
      console.error("Token not found");
      navigate("/login");
    }
  }, []);
  

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={mypic} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <div className="bg-body-secondary fw-semibold my-2">
          <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Log out
          </CDropdownItem>
        </div>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;

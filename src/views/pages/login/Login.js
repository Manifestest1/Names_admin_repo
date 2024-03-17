import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import axios from 'axios';
import { Navigate, Route, Routes } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    console.log(email, password, 'data');
    const headers = { 'Content-Type': 'application/json' };
    axios
      .post('http://localhost:8000/api/auth/login', { email, password, headers })
      .then(response => {
        console.log(response, 'api data');
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      })
      .catch(error => {
        console.error('Error during login:', error);
        setError('An unexpected error occurred');
      });
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p className="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      {/* Replace '/dashboard' with the actual route of your dashboard */}
                      <Link to="/dashboard">
                        <CButton color="info" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </Link>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;

import React from 'react';
import { useNavigate } from 'react-router-dom';

import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
    const navigate = useNavigate()
  return (
    <div className="unauthorized-page">
      <h1 className='display-status'>Unauthorized Access</h1>
      <p className='prompt-text'>You are not authorized to access this page. Please log in to continue.</p>
      <button className='go-back-btn' onClick={()=>navigate("/")}>Go Back</button>
    </div>
  );
};

export default UnauthorizedPage;
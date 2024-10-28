import React from 'react'
import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/AdminHomeStyle.css'; // Import the CSS file
import AdminNavBar from './AdminNavBar';

function MemberDetail() {

    const gradientStyle = {
        background: 'linear-gradient(180deg, rgba(67, 179, 174, 1) 0%, rgba(67, 179, 174, 0.76) 21%, rgba(245, 245, 220, 0.48) 76%, rgba(255, 255, 255, 0) 100%)',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
      };
      
  return (
    <div className='adminhome-page'>
        <AdminNavBar/>
        <div className='adminhome-content'>
        <div className='adminhome-container' style={gradientStyle}>
          <div className="card-container">
                <div className="card">
                    <img src="6111095.jpg" alt="สมาชิก" />
                    <h2>ข้อมูลสมาชิกในระบบ</h2>
                    </div>
                </div>
            </div>
          </div>
    </div>
  )
}

export default MemberDetail
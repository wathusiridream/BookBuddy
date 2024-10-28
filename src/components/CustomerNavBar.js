import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/AdminHomeStyle.css'; 


export default function CustomerNavBar() {
  return (
    <div className='home-page'>
    <header>
      <nav className='home-nav'>
        <div className='logo'>
          <a href='#' onClick={() => window.location.reload()}>
            <img src={require('../WebStyle/logobook.png')} alt="Logo" />
          </a>
        </div>
        <div className='links'>
          <ul>
            <li><a href='#' className='active'>หน้าหลัก</a></li>
            <li><a href='#' onClick={handleSeeAllBooks}>หนังสือทั้งหมด</a></li>
            <li><a href='#' onClick={handleRental}>ปล่อยเช่า</a></li>
            <li><a href='#'>เกี่ยวกับเรา</a></li>
          </ul>
        </div>
        <div className='search-bar'>
          <input
            type='text'
            placeholder='Search for books...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IonIcon
            icon={searchCircleOutline}
            onClick={handleSearch}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
              fontSize: '24px'
            }}
          />
        </div>
        <div className='login-sec'>
          {user ? (
            <div className='user-info'>
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="User Profile"
                  onClick={handleProfileEdit}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <h1>{user.displayName || user.email}</h1>
              <button onClick={handleLogout} className='home-button'>Log Out</button>
            </div>
          ) : (
            <button onClick={() => navigate('/')} className='home-button'>Login</button>
          )}
        </div>
      </nav>
      </header>
    </div>
  )
}

import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/AdminHomeStyle.css'; 

export default function AdminNavBar() {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/'); // Redirect to SignIn if not logged in
      }
    }, [navigate]);
  
    const handleLogout = async () => {
      try {
        await signOut(getAuth());
        navigate('/'); // Redirect to SignIn page
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };


  return (
    <div className='adminhome-page'>      
        <header>
            <nav className='adminhome-nav'>
            <div className='logo'>
                <a href='#' onClick={() => window.location.reload()}>
                <img src='logobook.png' alt="Logo" />
                </a>
            </div>
            <div className='links'>
                <ul>
                <li><a href='#' className='active'>หน้าหลัก</a></li>
                <li><a href='#'>ข้อมูลสมาชิกในระบบ</a></li>
                <li><a href='#'>รายการเช่าทั้งหมด</a></li>
                </ul>
            </div>
            <div className='login-sec'>
                {user ? (
                <div className='user-info'>
                    {user.photoURL && <img src={user.photoURL} alt="User Profile" />}
                    <h1>{user.displayName || user.email}</h1>
                    <button onClick={handleLogout} className='home-button'>Log Out</button>
                </div>
                ) : (
                <button className='adminhome-button'>Login</button>
                )}
            </div>
            </nav>
  </header>
  </div>
  )
}

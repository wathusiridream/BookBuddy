import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/AdminHomeStyle.css'; // Import the CSS file
import AdminNavBar from './AdminNavBar';

function AdminHomepage() {
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
      <AdminNavBar />
      <div className='adminhome-content'>
        <div className='adminhome-container' style={gradientStyle}>
          <div className="card-container">
            <div className="card">
              <img src="6111095.jpg" alt="สมาชิก" />
              <h2>ข้อมูลสมาชิกในระบบ</h2>
            </div>
            <div className="card" onClick={() => navigate('/AllRental')}>
              <img src="rentallist.jpg" alt="รายการเช่า" />
              <h2>รายการการเช่าทั้งหมด</h2>
            </div>
            <div className="card">
              <img src="salary02.jpg" alt="การจ่ายเงิน" />
              <h2>จ่ายเงินค่าเช่าให้ผู้ปล่อยเช่า</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomepage;

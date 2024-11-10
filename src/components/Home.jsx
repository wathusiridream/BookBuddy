import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/Homestyle.css';
import { IonIcon } from '@ionic/react';
import { searchCircleOutline } from 'ionicons/icons';
import { db } from '../utils/firebase';
import ForRentForm from './ForRentForm';
import RentalForm from './RentalForm';
import RentHistory from './RentHistory';
import QRCodeGenerator from './QRCode';
import DropDownProfile from './DropDownProfile';
import NavBar from './NavBar';
const Home = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    // Redirect to login if not logged in
    if (!currentUser) {
      navigate('/'); // Redirect to the login page
      return;
    }

    // Set the current user
    setUser(currentUser);

    // Redirect based on the user email domain
    if (currentUser.email.endsWith('@bookbuddy.com')) {
      navigate('/adminHomepage'); // Redirect to adminHomepage
    } else {
      navigate('/home'); // Redirect to the regular home page
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleForRent = () => {
    navigate('/ForRent');
  };

  const handleSeeAllBooks = () => {
    navigate('/ShowBooks');
  };

  const handleProfileEdit = () => {
    navigate('/ProfileEdit');
  };
  
  const handleAboutUS = () => {
    navigate('/AboutUs');
}

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

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
              <li style={{color : 'black'}}><a href='#' >หน้าหลัก</a></li>
              <li style={{color : 'black'}}><a href='#' onClick={handleSeeAllBooks}>หนังสือทั้งหมด</a></li>
              <li style={{color : 'black'}}><a href='#' onClick={handleForRent}>ปล่อยเช่า</a></li>
              <li style={{color : 'black'}}><a href='#' onClick={handleAboutUS}>เกี่ยวกับเรา</a></li>
            </ul>
          </div>
          <div className='login-sec'>
            {user ? (
              <div className='user-info'>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="User Profile"
                    onClick={handleProfileClick}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                {showProfileMenu && <DropDownProfile />}
                <h1 style={{ color: 'black' }}>{user.displayName || user.email}</h1>
                <button onClick={handleLogout} style={{ 
                      border: '2px solid #F36825', 
                      background: '#F36825' , 
                      borderRadius: '15px', 
                      color:  'white' 
                    }}>ออกจากระบบ
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/')} className='home-button'>Login</button>
            )}
          </div>
        </nav>

        <div className='home-content'>
          <div className='home-container'>
            <h1>ยินดีต้อนรับสู่ BookBuddy!</h1>
            <h2>Your Ultimate Book Rental Community</h2>
            <button id="Rent-now" className='home-button' onClick={handleForRent}>ปล่อยเช่าหนังสือ</button>
            <button id="See All Books" className='home-button' onClick={handleSeeAllBooks}>หนังสือทั้งหมด</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;

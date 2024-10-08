import React, { useEffect, useState ,useContext} from 'react';
import { getAuth, reload, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/Homestyle.css'; // Import the CSS file
import { IonIcon } from '@ionic/react';
import { searchCircleOutline } from 'ionicons/icons';
import { doc, getDoc } from "firebase/firestore";
import { db , auth } from '../utils/firebase';
import Lessors_Regis from './Lessors_Regis';
import StepperForm from './StepperForm';

const Home = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  const handleSearch = () => {
    console.log('Searching for:', searchTerm); // Perform search or navigate to search results
  };
  
  const [showStepper, setShowStepper] = useState(false);

  // ฟังก์ชันที่ใช้ในการแสดง/ซ่อน StepperForm เมื่อกดที่ li
  const handleRental = () => {
    navigate('/Rental');
  };

  const handleAddress = () => {
    navigate('/ThaiAddress')
  }

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
              <li><a href='#' className='active'>Home</a></li>
              <li><a href='#' onClick={handleAddress}>About</a></li>
              <li><a href='#' onClick={handleRental} >For Rent  </a></li>
              <li><a href='#'>Contacts</a></li>
            </ul>
          </div>
          {showStepper && <StepperForm />}
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
                {user.photoURL && <img src={user.photoURL} alt="User Profile" />}
                <h1>{user.displayName || user.email}</h1>
                <button onClick={handleLogout} className='home-button'>Log Out</button>
              </div>
            ) : (
              <button className='home-button'>Login</button>
            )}
          </div>
        </nav>

        <div className='home-content'>
          <div className='home-container'>
            <h1>Welcome to BookBuddy!</h1>
            <h2>Your Ultimate Book Rental Community</h2>
            {/*<p>
              At BookBuddy, we believe that every book has a story to tell, 
              and every story deserves to be shared. 
              Whether you're looking to rent your favorite reads or lend your cherished books to fellow book lovers, we’ve got you covered.
            </p>*/}
            <button id="Rent-now" className='home-button'>Rent Now</button>
            <button id="See All Books" className='home-button'>See All Books</button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;

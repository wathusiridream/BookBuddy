import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/NavBar.css'; 

export default function NavBar() {
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

    const handleForRent = () => {
        navigate('/ForRent');
    };

    const handleShowBooks = () => {
        navigate('/ShowBooks'); // Redirect to ShowBooks page
    };
      
    const handleProfileEdit = () => {
        navigate('/ProfileEdit');
    };

    const handleHome = () => {
        navigate('/')
    }

return (
        <div className='navbarhome-page'>      
                <nav className='navbarhome-nav'>
                    <div className='logo'>
                        <a href='#' onClick={() => window.location.reload()}>
                            <img src='logobook.png' alt="Logo" />
                        </a>
                    </div>
                    <div className='links'>
                        <ul>
                            <li><a href='#' onClick={handleHome}>หน้าหลัก</a></li>
                            <li><a href='#' onClick={handleShowBooks}>หนังสือทั้งหมด</a></li> {/* Updated here */}
                            <li><a href='#' onClick={handleForRent}>ปล่อยเช่า</a></li>
                            <li><a href='#'>เกี่ยวกับเรา</a></li>
                        </ul>
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
                            <button onClick={handleLogout} className='navbarhome-button'>Log Out</button>
                        </div>
                        ) : (
                        <button onClick={() => navigate('/')} className='navbarhome-button'>Login</button>
                        )}
                    </div>
                </nav>
        </div>
    );
}

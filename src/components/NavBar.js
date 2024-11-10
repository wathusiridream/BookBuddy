import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebase';
import '../WebStyle/NavBar.css';
import DropDownProfile from './DropDownProfile';

export default function NavBar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
            // ฟังการเปลี่ยนแปลงของข้อมูลผู้ใช้
            const userRef = doc(db, 'users', currentUser.uid);
            const unsubscribe = onSnapshot(userRef, (userDoc) => {
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setDisplayName(userData.displayName || ''); // อัปเดตชื่อแสดงผล
                    setPhotoURL(userData.photoURL || ''); // อัปเดต URL รูปภาพ
                }
            });

            // คืนค่าฟังก์ชันในการยกเลิกการฟังเมื่อคอมโพเนนต์ถูก unmount
            return () => unsubscribe();
        } else {
            navigate('/'); // Redirect to SignIn if not logged in
        }
    }, [navigate]);

    const fetchUserData = async (uid) => {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            setDisplayName(userData.displayName || ''); // กำหนดชื่อแสดงผล
            setPhotoURL(userData.photoURL || ''); // กำหนด URL รูปภาพ
        }
    };

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

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const handleAboutUS = () => {
        navigate('/AboutUs');
    }

    return (
        <div className='navbarhome-page'>
            <nav className='navbarhome-nav'>
                <div className='logo'>
                    <a href='#' onClick={() => window.location.reload()}>
                        <img src={require('../WebStyle/logobook.png')} alt="Logo" />
                    </a>
                </div>
                <div className='links'>
                    <ul>
                        <li><a href='#' onClick={handleHome}>หน้าหลัก</a></li>
                        <li><a href='#' onClick={handleShowBooks}>หนังสือทั้งหมด</a></li>
                        <li><a href='#' onClick={handleForRent}>ปล่อยเช่า</a></li>
                        <li><a href='#'onclick={handleAboutUS}>เกี่ยวกับเรา</a></li>
                    </ul>
                </div>
                <div className='login-sec'>
                    {user ? (
                        <div className='user-info'>
                            {photoURL && (
                                <img
                                    src={photoURL}
                                    alt="User Profile"
                                    onClick={handleProfileClick}
                                    style={{ cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px' }} // ปรับขนาดให้เหมาะสม
                                />
                            )}
                            {showProfileMenu && <DropDownProfile />}
                            <h1 style={{ color: 'black' }}>{displayName || user.email}</h1>
                            <button onClick={handleLogout} style={{
                                border: '2px solid #F36825',
                                background: '#F36825',
                                borderRadius: '15px',
                                color: 'white'
                            }}>ออกจากระบบ
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/')} className='navbarhome-button'>Login</button>
                    )}
                </div>
            </nav>
        </div>
    );
}
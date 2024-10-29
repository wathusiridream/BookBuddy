import { useState } from 'react';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut , getAuth } from 'firebase/auth';
import { personOutline, documentTextOutline, logOutOutline, createOutline } from 'react-ionicons';
import '../WebStyle/Homestyle.css'
export default function DropDownProfile() {

    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
 
    const handleProfileClick = () => {
      setShowProfileMenu(!showProfileMenu);
    };
  
    const handleNavigate = (path) => {
      setShowProfileMenu(false); // ปิดเมนูก่อนนำทาง
      navigate(path);
    };

    const handleLogout = async () => {
        try {
          await signOut(getAuth());
          navigate('/'); // Redirect to the login page
        } catch (error) {
          console.error('Error signing out:', error);
        }
      };
    
return (
    <div className='flex flex-col dropdowmProfile'> 
        <ul className='flex flex-col gap-4'>
            <li onClick={() => handleNavigate('/ProfileEdit')}>แก้ไขข้อมูลส่วนตัว</li>
            <li onClick={() => handleNavigate('/RentHistory')}>ประวัติการเช่า</li>
            <li onClick={() => handleNavigate('/ForRentHistory')}>ประวัติการปล่อยเช่า</li>
            <li onClick={handleLogout}>ออกจากระบบ</li>
        </ul>
    </div>
  )
}

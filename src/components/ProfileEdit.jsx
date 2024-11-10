import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../WebStyle/ProfileEdit.css';
import { storage } from '../utils/firebase';
import NavBar from './NavBar';

const ProfileEdit = () => {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [telephone, setTelephone] = useState('');
    const [thaiID, setThaiID] = useState('');
    // State สำหรับฟิลด์ข้อมูลผู้ใช้เพิ่มเติม
    const [dateofBirth, setDateofBirth] = useState('');
    const [district, setDistrict] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastName, setLastName] = useState('');
    const [promptpayNumber, setPromptpayNumber] = useState('');
    const [province, setProvince] = useState('');
    const [soi, setSoi] = useState('');
    const [streetname, setStreetname] = useState('');
    const [subDistrict, setSubDistrict] = useState('');
    const [villagebuildingname, setVillagebuildingname] = useState('');
    const [villagenumber, setVillagenumber] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [newPhotoFile, setNewPhotoFile] = useState(null);
    const navigate = useNavigate();
    const [previewPhotoURL, setPreviewPhotoURL] = useState(null); // State for previewing the new photo

    const fetchUserData = async () => {  // ฟังก์ชัน fetchUserData ต้องอยู่ที่นี่
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            const userInfoRef = collection(db, 'UserInformation');
            const q = query(userInfoRef, where('email', '==', currentUser.email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                setEmail(userData.email || '');
                setTelephone(userData.telephone || '');
                setThaiID(userData.thaiID || '');
                setDateofBirth(userData.dateofBirth || '');
                setDistrict(userData.district || '');
                setFirstname(userData.firstname || '');
                setLastName(userData.lastName || '');
                setPromptpayNumber(userData.promptpayNumber || '');
                setProvince(userData.province || '');
                setSoi(userData.soi || '');
                setStreetname(userData.streetname || '');
                setSubDistrict(userData.subDistrict || '');
                setVillagebuildingname(userData.villagebuildingname || '');
                setVillagenumber(userData.villagenumber || '');
                setZipCode(userData.zipCode || '');
                setPhotoURL(userData.photoURL || ''); // Set existing photo URL
            } else {
                console.error('No matching document found in UserInformation collection');
            }
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
            // Fetch displayName from users collection
            const fetchDisplayName = async () => {
                const userRef = doc(db, 'UserInformation', currentUser.email);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setDisplayName(userDoc.data().displayName || '');
                } else {
                    console.error('No matching document found in users collection');
                }
            };

            fetchDisplayName();

            // Fetch email and other user data from Firestore
            fetchUserData();  // เรียกใช้ฟังก์ชันที่นี่เพื่อให้ข้อมูลถูกโหลดใน useEffect
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handlePhotoUpload = async (event) => {
        const file = event.target.files[0]; // Get the file from the input
        if (file) {
            const storageRef = ref(storage, `profilePhotos/${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setPhotoURL(downloadURL); // Update photo URL
            setPreviewPhotoURL(downloadURL); // Set preview photo URL for immediate display

            // Update Firestore with the new photo URL
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                const userInfoRef = collection(db, 'UserInformation');
                const q = query(userInfoRef, where('email', '==', currentUser.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDocRef = querySnapshot.docs[0].ref;
                    await updateDoc(userDocRef, {
                        photoURL: downloadURL,
                    });
                }
            }
        }
    };

    const handleSave = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                // Update 'users' collection
                const userRef = doc(db, 'UserInformation', currentUser.email);
                await updateDoc(userRef, {
                    displayName: displayName,
                    photoURL: previewPhotoURL || photoURL, // ใช้ preview URL หรือ existing URL
                });

                // Fetch and update UserInformation
                const userInfoRef = collection(db, 'UserInformation');
                const q = query(userInfoRef, where('email', '==', currentUser.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDocRef = querySnapshot.docs[0].ref;
                    await updateDoc(userDocRef, {
                        // อัพเดตข้อมูลที่จำเป็นใน UserInformation
                    });
                }

                // เรียกใช้ fetchUserData เพื่อให้แสดงข้อมูลที่อัพเดตล่าสุด
                await fetchUserData();

                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
            alert(`Error updating profile: ${error.message}`);
        }
    };

    return (
        <div>
            <NavBar />
            <div className='profile-edit-page'>
                <h1>แก้ไขข้อมูลส่วนตัว</h1>
                <div className='profile-edit-form'>
                    {/* Display Name and Email */}
                    <div className='form-group'>
                        <label htmlFor='displayName'>ชื่อ:</label>
                        <input
                            type='text'
                            id='displayName'
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>อีเมล :</label>
                        <input
                            type='email'
                            id='email'
                            value={email}
                            disabled
                        />
                    </div>

                    {/* Telephone and Thai ID */}
                    <div className='form-group'>
                        <label htmlFor='telephone'>เบอร์โทรศัพท์ :</label>
                        <input
                            type='text'
                            id='telephone'
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='thaiID'>หมายเลขประจำตัวประชาชน :</label>
                        <input
                            type='text'
                            id='thaiID'
                            value={thaiID}
                            onChange={(e) => setThaiID(e.target.value)}
                            disabled
                        />
                    </div>

                    {/* Address Fields */}
                    <div className='form-group'>
                        <label htmlFor='province'>จังหวัด :</label>
                        <input
                            type='text'
                            id='province'
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='district'>อำเภอ / เขต :</label>
                        <input
                            type='text'
                            id='district'
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='subDistrict'>ตำบล / แขวง :</label>
                        <input
                            type='text'
                            id='subDistrict'
                            value={subDistrict}
                            onChange={(e) => setSubDistrict(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='streetname'>ถนน :</label>
                        <input
                            type='text'
                            id='streetname'
                            value={streetname}
                            onChange={(e) => setStreetname(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='soi'>ซอย :</label>
                        <input
                            type='text'
                            id='soi'
                            value={soi}
                            onChange={(e) => setSoi(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='villagenumber'>หมู่ที่ :</label>
                        <input
                            type='text'
                            id='villagenumber'
                            value={villagenumber}
                            onChange={(e) => setVillagenumber(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='villagebuildingname'>ชื่อหมู่บ้าน / อาคาร :</label>
                        <input
                            type='text'
                            id='villagebuildingname'
                            value={villagebuildingname}
                            onChange={(e) => setVillagebuildingname(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='zipCode'>รหัสไปรษณีย์ :</label>
                        <input
                            type='text'
                            id='zipCode'
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                        />
                    </div>

                    {/* Profile Photo Upload */}
                    <div className='form-group'>
                        <label htmlFor='photo'>รูปโปรไฟล์ :</label>
                        <input
                            type='file'
                            id='photo'
                            accept='image/*'
                            onChange={handlePhotoUpload}
                        />
                    </div>
                    {previewPhotoURL && <img src={previewPhotoURL} alt='Profile Preview' className='profile-photo-preview' />}

                    {/* Save Button */}
                    <button onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEdit;
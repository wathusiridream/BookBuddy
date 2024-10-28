import React, { useEffect, useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions
import '../WebStyle/ProfileEdit.css';
import { storage } from '../utils/firebase'; // ให้แน่ใจว่าที่อยู่ถูกต้อง

const ProfileEdit = () => {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [telephone, setTelephone] = useState('');
    const [thaiID, setThaiID] = useState('');
    const [newPhotoFile, setNewPhotoFile] = useState(null); // Declare state for new photo file

    const navigate = useNavigate();

    

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            setUser(currentUser);
            setDisplayName(currentUser.displayName || '');
            setEmail(currentUser.email || '');

            // Fetch user data from Firestore to get the updated photoURL
            const userRef = doc(db, 'users', currentUser.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setPhotoURL(userData.photoURL || ''); // Update photoURL from Firestore
                } else {
                    setPhotoURL(''); // If no document found, set to empty
                }
            });
            fetchRentalData(currentUser.uid); // Fetch rental data here
        } else {
            navigate('/');
        }
    }, [navigate]);




    const fetchRentalData = async (uid) => {
        try {
            const rentalsRef = collection(db, 'rentals');
            const q = query(rentalsRef, where('userId', '==', uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const rentalData = doc.data();
                setTelephone(rentalData.telephone || ''); // Set telephone
                setThaiID(rentalData.thaiID || ''); // Set Thai ID
            });
        } catch (error) {
            console.error('Error fetching rental data:', error);
        }
    };
    const handleSave = async () => {
        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);

                if (newPhotoFile) {
                    const storageRef = ref(storage, `profilePictures/${newPhotoFile.name}`);
                    await uploadBytes(storageRef, newPhotoFile);

                    const downloadURL = await getDownloadURL(storageRef);
                    setPhotoURL(downloadURL);

                    const uniqueURL = `${downloadURL}?timestamp=${new Date().getTime()}`;

                    // Log URLs for debugging
                    console.log("Download URL:", downloadURL);
                    console.log("Unique URL:", uniqueURL);

                    // อัปเดต photoURL
                    setPhotoURL(uniqueURL);

                    // อัปเดต Firestore
                    await updateDoc(userRef, {
                        displayName: displayName,
                        email: email,
                        photoURL: downloadURL, // ใช้ URL ที่ได้รับมา
                        telephone: telephone,
                        thaiID: thaiID,
                    });

                    // อัปเดตโปรไฟล์ Firebase Auth
                    await updateProfile(currentUser, {
                        displayName: displayName,
                        photoURL: downloadURL,
                    });
                } else {
                    await updateDoc(userRef, {
                        displayName: displayName,
                        email: email,
                        telephone: telephone,
                        thaiID: thaiID,
                    });
                }

                const rentalsRef = collection(db, 'rentals');
                const q = query(rentalsRef, where('userId', '==', currentUser.uid));
                const rentalDocs = await getDocs(q);

                if (!rentalDocs.empty) {
                    rentalDocs.forEach(async (doc) => {
                        const rentalRef = doc.ref;
                        await updateDoc(rentalRef, {
                            telephone: telephone,
                            thaiID: thaiID,
                        });
                    });
                } else {
                    await setDoc(doc(db, 'rentals', currentUser.uid), {
                        userId: currentUser.uid,
                        telephone: telephone,
                        thaiID: thaiID,
                    });
                }

                alert('Profile updated successfully!');
                navigate('/'); // Redirect back to home after saving
            }
        } catch (error) {
            console.error('Error updating profile:', error.message);
            alert(`Error updating profile: ${error.message}`);
        }
    };





    // Function to handle photo upload
    const handlePhotoUpload = async () => {
        if (newPhotoFile) {
            const storageRef = ref(storage, `profilePictures/${newPhotoFile.name}`);
            await uploadBytes(storageRef, newPhotoFile);

            // Get the download URL after uploading
            const downloadURL = await getDownloadURL(storageRef);

            // Update the photoURL state
            setPhotoURL(downloadURL);
        }
    };




    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setNewPhotoFile(file); // เก็บไฟล์รูปภาพใหม่ไว้ใน state

        const reader = new FileReader();
        reader.onload = () => {
            setPhotoURL(reader.result); // แสดงตัวอย่างภาพก่อนอัปโหลด
        };
        reader.readAsDataURL(file);
    };


    const handleViewRentingHistory = () => {
        navigate('/RentingHistory'); // Navigate to the RentingHistory page
    };

    return (
        <div className='profile-edit-page'>
            <h1>Edit Profile</h1>
            <div className='profile-edit-form'>
                <div className='form-group'>
                    <label htmlFor='displayName'>Display Name:</label>
                    <input
                        type='text'
                        id='displayName'
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='telephone'>Telephone:</label>
                    <input
                        type='text'
                        id='telephone'
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='thaiID'>Thai ID:</label>
                    <input
                        type='text'
                        id='thaiID'
                        value={thaiID}
                        onChange={(e) => setThaiID(e.target.value)}
                        disabled
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='photo'>Profile Photo:</label>
                    <input
                        type='file'
                        id='photo'
                        accept='image/*'
                        onChange={(e) => setNewPhotoFile(e.target.files[0])}
                    />
                    {photoURL && (
                        <div>
                            <img src={photoURL} alt="Profile"  />
                        </div>
                    )}
                    

                </div>

                <button className='save-button' onClick={handleSave}>Save Changes</button>
                {/* Add the button to view renting history */}
                <button className='view-renting-history-button' onClick={handleViewRentingHistory}>
                    ดูประวัติการปล่อยเช่าหนังสือ
                </button>
            </div>
        </div>
    );
};

export default ProfileEdit;
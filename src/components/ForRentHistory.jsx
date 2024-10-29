import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

const ForRentHistory = () => {
    const [forRentHistory, setForRentHistory] = useState([]);
    const [damageReport, setDamageReport] = useState('');
    const [beforeImage, setBeforeImage] = useState(null);
    const [afterImage, setAfterImage] = useState(null);
    const [selectedRentalId, setSelectedRentalId] = useState(null);
    const [status, setStatus] = useState('');

    const userId = getAuth().currentUser?.uid;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForRentHistory = async () => {
            if (userId) {
                try {
                    // Step 1: Fetch bookIds from ForRents where userId matches
                    const forRentsRef = collection(db, 'ForRents');
                    const forRentsQuery = query(forRentsRef, where('userId', '==', userId));
                    const forRentsSnapshot = await getDocs(forRentsQuery);

                    // เก็บ bookId ลงในลิสต์
                    const bookIds = forRentsSnapshot.docs.map(doc => doc.id);

                    // Step 2: Fetch rentals that have bookIds in the list
                    if (bookIds.length > 0) {
                        const rentalsRef = collection(db, 'rentals');
                        const rentalsQuery = query(rentalsRef, where('bookId', 'in', bookIds));
                        const rentalsSnapshot = await getDocs(rentalsQuery);

                        // เก็บข้อมูล rentals ลงในลิสต์
                        const rentalList = rentalsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        // Step 3: Fetch book names and user names from ForRents
                        const detailedRentals = rentalList.map(rental => {
                            const forRent = forRentsSnapshot.docs.find(doc => doc.id === rental.bookId);
                            return {
                                rentalId: rental.id,
                                bookName: forRent ? forRent.data().bookName : 'ไม่ระบุชื่อหนังสือ',
                                rentalDate: rental.rentalDate,
                                returnDate: rental.returnDate,
                                totalAmount: rental.totalAmount,
                                firstName: rental.firstName,
                                lastName: rental.lastName,
                                status: rental.status,
                                forRentId: rental.bookId,
                                forRentFirstName: forRent ? forRent.data().firstName : 'ไม่ระบุ',
                                forRentLastName: forRent ? forRent.data().lastName : 'ไม่ระบุ',
                            };
                        });

                        setForRentHistory(detailedRentals);
                    } else {
                        setForRentHistory([]); // ถ้าไม่มี book IDs ให้ตั้งค่าเป็นลิสต์ว่าง
                    }
                } catch (error) {
                    console.error("Error fetching rental history:", error);
                }
            } else {
                console.warn("User is not authenticated.");
            }
        };

        fetchForRentHistory();
    }, [userId]);

    const handleSave = async () => {
        if (selectedRentalId) {
            const rentalRef = doc(db, 'rentals', selectedRentalId);
            await updateDoc(rentalRef, {
                damageReport,
                beforeImage, // ควรอัปโหลดรูปภาพไปยัง storage และเก็บ URL ที่นี่
                afterImage,  // ควรอัปโหลดรูปภาพไปยัง storage และเก็บ URL ที่นี่
                status,
            });
            alert('Updated successfully!');
        }
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            if (type === 'before') {
                setBeforeImage(reader.result);
            } else if (type === 'after') {
                setAfterImage(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleBackButtonClick = () => {
        navigate('/home');
    };

    return (
        <div>
            <NavBar />
            <IonIcon 
                icon={arrowBack}  
                onClick={handleBackButtonClick}
                className="backtoshowbook"
                aria-label='ย้อนกลับ'
            /> 
            <span 
                className="back-text" 
                onClick={handleBackButtonClick}
            >ย้อนกลับ
            </span>
            <div className='renting-history-page'>
                <h1>ประวัติการปล่อยเช่าหนังสือ</h1>
                {forRentHistory.map((rental) => (
                    <div key={rental.rentalId} className='rental-item'>
                        <h2>ชื่อหนังสือ: {rental.bookName}</h2>
                        <p>ผู้เช่า: {rental.firstName} {rental.lastName}</p>
                        <p>วันเช่า: {rental.rentalDate}</p>
                        <p>วันคืน: {rental.returnDate}</p>
                        <p>ยอดรวม: {rental.totalAmount}</p>
                        <p>สถานะ: {rental.status || 'รอการจัดการ'}</p>
                        <button onClick={() => setSelectedRentalId(rental.rentalId)}>จัดการการเช่านี้</button>
                    </div>
                ))}

                {selectedRentalId && (
                    <div className='rental-management'>
                        <h2>จัดการการเช่า</h2>
                        <div className='form-group'>
                            <label>รายงานความเสียหาย:</label>
                            <textarea
                                value={damageReport}
                                onChange={(e) => setDamageReport(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>รูปภาพก่อนจัดส่ง:</label>
                            <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'before')} />
                            {beforeImage && <img src={beforeImage} alt='Before' />}
                        </div>
                        <div className='form-group'>
                            <label>รูปภาพหลังได้รับคืน:</label>
                            <input type='file' accept='image/*' onChange={(e) => handleImageChange(e, 'after')} />
                            {afterImage && <img src={afterImage} alt='After' />}
                        </div>
                        <div className='form-group'>
                            <label>สถานะ:</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value=''>เลือกสถานะ</option>
                                <option value='จัดส่งหนังสือแล้ว'>จัดส่งหนังสือแล้ว</option>
                                <option value='ได้รับหนังสือคืนแล้ว'>ได้รับหนังสือคืนแล้ว</option>
                            </select>
                        </div>
                        <button onClick={handleSave}>บันทึกการเปลี่ยนแปลง</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForRentHistory;

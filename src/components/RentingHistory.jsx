import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const RentingHistory = () => {
    const [rentingHistory, setRentingHistory] = useState([]);
    const [damageReport, setDamageReport] = useState('');
    const [beforeImage, setBeforeImage] = useState(null);
    const [afterImage, setAfterImage] = useState(null);
    const [selectedRentalId, setSelectedRentalId] = useState(null);
    const [status, setStatus] = useState('');

    const userId = getAuth().currentUser?.uid;

    useEffect(() => {
        const fetchRentingHistory = async () => {
            if (userId) {
                const rentalsRef = collection(db, 'rentals');
                const rentalSnapshot = await getDocs(rentalsRef);
                const rentalList = rentalSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(rental => rental.userId === userId);
                setRentingHistory(rentalList);
            }
        };

        fetchRentingHistory();
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

    return (
        <div className='renting-history-page'>
            <h1>ประวัติการปล่อยเช่าหนังสือ</h1>
            {rentingHistory.map((rental) => (
                <div key={rental.id} className='rental-item'>
                    <h2>{rental.bookName}</h2>
                    <p>สถานะ: {rental.status || 'รอการจัดการ'}</p>
                    <button onClick={() => setSelectedRentalId(rental.id)}>จัดการการเช่านี้</button>
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
    );
};

export default RentingHistory;

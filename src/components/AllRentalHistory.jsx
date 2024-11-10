import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import AdminNavBar from './AdminNavBar';
import '../WebStyle/AllRentalHistory.css'; // นำเข้า CSS ถ้าต้องการ

const AllRentalHistory = () => {
    const [rentalHistory, setRentalHistory] = useState([]);
    const [forRents, setForRents] = useState([]); // State สำหรับ ForRents

    useEffect(() => {
        const fetchRentals = async () => {
            const rentalsSnapshot = await getDocs(collection(db, 'rentals'));
            const rentalsData = rentalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRentalHistory(rentalsData);
        };

        const fetchForRents = async () => {
            const forRentsSnapshot = await getDocs(collection(db, 'ForRents'));
            const forRentsData = forRentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setForRents(forRentsData);
        };

        fetchRentals();
        fetchForRents();
    }, []);

    const gradientStyle = {
      background: 'linear-gradient(180deg, rgba(67, 179, 174, 1) 0%, rgba(67, 179, 174, 0.76) 21%, rgba(245, 245, 220, 0.48) 76%, rgba(255, 255, 255, 0) 100%)',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#000',
    };

    return (
        <div>
            <AdminNavBar />
            <div className='allhistory-rent-history'>
                <h1>ประวัติการเช่าทั้งหมด</h1>
                <div className="allhistorycard-container" >
                    {rentalHistory.map(rental => {
                        const forRentItem = forRents.find(item => item.id === rental.bookId); // ค้นหา ForRents ตาม bookId
                        return (
                            <div className="allhistorycard" key={rental.rentalId}>
                                <h2>{rental.nameRented}</h2>
                                {forRentItem && ( // ตรวจสอบว่า forRentItem มีข้อมูล
                                    <p>ผู้ปล่อยเช่า : {forRentItem.firstname} {forRentItem.lastName}</p>
                                )}
                                <p>ผู้เช่า : {rental.firstName} {rental.lastName}</p>
                                <p>เบอร์โทรศัพท์ผู้เช่า : {rental.phone}</p>
                                <p>วันที่เริ่มเช่า :{rental.date_rented}</p>
                                <p>วันที่คืน : {rental.date_return}</p>
                                <p>จำนวนวันที่เช่า : {rental.days}</p>
                                <p>ค่าเช่าสุทธิ : {rental.totalAmount} THB</p>
                                <p>สถานะการชำระค่าเช่า : {rental.paymentStatus}</p>
                                <p>เลขพัสดุ : {rental.tracking_number}</p>                                
                            </div>
                        );
                    })}
                </div>
            </div>        
        </div>
    );
};

export default AllRentalHistory;

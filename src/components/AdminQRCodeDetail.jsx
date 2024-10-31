import React, { useEffect, useState } from 'react';
import '../WebStyle/RentHistory.css';
import { db } from './../utils/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavBar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminQRCodeDetails() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inProgress');

  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const rentalCollection = collection(db, 'rentals');

    // ใช้ onSnapshot เพื่อฟังการเปลี่ยนแปลงในฐานข้อมูล
    const unsubscribe = onSnapshot(rentalCollection, (snapshot) => {
      const rentalList = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(rental => rental.userId === currentUserId);

      setRentalHistory(rentalList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching rental history:', error);
      setLoading(false);
    });

    // คืนค่าฟังก์ชันสำหรับยกเลิกการฟังเมื่อคอมโพเนนต์ถูก unmounted
    return () => unsubscribe();
  }, [currentUserId]);

  const handleReturn = async (rentalId) => {
    try {
      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, { renter_returned: true });

      // อัปเดต rentalHistory ในสถานะ
      setRentalHistory((prevRentals) =>
        prevRentals.map((rental) =>
          rental.id === rentalId ? { ...rental, renter_returned: true } : rental
        )
      );
    } catch (error) {
      console.error('Error updating return status:', error);
      alert('เกิดข้อผิดพลาดในการคืนหนังสือ');
    }
  };

  const filterRentals = () => {
    return rentalHistory.filter((rental) => rental.renter_received && !rental.renter_returned);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="renting-history-page">
        <h2>ประวัติการเช่าของฉัน</h2>

        <div className="tabs">
          <button onClick={() => setActiveTab('inProgress')} className={activeTab === 'inProgress' ? 'active' : ''}>
            รายการกำลังเช่า
          </button>
        </div>

        <div className="rental-list">
          {filterRentals().length > 0 ? (
            filterRentals().map((rental) => (
              <div key={rental.id} className="rental-item">
                <h2>ชื่อหนังสือ: {rental.bookName}</h2>
                <p>ผู้เช่า: {rental.firstName} {rental.lastName}</p>
                <p>วันเช่า: {rental.rentalDate}</p>
                <p>วันคืน: {rental.returnDate}</p>
                <p>ยอดรวม: {rental.totalAmount}</p>
                <p>เลขพัสดุ: {rental.tracking_number || 'ไม่มีข้อมูล'}</p>
                <p>สถานะ: {rental.status || 'รอการจัดการ'}</p>
                <p>สถานะการชำระเงิน: {rental.paymentStatus}</p>

                {/* แสดงปุ่มคืนหนังสือในรายการกำลังเช่า */}
                {activeTab === 'inProgress' && rental.renter_received && !rental.renter_returned && (
                  <button onClick={() => handleReturn(rental.id)}>คืนหนังสือแล้ว</button>
                )}
              </div>
            ))
          ) : (
            <p>ไม่มีข้อมูลที่จะแสดง</p>
          )}
        </div>

        {/* ToastContainer สำหรับแสดงป๊อปอัพ */}
        <ToastContainer
          position="top-center" // ตำแหน่งอยู่ซ้ายบน
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </div>
    </div>
  );
}

export default AdminQRCodeDetails;

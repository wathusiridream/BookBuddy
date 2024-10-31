import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../utils/firebase'; // นำเข้า db ที่นี่
import '../WebStyle/RentHistory.css';

function AdminRentaltoPay() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // สถานะเริ่มต้น
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const rentalCollection = collection(db, 'rentals');
    const unsubscribe = onSnapshot(
      rentalCollection,
      (snapshot) => {
        const rentalList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setRentalHistory(rentalList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching rental history:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filterRentals = () => {
    if (activeTab === 'pending') {
      return rentalHistory.filter((rental) => rental.renter_received && !rental.renter_returned);
    } else if (activeTab === 'completed') {
      return rentalHistory.filter((rental) => rental.renter_returned);
    }
    return rentalHistory; // สำหรับ tab อื่น ๆ
  };

  const handlePayment = async (rental) => {
    const admin = auth.currentUser;
    const adminEmail = admin ? admin.email : 'N/A';
    const adminName = admin ? `${admin.displayName}` : 'N/A';

    try {
      await addDoc(collection(db, 'adminpay'), {
        rentalsId: rental.id,
        paymentStatus: false,
        adminEmail,
        adminName,
      });
      navigate('/AdminQRCode', { state: { rentalId: rental.id, amount: rental.totalAmount } });

    } catch (error) {
      console.error('Error adding document to adminpay:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminNavBar />
      <div className="renting-history-page">
        <h2>รายการเช่าที่รอชำระเงิน</h2>
        
        {/* Tabs สำหรับเปลี่ยนหมวดหมู่ */}
        <div className="tabs">
          <button 
            className={activeTab === 'pending' ? 'active' : ''} 
            onClick={() => setActiveTab('pending')}
          >
            รอการชำระเงิน
          </button>
          <button 
            className={activeTab === 'completed' ? 'active' : ''} 
            onClick={() => setActiveTab('completed')}
          >
            ชำระเงินเสร็จสิ้น
          </button>
        </div>

        <div className="rental-list">
          {filterRentals().length > 0 ? (
            filterRentals().map((rental) => {
              console.log(rental.id); // แสดง rental.id ในคอนโซล
              console.log()
              return (
                <div key={rental.id} className="rental-item">
                  <h2>ชื่อหนังสือ: {rental.bookName}</h2>
                  <p>ผู้เช่า: {rental.firstName} {rental.lastName}</p>
                  <p>วันเช่า: {rental.rentalDate}</p>
                  <p>วันคืน: {rental.returnDate}</p>
                  <p>ยอดรวม: {rental.totalAmount}</p>
                  <p>เลขพัสดุ: {rental.tracking_number || 'ไม่มีข้อมูล'}</p>
                  <p>สถานะ: {rental.status || 'รอการจัดการ'}</p>
                  <p>สถานะการชำระเงิน: {rental.paymentStatus}</p>

                  <button onClick={() => handlePayment(rental)}>
                    จ่ายตัง
                  </button>
                </div>
              );
            })
  ) : (
    <p>ไม่มีข้อมูลที่จะแสดง</p>
  )}
</div>

        <ToastContainer
          position="top-center"
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

export default AdminRentaltoPay;

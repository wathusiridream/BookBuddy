import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, getDocs , getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../utils/firebase';
import '../WebStyle/RentHistory.css';

function AdminRentaltoPay() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const rentalsSnapshot = await getDocs(collection(db, 'rentals'));
        const rentalsData = rentalsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        
        const enrichedRentals = await Promise.all(
          rentalsData.map(async (rental) => {
            const bookDocRef = doc(db, 'ForRents', rental.bookId);
            const bookDoc = await getDoc(bookDocRef);
            
            if (bookDoc.exists()) {
              return {
                ...rental,
                bookName: bookDoc.data().bookName,
                ownerFirstName: bookDoc.data().firstname,
                ownerLastName: bookDoc.data().lastName
              };
            } else {
              return rental;
            }
          })
        );

        setRentalHistory(enrichedRentals);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rental history:', error);
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  useEffect(() => {
    const filterRentals = async () => {
      const adminpaySnapshot = await getDocs(collection(db, 'adminpay'));
      const adminpayData = {};
      adminpaySnapshot.forEach((doc) => {
        const data = doc.data();
        adminpayData[data.rentalsId] = data.paymentStatus;
      });

      if (activeTab === 'pending') {
        setFilteredRentals(
          rentalHistory.filter((rental) => {
            const isPaid = adminpayData[rental.id] === true;   
            return rental.renter_received && !isPaid;
          })
        );
      } else if (activeTab === 'completed') {
        setFilteredRentals(
          rentalHistory.filter((rental) => {
            const isPaid = adminpayData[rental.id] === true;
            console.log(rental.id)
            return rental.renter_received && isPaid;
          })
        );
      } else {
        setFilteredRentals(rentalHistory);
      }
    };

    filterRentals();
  }, [activeTab, rentalHistory]);

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
      console.log(rental.id)
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
  {filteredRentals.length > 0 ? (
    filteredRentals.map((rental) => (
      <div key={rental.id} className="rental-item">
        <h2>ชื่อหนังสือ: {rental.bookName}</h2>
        <p>ผู้เช่า: {rental.firstName} {rental.lastName}</p>
        <p>วันเช่า: {rental.rentalDate}</p>
        <p>วันคืน: {rental.date_return}</p>
        <p>ยอดรวม: {rental.totalAmount}</p>
        <p>เลขพัสดุ: {rental.tracking_number || 'ไม่มีข้อมูล'}</p>
        <p>สถานะ: {rental.status || 'รอการจัดการ'}</p>
        <p>สถานะการชำระเงิน: {rental.paymentStatus}</p>

        {/* แสดงปุ่ม "จ่ายตัง" เฉพาะใน tab "รอการชำระเงิน" */}
        {activeTab === 'pending' && (
          <button onClick={() => handlePayment(rental)}>
            จ่ายตัง
          </button>
        )}
      </div>
    ))
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

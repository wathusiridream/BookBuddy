import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; // Ensure these are correctly imported
import { db } from '../utils/firebase';
import NavBar from './NavBar'; // Import your NavBar component
import AdminNavBar from './AdminNavBar';
function AllRentalHistory() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notReceived');

  const navigate = useNavigate(); // Create navigate variable

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        const rentalCollection = collection(db, 'rentals');
        const rentalSnapshot = await getDocs(rentalCollection);

        const rentalList = rentalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setRentalHistory(rentalList);
      } catch (error) {
        console.error('Error fetching rental history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, []);

  const handleReceive = async (rentalId) => {
    try {
      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, { receivedStatus: 'received' });

      // Navigate to ReceiveDetails page
      navigate(`/receive-details/${rentalId}`);
    } catch (error) {
      console.error('Error updating received status:', error);
      alert('เกิดข้อผิดพลาดในการยืนยันการได้รับของ');
    }
  };

  const filterRentals = () => {
    if (activeTab === 'notReceived') {
      return rentalHistory.filter((rental) => rental.receivedStatus !== 'received');
    } else if (activeTab === 'returned') {
      return rentalHistory.filter((rental) => rental.receivedStatus === 'received' && rental.returnStatus === 'not yet');
    }
    return rentalHistory;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminNavBar />
      <div className="rent-history-container">
        <h2>ประวัติการเช่าทั้งหมดในระบบ</h2>

        <div className="tabs">
          <button onClick={() => setActiveTab('notReceived')} className={activeTab === 'notReceived' ? 'active' : ''}>
            รายการที่ยังไม่ได้รับ
          </button>
          <button onClick={() => setActiveTab('returned')} className={activeTab === 'returned' ? 'active' : ''}>
            รายการที่คืนแล้ว
          </button>
        </div>

        <div className="rental-list">
          {filterRentals().length > 0 ? (
            filterRentals().map((rental) => (
              <div key={rental.id} className="rental-item">
                <img src={rental.image} alt={rental.productName} className="rental-image" />
                <div className="rental-details">
                  <h3>{rental.productName}</h3>
                  <p>ชื่อ: {rental.firstName} {rental.lastName}</p>
                  <p>จำนวน: {rental.quantity}</p>
                  <p>ราคาเช่าต่อวัน: {rental.rentalPrice} บาท</p>
                  <p>รวมราคา: {rental.totalAmount} บาท</p>
                  <p>สถานะการชำระเงิน: {rental.paymentStatus}</p>
                  <p>สถานะการได้รับของ: {rental.receivedStatus || 'รอจัดส่ง'}</p>
                  <p>สถานะการคืนของ: {rental.returnStatus || 'รอคืนของ'}</p>
                  <button onClick={() => handleReceive(rental.id)}>ยืนยันการได้รับ</button>
                </div>
              </div>
            ))
          ) : (
            <p>ไม่มีข้อมูลที่จะแสดง</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllRentalHistory;

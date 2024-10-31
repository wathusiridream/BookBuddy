import React, { useEffect, useState } from 'react';
import '../WebStyle/RentHistory.css';
import { db } from './../utils/firebase';
import { collection, onSnapshot, doc, getDoc, updateDoc  , where} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavBar from './NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RentHistory() {
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notReceived');

  const auth = getAuth();
  const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
  
  useEffect(() => {
    const rentalCollection = collection(db, 'rentals');

    const unsubscribe = onSnapshot(rentalCollection, async (snapshot) => {
      const rentalList = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const rentalData = { id: doc.id, ...doc.data() };
          return rentalData;
        })
      );

      // ฟิลเตอร์การเช่าที่เป็นของผู้ใช้ปัจจุบัน
      const userRentals = rentalList.filter((rental) => rental.userId === currentUserId);
      
      // เก็บ bookIds
      const bookIds = userRentals.map((rental) => rental.bookId).filter(Boolean);

      // ดึงข้อมูลจาก ForRents
      const booksData = await Promise.all(
        bookIds.map(async (bookId) => {
          const bookDocRef = doc(db, 'ForRents', bookId);
          const bookDoc = await getDoc(bookDocRef);
          if (bookDoc.exists()) {
            return { id: bookDoc.id, ...bookDoc.data() };
          } else {
            return { id: bookId, bookName: 'ไม่พบชื่อหนังสือ' };
          }
        })
      );

      // สร้างอาเรย์ใหม่ที่มีข้อมูลการเช่าพร้อมชื่อหนังสือ
      const rentalHistoryWithBooks = userRentals.map((rental) => {
        const bookData = booksData.find(book => book.id === rental.bookId);
        return {
          ...rental,
          bookName: bookData ? bookData.bookName : 'ไม่มีข้อมูล'
        };
      });

      setRentalHistory(rentalHistoryWithBooks);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching rental history:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);


  if (loading) {
    return <div>Loading...</div>;
  }

  const handleReceive = async (rental) => {
    try {
      const rentalRef = doc(db, 'rentals', rental.id);
      const currentDate = new Date();
      const returnDate = new Date(currentDate);
      returnDate.setDate(returnDate.getDate() + rental.days);

      await updateDoc(rentalRef, {
        renter_received: true,
        date_return: returnDate.toISOString().split('T')[0],
      });

      toast.success(`คุณจะต้องคืนหนังสือภายในวันที่: ${returnDate.toISOString().split('T')[0]}`);

      setRentalHistory((prevRentals) =>
        prevRentals.map((rentalItem) =>
          rentalItem.id === rental.id ? { ...rentalItem, renter_received: true, date_return: returnDate.toISOString().split('T')[0] } : rentalItem
        )
      );
    } catch (error) {
      console.error('Error updating received status:', error);
      alert('เกิดข้อผิดพลาดในการยืนยันการได้รับของ');
    }
  };

  const handleReturn = async (rentalId) => {
    try {
      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, { renter_returned: true });

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
    if (activeTab === 'notReceived') {
      return rentalHistory.filter((rental) => !rental.renter_received);
    } else if (activeTab === 'inProgress') {
      return rentalHistory.filter((rental) => rental.renter_received && !rental.renter_returned);
    } else if (activeTab === 'returned') {
      return rentalHistory.filter((rental) => rental.renter_received && rental.renter_returned);
    }
    return rentalHistory;
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
          <button onClick={() => setActiveTab('notReceived')} className={activeTab === 'notReceived' ? 'active' : ''}>
            รายการที่ยังไม่ได้รับ
          </button>
          <button onClick={() => setActiveTab('inProgress')} className={activeTab === 'inProgress' ? 'active' : ''}>
            รายการกำลังเช่า
          </button>
          <button onClick={() => setActiveTab('returned')} className={activeTab === 'returned' ? 'active' : ''}>
            รายการที่คืนแล้ว
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

                {activeTab === 'notReceived' && rental.lessor_shipped && !rental.renter_received && (
                  <button onClick={() => handleReceive(rental)}>ยืนยันการได้รับของ</button>
                )}

                {activeTab === 'inProgress' && rental.renter_received && !rental.renter_returned && (
                  <button onClick={() => handleReturn(rental.id)}>คืนหนังสือแล้ว</button>
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

export default RentHistory;

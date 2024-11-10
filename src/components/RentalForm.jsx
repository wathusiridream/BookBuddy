import React, { useState, useEffect } from 'react';
import '../WebStyle/RentalForm.css'; // Import CSS file
import { TextField, Card, CardContent, Typography } from '@mui/material';
import { IonIcon } from '@ionic/react';
import { personOutline, callOutline, arrowBack } from 'ionicons/icons';
import { db } from './../utils/firebase'; // Import Firestore
import { addDoc, collection, updateDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions
import { getAuth } from 'firebase/auth'; // Import getAuth
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';

function RentalForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the book ID from the URL
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [userId, setUserId] = useState(null); // State for the user ID
  const [book, setBook] = useState(null); // State for book details
  const [errorMessage, setErrorMessage] = useState('');
  const [days, setDays] = useState(1); // Initial days to 1

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid); // Set the user ID
    }

    // Fetch book details from Firestore
    const fetchBook = async () => {
      const bookDoc = doc(db, 'ForRents', id);
      const bookSnapshot = await getDoc(bookDoc);
      if (bookSnapshot.exists()) {
        setBook({ id: bookSnapshot.id, ...bookSnapshot.data() });
      } else {
        console.error("No such document!");
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid); // Set the user ID

      // Fetch user information from Firestore based on current user's email
      const fetchUserInfo = async () => {
        const userQuery = query(collection(db, 'UserInformation'), where('email', '==', currentUser.email));
        const userSnapshot = await getDocs(userQuery);
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data(); // Get the first matching user
          setFormData((prev) => ({
            ...prev,
            firstName: userData.firstname || '',
            lastName: userData.lastName || '',
            phone: userData.telephone || '',
          }));
        }
      };

      fetchUserInfo();
    }
  }, []);

  const calculateTotalRental = () => {
    return (book?.pricePerDay || 0) * days; // Use book price per day
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setErrorMessage('');
  
    const rentalData = {
      userId: userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      totalAmount: calculateTotalRental(), // Use total rental amount
      days: days,
      nameRented: book?.bookName, // Use the book name from Firestore
      paymentStatus: 'ยังไม่ได้ชำระเงิน',
      bookId: id, // Add the book ID here
      renter_received: false, // เพิ่มตัวแปร renter_received
      renter_returned: false, // เพิ่มตัวแปร renter_returned
      lessor_shipped: false, // เพิ่มตัวแปร lessor_shipped
      lessor_received_return: false
    };
  
    try {
      const docRef = await addDoc(collection(db, 'rentals'), rentalData);
      await updateDoc(docRef, { rentalId: docRef.id });
  
      alert(`ฟอร์มถูกส่งเรียบร้อยแล้ว\nระยะเวลาที่เช่า: ${days} วัน\nค่าเช่าสุทธิ: ${calculateTotalRental()} บาท`);
  
      // Navigate to the QRCode component and pass the rentalId
      navigate('/QRCode', { state: { amount: calculateTotalRental(), rentalId: docRef.id, bookId: id } }); // Pass the bookId to the QRCode component
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDaysChange = (e) => {
    const value = Math.max(1, e.target.value); // Ensure days is at least 1
    setDays(value);
  };

  if (!book) {
    return <p className="loading-message">กำลังโหลดข้อมูลหนังสือ...</p>;
  }
  
  const handleBackButtonClick = () => {
    navigate(`/BooksDetail/${book.id}`);
  };

  return (
    <div style={{ backgroundColor: 'white' }}>
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
      >
        ย้อนกลับ
      </span>

      <h2 className="detailbook-title">แบบฟอร์มการเช่าหนังสือ</h2>
      <div className="rental-container">
        <div className="image-section">
          <h1>ชื่อหนังสือ : {book.bookName}</h1>
          <img src={book.coverbookimg} alt="Selected Product" className="product-image-large" />
          <Card className="info-card" variant="outlined">
            <CardContent>
              <Typography variant="h6">ข้อมูลผู้ปล่อยเช่า</Typography>
              <Typography>ชื่อ: {book.nameTitle} {book.firstname} {book.lastName}</Typography>
              <Typography>วันเกิด: {book.dateofBirth}</Typography>
              <Typography>โทรศัพท์: {book.telephone}</Typography>
              <Typography>หมายเลขประจำตัวประชาชน: {book.thaiID}</Typography>
            </CardContent>
          </Card>

          {/* Book Information Card */}
          <Card className="info-card" variant="outlined">
            <CardContent>
              <Typography variant="h6">ข้อมูลหนังสือ</Typography>
              <Typography>ชื่อหนังสือ: {book.bookName}</Typography>
              <Typography>ประเภท: {book.genre}</Typography>
              <Typography>ISBN: {book.isbn}</Typography>
              <Typography>ผู้แต่ง: {book.author}</Typography>
              <Typography>แนะนำ: {book.introduction}</Typography>
              <Typography>ราคาเช่าต่อวัน: {book.pricePerDay} บาท</Typography>
            </CardContent>
          </Card>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="rental-form">
            <h3>รายละเอียดการเช่า</h3>
            <div className="input-with-icon">
              <IonIcon icon={personOutline} />
              <TextField 
                label="ชื่อจริง" 
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                fullWidth
                disabled
              />
            </div>
            <div className="input-with-icon">
              <IonIcon icon={personOutline} />
              <TextField 
                label="นามสกุล" 
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                fullWidth
                disabled
              />
            </div>
            <div className="input-with-icon">
              <IonIcon icon={callOutline} />
              <TextField 
                label="เบอร์โทรศัพท์" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                fullWidth
                disabled
              />
            </div>

            {/* Spinbox for days */}
            <div className="input-with-icon">
              <label>จำนวนวันที่เช่า:</label>
              <input 
                type="number" 
                value={days} 
                onChange={handleDaysChange}
                min="1" // Set minimum value to 1
                style={{ width: '100%', padding: '8px', marginTop: '10px' }} 
              />
            </div>

            <div className="total-amount">
              <h3>ยอดรวมค่าเช่า: {calculateTotalRental()} บาท</h3>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" className="submit-button">ส่งข้อมูล</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RentalForm;
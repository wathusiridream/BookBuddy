import React, { useState, useEffect } from 'react';
import '../WebStyle/RentalForm.css'; // Import CSS file
import { TextField, FormControl, Select, MenuItem , Card , CardContent , Typography } from '@mui/material';
import { IonIcon } from '@ionic/react';
import { personOutline, callOutline , arrowBack } from 'ionicons/icons';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { db } from './../utils/firebase'; // Import Firestore
import { addDoc, collection, updateDoc, doc, getDoc , query , where , getDocs} from 'firebase/firestore'; // Import necessary Firestore functions
import { getAuth } from 'firebase/auth'; // Import getAuth
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from './NavBar';

// Add plugin
dayjs.extend(isSameOrBefore);

function RentalForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the book ID from the URL
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    rentalDate: dayjs(),
    returnDate: dayjs(),
  });
  const [userId, setUserId] = useState(null); // State for the user ID
  const [book, setBook] = useState(null); // State for book details
  const [errorMessage, setErrorMessage] = useState('');
  const [days, setDays] = useState(1);
  const shippingCost =  40 ;

  const today = dayjs();

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
  }
  )
  const calculateTotalRental = () => {
    return (book?.pricePerDay || 0) * days ; // Use book price per day
  };

  const calculateInsurance = () => {
    return calculateTotalRental() * 0.3; // Insurance cost 30%
  };

  const calculateFinalTotal = () => {
    return calculateTotalRental() + calculateInsurance() + shippingCost; // Total including insurance
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setErrorMessage('');
  
    const rentalData = {
      userId: userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      rentalDate: formData.rentalDate.toISOString(),
      returnDate: formData.returnDate.toISOString(),
      totalAmount: calculateFinalTotal(),
      days: days,
      nameRented: book?.bookName, // Use the book name from Firestore
      paymentStatus: 'not paid',
      returnStatus: 'not yet',
      bookId: id, // Add the book ID here
    };
  
    try {
      const docRef = await addDoc(collection(db, 'rentals'), rentalData);
      await updateDoc(docRef, { rentalId: docRef.id });
  
      alert(`ฟอร์มถูกส่งเรียบร้อยแล้ว\nระยะเวลาที่เช่า: ${days} วัน\nค่าจัดส่ง: ${shippingCost} บาท\nค่าเช่าสุทธิ: ${calculateFinalTotal()} บาท`);
  
      // Navigate to the QRCode component and pass the rentalId
      navigate('/QRCode', { state: { amount: calculateFinalTotal(), rentalId: docRef.id, bookId: id } }); // Pass the bookId to the QRCode component
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReturnDateChange = (newDate) => {
    setFormData({ ...formData, returnDate: newDate });
    if (formData.rentalDate && newDate) {
      const dayDifference = newDate.diff(dayjs(formData.rentalDate), 'day');
      setDays(dayDifference);
    }
  };

  if (!book) {
    return <p className="loading-message">กำลังโหลดข้อมูลหนังสือ...</p>;
  }
  
  const handleBackButtonClick = () => {
    navigate(`/BooksDetail/${book.id}`);
};
  return (
    <div style={{backgroundColor : 'white'}}>
      <NavBar/>
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
            <div className="input-with-icon">
              <h3>รายละเอียดการเช่า</h3>
              
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
                label="กรุณากรอกเบอร์โทร 10 หลัก"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required 
                pattern="[0-9]{10}"
                margin="normal" 
                variant="outlined" 
                fullWidth
                disabled
              />
            </div>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="วันที่เช่า"
                value={formData.rentalDate}
                onChange={(newDate) => setFormData({ ...formData, rentalDate: newDate })}
                minDate={today}
                renderInput={(params) => <TextField {...params} />}
                fullWidth
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="วันที่คืน"
                value={formData.returnDate}
                onChange={handleReturnDateChange}
                minDate={formData.rentalDate || today}
                renderInput={(params) => <TextField {...params} />}
                fullWidth
              />
            </LocalizationProvider>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
              <Typography>ระยะเวลาที่เช่า: {days} วัน</Typography>
            <p>ค่าเช่า: {calculateTotalRental()} บาท</p>
            {days > 0 && <p>ค่าประกัน: {calculateInsurance()} บาท</p>}
            {days > 0 && <p>ค่าจัดส่ง: {shippingCost} บาท</p>}
            <p>ค่าเช่าสุทธิ: {calculateFinalTotal()} บาท</p>
            <button type="submit" className="submit-button">ส่งฟอร์ม</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RentalForm;

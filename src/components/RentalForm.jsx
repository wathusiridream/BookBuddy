import React, { useState, useEffect } from 'react';
import '../WebStyle/RentalForm.css'; // Import CSS file
import { TextField, FormControl, Select, MenuItem } from '@mui/material';
import { IonIcon } from '@ionic/react';
import { personOutline, callOutline } from 'ionicons/icons';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { db } from './../utils/firebase'; // Import Firestore
import { addDoc, collection, updateDoc } from 'firebase/firestore'; // ตรวจสอบการนำเข้า
import { getAuth } from 'firebase/auth'; // Import getAuth
import { useNavigate } from 'react-router-dom';

// Add plugin
dayjs.extend(isSameOrBefore);

function RentalForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    rentalDate: dayjs(),
    returnDate: dayjs().add(1, 'day'),
    deliveryMethod: '',
  });
  const [userId, setUserId] = useState(null); // State for the user ID
  const [nameRented, setNameRented] = useState('Tanatad'); 
  const [errorMessage, setErrorMessage] = useState('');
  const [days, setDays] = useState(1);
  const [selectedImage, setSelectedImage] = useState('https://via.placeholder.com/300x400');
  const [quantity, setQuantity] = useState(1);
  const shippingCost = formData.deliveryMethod === 'ส่งทางไปรษณีย์' ? 40 : 0;
  const rentalPricePerDay = 1;

  const images = [
    'https://via.placeholder.com/300x400', 
    'https://via.placeholder.com/300x400/FF0000', 
    'https://via.placeholder.com/300x400/00FF00', 
    'https://via.placeholder.com/300x400/0000FF',
  ];

  const today = dayjs();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserId(currentUser.uid); // Set the user ID
    }
  }, []);

  const calculateTotalRental = () => {
    return (rentalPricePerDay * days * quantity);
  };

  const calculateInsurance = () => {
    return calculateTotalRental() * 0.3; // ค่าประกัน 30%
  };

  const calculateFinalTotal = () => {
    return calculateTotalRental() + calculateInsurance() + shippingCost; // รวมค่าประกัน
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rentalDate = dayjs(formData.rentalDate);
    const returnDate = dayjs(formData.returnDate);

    if (!formData.deliveryMethod) {
        setErrorMessage('กรุณาเลือกวิธีการรับสินค้า');
        return;
    }

    setErrorMessage('');

    const rentalData = {
        userId: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        rentalDate: rentalDate.toISOString(),
        returnDate: returnDate.toISOString(),
        deliveryMethod: formData.deliveryMethod,
        totalAmount: calculateFinalTotal(), // เปลี่ยนเป็นจำนวนสุทธิขั้นสุด
        quantity: quantity,
        days: days,
        nameRented: nameRented,
        paymentStatus: 'not paid', // กำหนดสถานะการชำระเงินเริ่มต้น
        returnStatus: 'not yet'
    };

    try {
        // เพิ่มเอกสารใหม่ใน Firestore
        const docRef = await addDoc(collection(db, 'rentals'), rentalData);

        // อัปเดตเอกสารด้วย document ID
        await updateDoc(docRef, { rentalId: docRef.id });

        // ส่ง rentalId และ amount ไปยัง CheckSlip
        alert(`ฟอร์มถูกส่งเรียบร้อยแล้ว\nระยะเวลาที่เช่า: ${days} วัน\nวิธีการรับสินค้า: ${formData.deliveryMethod}\nค่าจัดส่ง: ${shippingCost} บาท\nจำนวนสุทธิขั้นสุด: ${calculateFinalTotal()} บาท`);
        navigate('/QRCode', { state: { amount: calculateFinalTotal(), rentalId: docRef.id } });
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateDays = (startDate, endDate) => {
    return endDate.diff(startDate, 'day');
  };

  const handleReturnDateChange = (newDate) => {
    setFormData({ ...formData, returnDate: newDate });

    if (formData.rentalDate && newDate) {
      const dayDifference = calculateDays(dayjs(formData.rentalDate), newDate);
      setDays(dayDifference);
    }
  };

  return (
    <div className="rentcontainer">
      <h2>แบบฟอร์มการเช่าสินค้า</h2>
      <div className="rental-container">
        <div className="image-section">
          <img 
            src={selectedImage} 
            alt="Selected Product" 
            className="product-image-large"
          />
          <div className="thumbnail-section">
            {images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Thumbnail ${index}`} 
                className={`thumbnail ${selectedImage === image ? 'selected' : ''}`} 
                onClick={() => setSelectedImage(image)} 
              />
            ))}
          </div>

          <div className="rental-info">
            <p>ชื่อผู้ปล่อยเช่า: {nameRented}</p>
            <p>ราคาเช่าต่อวัน: {rentalPricePerDay} บาท</p>
            <p>จำนวนชิ้นที่เช่า: {quantity} ชิ้น</p>
            <p>รวมจำนวนวันที่เช่า: {days} วัน</p>
            <p>จำนวนค่าเช่ารวม: {calculateTotalRental()} บาท</p> {/* แสดงจำนวนค่าเช่ารวม */}
          </div>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="rental-form">
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

            <FormControl fullWidth margin="normal">
              <Select
                value={formData.deliveryMethod}
                onChange={handleChange}
                displayEmpty
                name="deliveryMethod"
                fullWidth
              >
                <MenuItem value="" disabled>
                  เลือกวิธีการรับสินค้า
                </MenuItem>
                <MenuItem value="นัดรับ">นัดรับ</MenuItem>
                <MenuItem value="ส่งทางไปรษณีย์">ส่งทางไปรษณีย์</MenuItem>
              </Select>
            </FormControl>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {days > 0 && <p>รวมค่าจัดส่ง: {shippingCost} บาท</p>}
            {days > 0 && <p>ค่าประกัน: {calculateInsurance()} บาท</p>}
            <p>จำนวนค่าเช่ารวม: {calculateTotalRental()} บาท</p>
            <p>จำนวนสุทธิขั้นสุด: {calculateFinalTotal()} บาท</p>

            <button type="submit">ส่งแบบฟอร์ม</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RentalForm;

import React, { useState } from 'react';
import '../WebStyle/CheckSlip.css';
import { db, storage } from './../utils/firebase'; // Import Firestore and Storage
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

function CheckSlip() {
  const location = useLocation();
  const { amount, rentalId } = location.state || {}; // ดึงค่า amount และ rentalId
  const navigate = useNavigate();
  const [files, setFiles] = useState(null);
  const [slipOkData, setSlipOkData] = useState(null);
  const [message, setMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('not paid');

  const handleFileChange = (e) => {
    setFiles(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files) {
      setMessage('กรุณาอัปโหลดไฟล์ก่อนส่งข้อมูล');
      return;
    }
  
    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `slips/${rentalId}/${files.name}`);
      await uploadBytes(storageRef, files);
      const fileURL = await getDownloadURL(storageRef);
  
      // Call the external API to check the slip
      const formData = new FormData();
      formData.append("files", files);
  
      const res = await fetch("https://api.slipok.com/api/line/apikey/31011", {
        method: "POST",
        headers: {
          "x-authorization": "SLIPOK64TXGV0"
        },
        body: formData
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log("API Response Data:", data); // ตรวจสอบ API Response ทั้งหมด
        
        setSlipOkData(data.data);
        setMessage('อัปโหลดสลิปสำเร็จ!');
  
        if (data.data?.success === true) {
          const rentalRef = doc(db, 'rentals', rentalId);
          const rentalSnap = await getDoc(rentalRef);
          const totalAmount = rentalSnap.data()?.totalAmount;
  
          const apiAmount = data.data?.amount;
          const apiTelephone = data.data?.receiver.proxy.value; // ตรวจสอบว่า field นี้มีอยู่จริงไหม
  
          console.log(`API Amount: ${apiAmount}, API Telephone: ${apiTelephone}`);
  
          // ดึงค่า promptpayNumber จาก Firestore
          const bookRef = doc(db, 'ForRents', rentalId);
          const bookSnap = await getDoc(bookRef);
          const promptpayNumber = bookSnap.data()?.promptpayNumber;
  
          console.log(`Firestore PromptPay Number: ${promptpayNumber}`);
  
          // ตรวจสอบจำนวนเงินและหมายเลข PromptPay
          if (apiAmount === totalAmount && apiTelephone === promptpayNumber) {
            await updateDoc(rentalRef, {
              paymentStatus: 'paid',
              slippaylessorUrl: fileURL,
              CheckSlip: true
            });
            setPaymentStatus('paid');
            setMessage('ชำระเงินเรียบร้อยแล้ว!');
          } else {
            await updateDoc(rentalRef, {
              paymentStatus: 'not paid',
              CheckSlip: false
            });
            setPaymentStatus('not paid');
            setMessage('จำนวนเงินไม่ตรงกัน หรือหมายเลข PromptPay ไม่ตรงกัน กรุณาตรวจสอบ');
          }
        } else {
          setPaymentStatus('not paid');
          setMessage('การตรวจสอบสลิปไม่สำเร็จ กรุณาตรวจสอบข้อมูลของคุณ');
        }
      } else {
        throw new Error("การส่งคำขอล้มเหลว");
      }
    } catch (error) {
      setMessage(`เกิดข้อผิดพลาดระหว่างการอัปโหลดสลิป: ${error.message}`);
    }
  };
  
  
  
  

  const handleBackButtonClick = () => {
    navigate('/');
  };

  return (
    <div>
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
      <div className="checkslip-container">
          <h2>ตรวจสอบการชำระเงิน</h2>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">ส่งสลิป</button>
          </form>
          {message && <p>{message}</p>}
          <p>สถานะการชำระเงิน: {paymentStatus}</p>
          <p>จำนวนเงินที่ต้องชำระ: {amount} บาท</p> {/* แสดงจำนวนเงินที่ต้องชำระ */}
      </div>
    </div>
  );
}

export default CheckSlip;

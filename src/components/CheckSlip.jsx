import React, { useState } from 'react';
import '../WebStyle/CheckSlip.css';
import { db } from './../utils/firebase'; // Import Firestore
import { doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions
import { storage } from './../utils/firebase'; // Import Firebase Storage
import { ref, uploadBytes } from 'firebase/storage'; // Import storage functions
import { useLocation , useNavigate } from 'react-router-dom'; // Import useLocation
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
      const storageRef = ref(storage, `slips/${rentalId}/${files.name}`); // Define the storage path
      await uploadBytes(storageRef, files); // Upload the file

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
        setSlipOkData(data.data);
        setMessage('อัปโหลดสลิปสำเร็จ!');

        // Update payment status based on response data
        if (data.data?.success === true) {
          setPaymentStatus('paid');
          const rentalRef = doc(db, 'rentals', rentalId); // ใช้ rentalId ที่ดึงมาจาก location.state
          await updateDoc(rentalRef, { paymentStatus: 'paid' });
        } else {
          setPaymentStatus('not paid');
        }
      } else {
        throw new Error("การส่งคำขอล้มเหลว");
      }
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดระหว่างการอัปโหลดสลิป');
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
          {slipOkData && (
            <div>
              <h3>ข้อมูลสลิป</h3>
              <pre>{JSON.stringify(slipOkData, null, 2)}</pre>
            </div>
          )}
          <p>จำนวนเงินที่ต้องชำระ: {amount} บาท</p> {/* แสดงจำนวนเงินที่ต้องชำระ */}
      </div>
    </div>
  );
}

export default CheckSlip;

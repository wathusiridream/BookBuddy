import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from './../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AdminNavBar from './AdminNavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const generatePayload = require('promptpay-qr');

function AdminQRCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, rentalId , promptpayNumber } = location.state || {};
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [lessorName, setLessorName] = useState("");

  useEffect(() => {
    const fetchPromptPayNumber = async () => {
      if (!rentalId) return;

      try {
        const rentalDocRef = doc(db, 'rentals', rentalId);
        const rentalDoc = await getDoc(rentalDocRef);

        if (rentalDoc.exists()) {
          const rentalData = rentalDoc.data();
          const bookId = rentalData.bookId;

          const forRentDocRef = doc(db, 'ForRents', bookId);
          const forRentDoc = await getDoc(forRentDocRef);

          if (forRentDoc.exists()) {
            const forRentData = forRentDoc.data();
            setPhoneNumber(forRentData.promptpayNumber);
            setLessorName(`${forRentData.nameTitle} ${forRentData.firstname} ${forRentData.lastName}`);

            // Log promptpayNumber ที่ได้จาก Firestore
            console.log("PromptPay Number:", forRentData.promptpayNumber);
          } else {
            console.log("ไม่พบเอกสารที่ตรงกับ bookId นี้");
          }
        } else {
          console.log("ไม่พบเอกสารการเช่านี้");
        }
      } catch (error) {
        console.error("ข้อผิดพลาดในการดึง promptpayNumber:", error);
      }
    };

    fetchPromptPayNumber();
  }, [rentalId]);

  useEffect(() => {
    if (amount > 0) {
      handleQR();
    }
  }, [amount, phoneNumber]);

  function handleQR() {
    const qrData = generatePayload(phoneNumber, { amount });
    setQrCode(qrData);
    setTimeLeft(180);

    // Log totalAmount ที่ใช้สร้าง QR Code
    console.log("Total Amount for QR Code:", amount);
    console.log("rentalId : " , rentalId) 
  }

  useEffect(() => {
    let timer;
    if (qrCode && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      window.location.reload();
    }

    return () => clearInterval(timer);
  }, [qrCode, timeLeft]);

  function handleConfirm() {  
    console.log("Sending PromptPay Number:", phoneNumber); // เพิ่มบรรทัดนี้
    navigate('/AdminCheckSlip', { state: { amount, promptpayNumber: phoneNumber, rentalId } });
  }

  const handleBackButtonClick = () => {
    navigate('/AdminRentaltoPay');
  };

  return (
    <div style={{backgroundColor : 'white'}}>
      <AdminNavBar/>
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
      <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px'}}>
        <h1>ชำระเงิน</h1>
        <h2>จำนวนเงิน : {amount} บาท</h2>
        {lessorName && <h3>ผู้ปล่อยเช่า : {lessorName}</h3>} {/* Display lessor's name */}
        
        
        {qrCode && (
          <div className="timer">
            <p>กรุณาชำระภายใน {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} นาที</p>
          </div>
        )}
        {qrCode && (
          <div className="qr-section">
            <div className="qr-code">
              <QRCodeCanvas value={qrCode} size={200} />
            </div>
          </div>
        )}
        {<input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)} // Update phoneNumber on input change
          placeholder="หมายเลขพร้อมเพย์"
          disabled
          style={{ height: '0px' , backgroundColor : 'white' , color : 'white' ,  }} 
        />}
        {
          <p>
            กรุณาทำตามขั้นตอนที่แนะนำ <br/>
              1. แคปภาพหน้าจอ<br/>
              2. เปิดแอปพลิเคชันธนาคารบนอุปกรณ์ของท่าน<br/>
              3. เลือกไปที่ปุ่ม “สแกน” หรือ “QR Code” และกดที่ “รูปภาพ”<br/>
              4. เลือกรูปภาพที่ท่านแคปไว้และทำการชำระเงิน <br/>
              5. หลังจากชำระเงินเสร็จสิ้น กรุณากลับไปตรวจสอบสถานะการชำระเงินในแอป หากสถานะยังไม่มีการอัปเดต กรุณาติดต่อฝ่ายลูกค้าสัมพันธ์<br/>
              6. อย่าลืมบันทึกหลักฐานการโอนด้วยค่ะ <br/>
              หมายเหตุ: ช่องทางชำระเงินพร้อมเพย์ใช้ได้กับแอปพลิเคชันธนาคารเท่านั้น 
              ไม่สามารถชำระผ่านสาขาธนาคารหรือตู้เอทีเอ็ม

          </p>
        }
        <button onClick={handleConfirm} className="confirm-button">
          ชำระแล้ว
        </button>
      </div>
    </div>
  );
}

export default AdminQRCode;

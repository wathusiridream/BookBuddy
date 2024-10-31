import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from './../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const generatePayload = require('promptpay-qr');

function AdminQRCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, rentalId } = location.state || {};
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

  function handleQR() {
    setQrCode(generatePayload(phoneNumber, { amount }));
    setTimeLeft(180);
  }

  useEffect(() => {
    if (amount > 0) {
      handleQR();
    }
  }, [amount, phoneNumber]);

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
    navigate('/CheckSlip', { state: { amount, rentalId } });
  }

  const handleBackButtonClick = () => {
    navigate('/home');
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
        <h1>ชำระเงิน</h1>
        <h2>จำนวนเงิน : {amount} บาท</h2>
        {lessorName && <h3>ผู้ปล่อยเช่า : {lessorName}</h3>}
        
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
        <button onClick={handleConfirm} className="confirm-button">
          ชำระแล้ว
        </button>
      </div>
    </div>
  );
}

export default AdminQRCode;

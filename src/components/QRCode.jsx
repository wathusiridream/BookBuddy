import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from './../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
const generatePayload = require('promptpay-qr');

function QRCode() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const initialAmount = location.state?.amount || 0; // Get amount from location state
  const [phoneNumber, setPhoneNumber] = useState("0972311067");
  const [qrCode, setQrCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const { amount, rentalId } = location.state || {}; // ดึงค่า amount และ rentalId

  function handlePhoneNumber(e) {
    setPhoneNumber(e.target.value);
  }

  function handleQR() {
    setQrCode(generatePayload(phoneNumber, { amount }));
    setTimeLeft(180); // Reset countdown to 3 minutes
  }

  useEffect(() => {
    if (amount > 0) {
      handleQR(); // Generate QR code when amount is available
    }
  }, [amount]);

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

  // Function to handle navigation to CheckSlip
  function handleConfirm() {
    // ใช้ rentalId ที่ได้จาก location.state แทน docRef.id
    navigate('/CheckSlip', { state: { amount, rentalId } }); 
  }

  return (
    <div className="container">
      <div className="card">
        <h1>โอนเงิน</h1>
        <p>จำนวนเงิน: {amount} บาท</p>
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneNumber}
          placeholder="หมายเลขโทรศัพท์"
        />
        {qrCode && (
          <div className="timer">
            <p>กรุณาโอนภายใน {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} นาที</p>
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
          ตกลง
        </button>
      </div>
    </div>
  );
}

export default QRCode;

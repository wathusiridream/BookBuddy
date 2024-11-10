import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import generatePayload from 'promptpay-qr';
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

function QRCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount = 0, rentalId } = location.state || {};
  const [qrCode, setQrCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  
  // Define the PromptPay number
  const promptpayNumber = '0972311067';

  useEffect(() => {
    if (amount > 0) {
      // Generate QR code payload for the specified amount
      try {
        const payload = generatePayload(promptpayNumber, { amount });
        setQrCode(payload);
        setTimeLeft(180); // Reset the timer
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    }
  }, [amount]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      
      // Clear the interval on unmount or when timeLeft changes
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      // Reload the page if time expires
      window.location.reload();
    }
  }, [timeLeft]);

  const handleConfirm = () => {
    navigate('/CheckSlip', { state: { amount, rentalId, promptpayNumber } });
  };

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
      <span className="back-text" onClick={handleBackButtonClick}>
        ย้อนกลับ
      </span>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
        <h1>ชำระเงิน</h1>
        <h2>จำนวนเงิน : {amount} บาท</h2>
        <h2>ชื่อบัญชี : นายปาระมี สุขแก้ว (บัญชีบริษัท BookBuddy)</h2>
        {qrCode && (
          <>
            <div className="timer">
              <p>กรุณาชำระภายใน {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} นาที</p>
            </div>

            <div className="qr-section">
              <QRCodeCanvas value={qrCode} size={200} />
            </div>

            <input
              type="text"
              value={promptpayNumber}
              readOnly
              style={{ height: '0px', backgroundColor: 'white', color: 'white' }}
            />
            <p>
              กรุณาทำตามขั้นตอนที่แนะนำ <br />
              1. แคปภาพหน้าจอ<br />
              2. เปิดแอปพลิเคชันธนาคารบนอุปกรณ์ของท่าน<br />
              3. เลือกไปที่ปุ่ม “สแกน” หรือ “QR Code” และกดที่ “รูปภาพ”<br />
              4. เลือกรูปภาพที่ท่านแคปไว้และทำการชำระเงิน <br />
              5. หลังจากชำระเงินเสร็จสิ้น กรุณากลับไปตรวจสอบสถานะการชำระเงินในแอป หากสถานะยังไม่มีการอัปเดต กรุณาติดต่อฝ่ายลูกค้าสัมพันธ์<br />
              6. อย่าลืมบันทึกหลักฐานการโอนด้วยค่ะ <br />
              หมายเหตุ: ช่องทางชำระเงินพร้อมเพย์ใช้ได้กับแอปพลิเคชันธนาคารเท่านั้น
              ไม่สามารถชำระผ่านสาขาธนาคารหรือตู้เอทีเอ็ม
            </p>
            <button onClick={handleConfirm} className="confirm-button">
              ชำระแล้ว
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default QRCode;

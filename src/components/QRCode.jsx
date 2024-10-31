import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from './../utils/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const generatePayload = require('promptpay-qr');

function QRCode() {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const initialAmount = location.state?.amount || 0; // Get amount from location state
  const [phoneNumber, setPhoneNumber] = useState(""); // Initial phoneNumber state
  const [qrCode, setQrCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const { amount, rentalId , promptpayNumber} = location.state || {}; // Get amount and rentalId from location.state
  const [lessorName, setLessorName] = useState(""); // State for lessor's name
 
  useEffect(() => {
    const fetchPromptPayNumber = async () => {
      if (!rentalId) return; // Exit if rentalId is not available
  
      try {
        // Fetch the rental document using rentalId
        const rentalDocRef = doc(db, 'rentals', rentalId);
        const rentalDoc = await getDoc(rentalDocRef);
  
        if (rentalDoc.exists()) {
          const rentalData = rentalDoc.data();
          console.log("Rental Data:", rentalData); // Log rental data
          const bookId = rentalData.bookId; // Get bookId from rental data
          console.log("Book ID:", bookId); // Log bookId
  
          // Fetch the document from ForRents collection using bookId as document ID
          const forRentDocRef = doc(db, 'ForRents', bookId);
          console.log(forRentDocRef)
          const forRentDoc = await getDoc(forRentDocRef);
  
          if (forRentDoc.exists()) {
            const forRentData = forRentDoc.data();
            console.log("Found ForRents Document:", forRentData); // Log found document data
            setPhoneNumber(forRentData.promptpayNumber); // Set phoneNumber to promptpayNumber from ForRents
            setLessorName(`${forRentData.nameTitle} ${forRentData.firstname} ${forRentData.lastName}`);
            
          } else {
            console.log("No matching document found for the provided bookId.");
          }
        } else {
          console.log("Rental document not found.");
        }
      } catch (error) {
        console.error("Error fetching promptpayNumber: ", error);
      }
    };
  
    fetchPromptPayNumber();
  }, [rentalId]); // Run when rentalId changes

  function handleQR() {
    setQrCode(generatePayload(phoneNumber, { amount }));
    setTimeLeft(180); // Reset countdown to 3 minutes
  }

  useEffect(() => {
    if (amount > 0) {
      handleQR(); // Generate QR code when amount is available
    }
  }, [amount, phoneNumber]); // Include phoneNumber to regenerate QR code if it changes

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
    navigate('/CheckSlip', { state: { amount, rentalId , promptpayNumber: phoneNumber } }); 
  }

  const handleBackButtonClick = () => {
    navigate('/home');
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
        <button onClick={handleConfirm} className="confirm-button">
          ชำระแล้ว
        </button>
      </div>
    </div>
  );
}

export default QRCode;

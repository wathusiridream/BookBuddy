import React, { useState, useEffect } from 'react';
import '../WebStyle/CheckSlip.css';
import { db, storage } from './../utils/firebase'; // Import Firestore and Storage
import { doc, updateDoc, getDoc , setDoc , Timestamp } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import AdminNavBar from './AdminNavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

function AdminCheckSlip() {
    const location = useLocation();
    const { amount, rentalId, promptpayNumber } = location.state || {}; 
console.log("rentalId : " , rentalId)
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
    
            const res = await fetch("https://api.slipok.com/api/line/apikey/33075", {
                method: "POST",
                headers: {
                    "x-authorization": "SLIPOK7K2C7YI"
                },
                body: formData
            });
    
            if (res.ok) {
                const data = await res.json();
                console.log("API Response Data:", data);
    
                setSlipOkData(data.data);
                setMessage('กำลังตรวจสอบลสิป โปรดรอสักครู่');
    
                if (data.data?.success === true) {
                    const rentalRef = doc(db, 'rentals', rentalId);
                    const rentalSnap = await getDoc(rentalRef);
                    const totalAmount = rentalSnap.data()?.totalAmount;
    
                    const apiAmount = data.data?.amount;
                    const apiTelephone = data.data?.receiver.proxy.value;
    
                    console.log(`API Amount: ${apiAmount}, API Telephone: ${apiTelephone}`);
                    const apiLastFour = apiTelephone.slice(-4);
                    const promptpayLastFour = promptpayNumber.split('-').pop();
                    console.log(`API Last Four: ${apiLastFour}, Firestore Last Four: ${promptpayLastFour}`);
                   
                    console.log(rentalId); // แสดงค่า rentalId ในคอนโซล
                  
                    const adminPayRef = doc(db, 'adminpay', rentalId);
                    const adminPaySnap = await getDoc(adminPayRef);
    
                    // ตรวจสอบว่ามีเอกสารใน adminpay หรือไม่ ถ้าไม่มีให้สร้างใหม่
                    if (!adminPaySnap.exists()) {
                        await setDoc(adminPayRef, {
                            rentalsId: rentalId,
                            paymentStatus: false,
                            adminEmail: '', // กำหนดค่าเริ่มต้น
                            adminName: '', // กำหนดค่าเริ่มต้น
                            dateTimePay: Timestamp.now(),
                            CheckSlip: false
                        });
                        console.log("เอกสาร adminpay ถูกสร้างขึ้นใหม่");
                    }
    
                    // ตรวจสอบจำนวนเงินและหมายเลข PromptPay
                    if (apiAmount !== totalAmount) {
                        await updateDoc(adminPayRef, {
                            paymentStatus: false,
                            CheckSlip: false
                        });
                        setPaymentStatus('not paid');
                        setMessage('จำนวนเงินไม่ตรงกัน กรุณาตรวจสอบสลิป');
                    
                    } else if (apiLastFour !== promptpayLastFour) {
                        await updateDoc(adminPayRef, {
                            paymentStatus: false,
                            CheckSlip: false
                        });
                        setPaymentStatus('not paid');
                        setMessage('หมายเลข PromptPay ไม่ตรงกัน กรุณาตรวจสอบสลิป');
                    } else {
                        await updateDoc(adminPayRef, {
                            paymentStatus: true,
                            slippaylessorUrl: fileURL,
                            CheckSlip: true
                        });
                        setPaymentStatus('paid');
                        setMessage('ชำระเงินเรียบร้อยแล้ว!');
                    }
                    
                } else {
                    setPaymentStatus(false);
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
        navigate('/AdminQRCode');
    };

    const promptpayLastFour = promptpayNumber.split('-').pop(); // ใช้ split เพื่อดึงหมายเลขหลัง '-'
    return (
        <div>
            <AdminNavBar />
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
                <p>{promptpayNumber} {promptpayLastFour}</p>
                <p>รหัสการเช่าที่ต้องตรวจสอบ: {rentalId}</p> {/* เพิ่มบรรทัดนี้เพื่อแสดง rentalId */}

            </div>
        </div>
    );
}

export default AdminCheckSlip;

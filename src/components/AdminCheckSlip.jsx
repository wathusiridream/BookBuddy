import React, { useState } from 'react';
import '../WebStyle/CheckSlip.css';
import { db, storage } from './../utils/firebase';
import { doc, updateDoc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminNavBar from './AdminNavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCheckSlip() {
    const location = useLocation();
    const { amount, rentalId, promptpayNumber } = location.state || {};
    const navigate = useNavigate();
    const [files, setFiles] = useState(null);
    const [slipOkData, setSlipOkData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('not paid');
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) { // Validate file type
            setFiles(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error('กรุณาเลือกไฟล์ภาพเท่านั้น'); // Error message for invalid file type
            setFiles(null);
            setPreview(null); // Reset preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!files) {
            toast.error('กรุณาอัปโหลดไฟล์ก่อนส่งข้อมูล');
            return;
        }

        setLoading(true); // Set loading state
        try {
            const storageRef = ref(storage, `slips/${rentalId}/${files.name}`);
            await uploadBytes(storageRef, files);
            const fileURL = await getDownloadURL(storageRef);

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
                setSlipOkData(data.data);
                toast.info('กำลังตรวจสอบลสิป โปรดรอสักครู่');

                if (data.data?.success) {
                    const rentalRef = doc(db, 'rentals', rentalId);
                    const rentalSnap = await getDoc(rentalRef);
                    const totalAmount = rentalSnap.data()?.totalAmount;

                    const apiAmount = data.data?.amount;
                    const apiTelephone = data.data?.receiver.proxy.value;
                    const apiLastFour = apiTelephone.slice(-4);
                    const promptpayLastFour = promptpayNumber.split('-').pop();

                    const adminPayRef = doc(db, 'adminpay', rentalId);
                    const adminPaySnap = await getDoc(adminPayRef);

                    // Create adminPay document if it doesn't exist
                    if (!adminPaySnap.exists()) {
                        await setDoc(adminPayRef, {
                            rentalsId: rentalId,
                            paymentStatus: false,
                            adminEmail: '',
                            adminName: '',
                            dateTimePay: Timestamp.now(),
                            CheckSlip: false
                        });
                    }

                    // Validate payment amounts and PromptPay number
                    if (apiAmount !== totalAmount) {
                        await updateDoc(adminPayRef, {
                            paymentStatus: false,
                            CheckSlip: false
                        });
                        setPaymentStatus('not paid');
                        toast.error('จำนวนเงินไม่ตรงกัน กรุณาตรวจสอบสลิป');
                    } else if (apiLastFour !== promptpayLastFour) {
                        await updateDoc(adminPayRef, {
                            paymentStatus: false,
                            CheckSlip: false
                        });
                        setPaymentStatus('not paid');
                        toast.error('หมายเลข PromptPay ไม่ตรงกัน กรุณาตรวจสอบสลิป');
                    } else {
                        await updateDoc(adminPayRef, {
                            paymentStatus: true,
                            slippaylessorUrl: fileURL,
                            CheckSlip: true
                        });
                        setPaymentStatus('paid');
                        toast.success('ชำระเงินเรียบร้อยแล้ว!');

                        setTimeout(() => {
                            navigate('/AdminRentaltoPay');
                        }, 3000);
                    }
                } else {
                    setPaymentStatus(false);
                    toast.error('การตรวจสอบสลิปไม่สำเร็จ กรุณาตรวจสอบข้อมูลของคุณ');
                }
            } else {
                throw new Error("การส่งคำขอล้มเหลว");
            }
        } catch (error) {
            toast.error(`เกิดข้อผิดพลาดระหว่างการอัปโหลดสลิป: ${error.message}`);
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleBackButtonClick = () => {
        navigate('/AdminQRCode');
    };

    const promptpayLastFour = promptpayNumber.split('-').pop();

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
                    {preview && <img src={preview} alt="Selected file preview" className="file-preview" />}
                    <button type="submit" disabled={loading}>{loading ? 'กำลังส่ง...' : 'บันทึก'}</button>
                </form>
            </div>
            <ToastContainer position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"/>
        </div>
    );
}

export default AdminCheckSlip;

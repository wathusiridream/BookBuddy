import React, { useState } from 'react';
import '../WebStyle/CheckSlip.css';
import { db, storage } from './../utils/firebase'; // Import Firestore and Storage
import { doc, updateDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import storage functions
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { toast, ToastContainer } from 'react-toastify'; // เพิ่มการนำเข้า ToastContainer
import 'react-toastify/dist/ReactToastify.css';

function CheckSlip() {
  const location = useLocation();
  const { amount, rentalId, promptpayNumber } = location.state || {}; // Extract amount and rentalId

  const navigate = useNavigate();
  const [files, setFiles] = useState(null);
  const [slipOkData, setSlipOkData] = useState(null);
  const [previewURL, setPreviewURL] = useState(null); // State for image preview
  const [paymentStatus, setPaymentStatus] = useState('not paid');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFiles(selectedFile);

    // Create a preview URL for the selected file
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
      setPreviewURL(objectURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files) {
        toast.error('กรุณาอัปโหลดไฟล์ก่อนส่งข้อมูล');
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
            toast.info('กำลังตรวจสอบสลิป โปรดรอสักครู่');

            if (data.data?.success === true) {
                const rentalRef = doc(db, 'rentals', rentalId);
                const rentalSnap = await getDoc(rentalRef);
                const totalAmount = rentalSnap.data()?.totalAmount;

                const apiAmount = data.data?.amount;
                const apiTelephone = data.data?.receiver.proxy.value;

                const apiLastFour = apiTelephone.slice(-4); // ใช้ slice เพื่อดึง 4 ตัวสุดท้าย
                const promptpayLastFour = promptpayNumber.split('-').pop(); // ใช้ split เพื่อดึงหมายเลขหลัง '-'

                // ตรวจสอบจำนวนเงินและหมายเลข PromptPay
                if (apiAmount !== totalAmount) {
                    await updateDoc(rentalRef, {
                        paymentStatus: 'ยังไม่ได้ชำระเงิน',
                        CheckSlip: false
                    });
                    setPaymentStatus('ยังไม่ได้ชำระเงิน');
                    toast.error('จำนวนเงินไม่ตรงกัน กรุณาตรวจสอบสลิป');

                } else if (apiLastFour !== promptpayLastFour) {
                    await updateDoc(rentalRef, {
                        paymentStatus: 'ยังไม่ได้ชำระเงิน',
                        CheckSlip: false
                    });
                    setPaymentStatus('ยังไม่ได้ชำระเงิน');
                    toast.error('หมายเลข PromptPay ไม่ตรงกัน กรุณาตรวจสอบสลิป');
                } else {
                    await updateDoc(rentalRef, {
                        paymentStatus: 'ชำระเงินเรียบร้อย',
                        slippaylessorUrl: fileURL,
                        CheckSlip: true
                    });
                    setPaymentStatus('ชำระเงินเรียบร้อย');
                    toast.success('ชำระเงินเรียบร้อยแล้ว!');

                    // ใช้ setTimeout เพื่อรอให้ Toast หายไปก่อนที่จะนำทาง
                    // ใช้ setTimeout เพื่อรอให้ Toast หายไปก่อนที่จะนำทาง
                    setTimeout(() => {
                      navigate('/'); // กลับไปที่หน้า Home
                    }, 8000); // 8000ms = 8 วินาที
                    // 5000ms = 5 วินาที
                  }
            } else {
                setPaymentStatus('not paid');
                toast.error('การตรวจสอบสลิปไม่สำเร็จ กรุณาตรวจสอบข้อมูลของคุณ');
            }
        } else {
            throw new Error("การส่งคำขอล้มเหลว");
        }
    } catch (error) {
        toast.error(`เกิดข้อผิดพลาดระหว่างการอัปโหลดสลิป: ${error.message}`);
    }
};



  const handleBackButtonClick = () => {
    navigate('/');
  };

  return (
    <div>
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
      >ย้อนกลับ
      </span>
      <div className="checkslip-container">
        <h2>บันทึกหลักฐานการชำระเงิน</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          {previewURL && <img src={previewURL} alt="Selected file preview" className="file-preview" />} {/* Preview Image */}
          <button type="submit">ส่งสลิป</button>
        </form>
        
      </div>
      <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
    </div>
  );
}

export default CheckSlip;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';

function ReturnDetails() {
  const { rentalId } = useParams(); // รับ rentalId จาก URL
  const [rentalDetail, setRentalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate(); // สร้างตัวแปร navigate

  useEffect(() => {
    const fetchRentalDetail = async () => {
      try {
        const rentalRef = doc(db, 'rentals', rentalId);
        const rentalSnapshot = await getDoc(rentalRef);
        
        if (rentalSnapshot.exists()) {
          const rentalData = rentalSnapshot.data();
          setRentalDetail(rentalData);

          // หากมีภาพให้ดึง URL
          if (rentalData.returnImage) { // เปลี่ยนเป็น returnImage
            const storage = getStorage();
            const imageRef = ref(storage, `return-images/${rentalId}`); // เปลี่ยนชื่อโฟลเดอร์เป็น return-images
            const imageUrl = await getDownloadURL(imageRef);
            setRentalDetail((prev) => ({ ...prev, returnImage: imageUrl })); // เปลี่ยนเป็น returnImage
          }
        } else {
          alert('ไม่พบข้อมูลการเช่า');
        }
      } catch (error) {
        console.error('Error fetching rental detail:', error);
        alert('เกิดข้อผิดพลาดในการดึงข้อมูล');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalDetail();
  }, [rentalId]);

  const handleImageUpload = async () => {
    if (!imageFile) {
      alert('กรุณาเลือกไฟล์ภาพก่อน');
      return;
    }
    
    const storage = getStorage();
    const imageRef = ref(storage, `return-images/${rentalId}`); // เปลี่ยนชื่อโฟลเดอร์เป็น return-images

    try {
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, { returnImage: imageUrl }); // เปลี่ยนเป็น returnImage

      setRentalDetail((prev) => ({ ...prev, returnImage: imageUrl })); // เปลี่ยนเป็น returnImage
      alert('อัปโหลดภาพสำเร็จ!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดภาพ');
    }
  };

  const handleReturn = async () => {
    try {
      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, { returnStatus: 'yes' });
      alert('คืนของสำเร็จ!');
      navigate(-1); // ย้อนกลับไปยังหน้าก่อนหน้า
    } catch (error) {
      console.error('Error updating return status:', error);
      alert('เกิดข้อผิดพลาดในการคืนของ');
    }
  };

  const handleBack = () => {
    navigate(-1); // ย้อนกลับไปยังหน้าก่อนหน้า
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="receive-details-container">
      <h2>รายละเอียดการคืนสินค้า</h2>
      {rentalDetail ? (
        <div className="details">
          <img src={rentalDetail.returnImage} alt={rentalDetail.productName} className="rental-image" /> {/* เปลี่ยนเป็น returnImage */}
          <h3>{rentalDetail.productName}</h3>
          <p>ชื่อ: {rentalDetail.firstName} {rentalDetail.lastName}</p>
          <p>จำนวน: {rentalDetail.quantity}</p>
          <p>ราคาเช่าต่อวัน: {rentalDetail.rentalPrice} บาท</p>
          <p>รวมราคา: {rentalDetail.totalAmount} บาท</p>
          <p>สถานะการชำระเงิน: {rentalDetail.paymentStatus}</p>
          <p>สถานะการได้รับของ: {rentalDetail.receivedStatus || 'รอจัดส่ง'}</p>
          <p>สถานะการคืนของ: {rentalDetail.returnStatus || 'รอคืนของ'}</p>

          {/* ปุ่มสำหรับอัปโหลดรูปภาพ */}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          <button onClick={handleImageUpload}>อัปโหลดรูปภาพ</button>
          
          {/* ปุ่มสำหรับยืนยันการคืนของ */}
          <button onClick={handleReturn}>ยืนยันการคืนของ</button>

          {/* ปุ่มสำหรับย้อนกลับไปหน้าก่อนหน้า */}
          <button onClick={handleBack}>ย้อนกลับ</button>
        </div>
      ) : (
        <p>ไม่มีข้อมูลที่จะแสดง</p>
      )}
    </div>
  );
}

export default ReturnDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';

function ReceiveDetails() {
  const { rentalId } = useParams(); // รับ rentalId จาก URL
  const navigate = useNavigate(); // สร้างตัวแปร navigate
  const [rentalDetail, setRentalDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null); // สำหรับไฟล์ภาพที่อัปโหลด

  useEffect(() => {
    const fetchRentalDetail = async () => {
      try {
        const rentalRef = doc(db, 'rentals', rentalId);
        const rentalSnapshot = await getDoc(rentalRef);
        
        if (rentalSnapshot.exists()) {
          const rentalData = rentalSnapshot.data();
          setRentalDetail(rentalData);

          // หากมีภาพให้ดึง URL
          if (rentalData.receiveImage) { // เปลี่ยนเป็น receiveImage
            const storage = getStorage();
            const imageRef = ref(storage, `receive-images/${rentalId}`); // เปลี่ยนเป็น receive-images
            const imageUrl = await getDownloadURL(imageRef);
            setRentalDetail((prev) => ({ ...prev, receiveImage: imageUrl })); // เปลี่ยนเป็น receiveImage
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
    const imageRef = ref(storage, `receive-images/${rentalId}`); // เปลี่ยนเป็น receive-images

    try {
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, { receiveImage: imageUrl }); // เปลี่ยนเป็น receiveImage

      setRentalDetail((prev) => ({ ...prev, receiveImage: imageUrl })); // เปลี่ยนเป็น receiveImage
      alert('อัปโหลดภาพสำเร็จ!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดภาพ');
    }
  };

  const handleReceive = async () => {
    try {
      const rentalRef = doc(db, 'rentals', rentalId);
      await updateDoc(rentalRef, { receivedStatus: 'received', returnStatus: 'not yet' });
      alert('ยืนยันการได้รับของสำเร็จ!');

      // กลับไปยังหน้าที่เรียกใช้งาน
      navigate(-1);
    } catch (error) {
      console.error('Error updating received status:', error);
      alert('เกิดข้อผิดพลาดในการยืนยันการได้รับของ');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="receive-details-container">
      <h2>รายละเอียดการรับสินค้า</h2>
      {rentalDetail ? (
        <div className="details">
          <img src={rentalDetail.receiveImage} alt={rentalDetail.productName} className="rental-image" /> {/* เปลี่ยนเป็น receiveImage */}
          <h3>{rentalDetail.productName}</h3>
          <p>ชื่อ: {rentalDetail.firstName} {rentalDetail.lastName}</p>
          <p>จำนวน: {rentalDetail.quantity}</p>
          <p>ราคาเช่าต่อวัน: {rentalDetail.rentalPrice} บาท</p>
          <p>รวมราคา: {rentalDetail.totalAmount} บาท</p>
          <p>สถานะการชำระเงิน: {rentalDetail.paymentStatus}</p>
          <p>สถานะการได้รับของ: {rentalDetail.receivedStatus || 'รอจัดส่ง'}</p>
          <p>สถานะการคืนของ: {rentalDetail.returnStatus || 'รอคืนของ'}</p>
          
          {/* ปุ่มสำหรับอัปโหลดรูปภาพ */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button onClick={handleImageUpload}>อัปโหลดรูปภาพ</button>
          <button onClick={handleReceive}>ยืนยันการได้รับของ</button>
        </div>
      ) : (
        <p>ไม่มีข้อมูลที่จะแสดง</p>
      )}
    </div>
  );
}

export default ReceiveDetails;

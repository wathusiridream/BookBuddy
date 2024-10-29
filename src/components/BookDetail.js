import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import '../WebStyle/BookDetail.css';
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState('');
    const [images, setImages] = useState([]);
    const auth = getAuth();
    const currentUser = auth.currentUser; 

    useEffect(() => {
        const fetchBook = async () => {
            const bookDoc = doc(db, 'ForRents', id);
            const bookSnapshot = await getDoc(bookDoc);
            if (bookSnapshot.exists()) {
                const bookData = { id: bookSnapshot.id, ...bookSnapshot.data() };
                setBook(bookData);

                if (bookData.coverbookimg && Array.isArray(bookData.coverbookimg)) {
                    setImages(bookData.coverbookimg);
                    setSelectedImage(bookData.coverbookimg[0]);
                }
            } else {
                console.error("ไม่พบเอกสารที่ต้องการ!");
            }
            setIsLoading(false);
        };

        fetchBook();
    }, [id]);

    if (isLoading) {
        return <p className="loading-message">กำลังโหลด...</p>;
    }

    if (!book) {
        return <p className="no-data-message">ไม่พบข้อมูลหนังสือ</p>;
    }

    const handleRentButtonClick = async () => {
        if (!currentUser) {
            console.error("ผู้ใช้ไม่ได้ลงชื่อเข้าใช้");
            return;
        }

        try {
            const userQuery = query(
                collection(db, "UserInformation"),
                where("email", "==", currentUser.email)
            );
            
            // Execute the query
            const querySnapshot = await getDocs(userQuery);
    
            if (!querySnapshot.empty) {
                // If a matching user document exists, navigate to the Rentals page
                navigate(`/Rentals/${book.id}`);
            } else {
                // If no matching user document is found, navigate to the UserInformationForm
                navigate(`/UserInformationForm/${book.id}`);
            }

        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูลผู้ใช้:", error);
        }
    };

    const handleBackButtonClick = () => {
        navigate('/ShowBooks');
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
            <h1 className="detailbook-title">{book.bookName}</h1>
            <div className="book-detail-container">
                <div className="image-section">
                    <img className="image" src={selectedImage} alt="Selected" />
                    <div className="thumbnail-section">
                        {images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`Thumbnail ${index}`} 
                                className={`thumbnail ${selectedImage === image ? 'selected' : ''}`} 
                                onClick={() => setSelectedImage(image)} 
                            />
                        ))}
                    </div>
                </div>
                <div className="text-section">
                    <p><strong>ประเภท:</strong> {book.genre}</p>
                    <p><strong>ผู้แต่ง:</strong> {book.author}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>ราคาเช่า:</strong> {book.pricePerDay} บาท / วัน</p>
                    <p><strong>คำอธิบาย:</strong> {book.introduction}</p>
                    <p><strong>ผู้ปล่อยเช่า:</strong> {book.nameTitle} {book.firstname} {book.lastName}</p>
                    <button onClick={handleRentButtonClick} className="rent-button">
                        เช่าเล่มนี้
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;

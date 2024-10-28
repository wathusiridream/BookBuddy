import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import '../WebStyle/BookDetail.css'; // You can style this page as needed
import NavBar from './NavBar';

const BookDetail = () => {
    const { id } = useParams(); // Get the book ID from the URL
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Use useNavigate to navigate programmatically

    useEffect(() => {
        const fetchBook = async () => {
            const bookDoc = doc(db, 'ForRents', id);
            const bookSnapshot = await getDoc(bookDoc);
            if (bookSnapshot.exists()) {
                setBook({ id: bookSnapshot.id, ...bookSnapshot.data() });
            } else {
                console.error("No such document!");
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

    const handleRentButtonClick = () => {
        // Navigate to the rental page, you can add the book ID as a parameter if needed
        navigate(`/Rentals/${book.id}`); // Adjust the path as necessary
    };

    return (
        <div className="book-detail-container">
            <NavBar />
            <h1 className="book-title">{book.bookName}</h1>
            <div className="book-slider">
                <img className="cover-image" src={book.coverbookimg} alt="Cover" />
                {/* Implement a simple slider for sample images if needed */}
                <div className="sample-images">
                    <img src={book.samplebookimg} alt="Sample" className="sample-image" />
                </div>
            </div>
            <p><strong>ประเภท:</strong> {book.genre}</p>
            <p><strong>ผู้แต่ง:</strong> {book.author}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>ราคา/วัน:</strong> {book.pricePerDay} บาท</p>
            <p><strong>คำอธิบาย:</strong> {book.introduction}</p>
            <button onClick={handleRentButtonClick} className="rent-button">
                เช่าเล่มนี้
            </button>
        </div>
    );
};

export default BookDetail;

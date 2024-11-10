import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import NavBar from './NavBar';
import '../WebStyle/Showbook.css';
import { IonIcon } from '@ionic/react';
import { searchCircleOutline, arrowBack } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const ForRentShowbook = () => {
    const [books, setBooks] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.log("ผู้ใช้ยังไม่ได้เข้าสู่ระบบ");
                return;
            }

            setIsLoading(true);

            try {
                // Step 1: ดึงข้อมูลจาก collection `ForRents` โดยตรงที่ userId ตรงกับ currentUser
                const booksCollection = collection(db, 'ForRents');
                const booksQuery = query(booksCollection, where("userId", "==", currentUser.uid));
                const booksSnapshot = await getDocs(booksQuery);

                // Step 2: เก็บข้อมูลหนังสือที่ดึงได้ใน state
                const bookList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBooks(bookList);
            } catch (error) {
                console.error("ข้อผิดพลาดในการดึงข้อมูล:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        (selectedGenre === '' || book.genre === selectedGenre) &&
        (searchQuery === '' || book.bookName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const genres = [...new Set(books.map(book => book.genre))];

    const handleBackButtonClick = () => {
        navigate('/ForRentShowBook');
    };

    const handleBookClick = (bookId) => {
        navigate(`/BookDetailEdit/${bookId}`);
    };

    return (
        <div className="book-list-container">
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
            >
                ย้อนกลับ
            </span>
            <h1 className="book-list-title">หนังสือที่คุณปล่อยเช่า</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="ค้นหาหนังสือ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IonIcon
                    icon={searchCircleOutline}
                    style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        width: '100px',
                        color: '#888',
                        fontSize: '24px'
                    }}
                />
            </div>
            <div>
                <button className="genre-button" onClick={() => setSelectedGenre('')}>
                    ทั้งหมด
                </button>
                {genres.map((genre, index) => (
                    <button
                        key={index}
                        className="genre-button"
                        onClick={() => setSelectedGenre(genre)}
                    >
                        {genre}
                    </button>
                ))}
            </div>
            <div className="book-list">
                {isLoading ? (
                    <p className="loading-message">กำลังโหลด...</p>
                ) : (
                    filteredBooks.length > 0 ? (
                        filteredBooks.map(book => (
                            <div
                                key={book.id}
                                className="book-item"
                                onClick={() => navigate(`/BookDetailEdit/${book.id}`)}
                            >
                                {book.coverbookimg && (
                                    <div>
                                        <img className="book-cover-image" src={book.coverbookimg[0]} alt="Cover" />
                                    </div>
                                )}
                                <h2 className="showbook-title">{book.bookName}</h2>
                                <p className="book-detail">ประเภท: {book.genre}</p>
                                <p className="book-detail">ISBN: {book.isbn}</p>
                                <p className="book-detail">ผู้แต่ง: {book.author}</p>
                                <p className="book-detail">ราคาเช่า: {book.pricePerDay} บาท / วัน</p>
                                <p>สถานะ: {book.availableforRent ? "พร้อมให้เช่า" : "ไม่พร้อมให้เช่า"}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">ยังไม่มีข้อมูลหนังสือที่ปล่อยเช่า</p>
                    )
                )}
            </div>
        </div>
    );
};

export default ForRentShowbook;

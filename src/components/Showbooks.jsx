import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import NavBar from './NavBar';
import '../WebStyle/Showbook.css';
import { IonIcon } from '@ionic/react';
import { searchCircleOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';

const Showbook = () => {
    const [books, setBooks] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        const fetchBooks = async () => {
            const booksCollection = collection(db, 'ForRents');
            const bookSnapshot = await getDocs(booksCollection);
            const bookList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(bookList);
            setIsLoading(false); // Set loading to false after fetching data
        };

        fetchBooks();
    }, []);

    const filteredBooks = books.filter(book =>
        (selectedGenre === '' || book.genre === selectedGenre) &&
        (searchQuery === '' || book.bookName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const genres = [...new Set(books.map(book => book.genre))];

    return (
        <div className="book-list-container">
            <NavBar /> {/* Insert NavBar here */}
            <h1 className="book-list-title">หนังสือที่สามารถเช่าได้</h1>
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
                                onClick={() => navigate(`/BooksDetail/${book.id}`)}
                                >
                                {book.coverbookimg && (
                                    <div>
                                        <img className="book-cover-image" src={book.coverbookimg} alt="Cover" />
                                    </div>
                                )}
                                <h2 className="book-title">{book.bookName}</h2>
                                <p className="book-detail">ประเภท: {book.genre}</p>
                                <p className="book-detail">ISBN: {book.isbn}</p>
                                <p className="book-detail">ผู้แต่ง: {book.author}</p>
                                <p className="book-detail">ราคา/วัน: {book.pricePerDay}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">ยังไม่มีข้อมูลหนังสือ</p>
                    )
                )}
            </div>
        </div>
    );
};

export default Showbook;

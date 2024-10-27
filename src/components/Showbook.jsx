import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Showbook = () => {
    const [books, setBooks] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(''); // เก็บประเภทหนังสือที่เลือก
    const [searchQuery, setSearchQuery] = useState(''); // เก็บค่าค้นหา

    useEffect(() => {
        const fetchBooks = async () => {
            const booksCollection = collection(db, 'rentals'); // ใช้ชื่อ collection ที่คุณต้องการ
            const bookSnapshot = await getDocs(booksCollection);
            const bookList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(bookList);
        };

        fetchBooks();
    }, []);

    // ฟังก์ชันสำหรับกรองหนังสือตามประเภทและคำค้นหา
    const filteredBooks = books.filter(book =>
        (selectedGenre === '' || book.genre === selectedGenre) &&
        (searchQuery === '' || book.bookName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // ดึงรายการประเภทของหนังสือ (Genre)
    const genres = [...new Set(books.map(book => book.genre))];

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>หนังสือที่สามารถเช่าได้</h1>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="ค้นหาหนังสือ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchBar}
                />
            </div>
            <div style={styles.buttonContainer}>
                <button
                    onClick={() => setSelectedGenre('')}
                    style={selectedGenre === '' ? styles.activeButton : styles.button}
                >
                    ทั้งหมด
                </button>
                {genres.map((genre, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedGenre(genre)}
                        style={selectedGenre === genre ? styles.activeButton : styles.button}
                    >
                        {genre}
                    </button>
                ))}
            </div>
            {filteredBooks.length > 0 ? (
                <div style={styles.bookList}>
                    {filteredBooks.map(book => (
                        <div key={book.id} style={styles.product}>
                            {book.coverbookimg && (
                                <div>
                                    <img src={book.coverbookimg} alt="Cover" style={styles.image} />
                                </div>
                            )}
                            <h2 style={styles.title}>{book.bookName}</h2>
                            <p>ประเภท: {book.genre}</p>
                            <p>ISBN: {book.isbn}</p>
                            <p>ผู้แต่ง: {book.author}</p>
                            <p>คำอธิบาย: {book.introduction}</p>
                            <p>จำนวน: {book.quantity}</p>
                            <p style={styles.price}>ราคา/วัน: {book.pricePerDay}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>ยังไม่มีข้อมูลหนังสือ</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    searchContainer: {
        marginBottom: '20px',
        textAlign: 'right',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '20px',
    },
    searchBar: {
        padding: '10px',
        width: '250px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    buttonContainer: {
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    button: {
        padding: '10px 15px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        backgroundColor: '#f8f9fa',
        color: '#333',
        cursor: 'pointer',
        fontSize: '14px',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
    },
    activeButton: {
        padding: '10px 15px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
    },
    bookList: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    product: {
        width: '410px',
        margin: '10px',
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'center',
        borderRadius: '5px',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    },
    image: {
        width: '100%',
        height: 'auto',
        marginBottom: '10px',
    },
    title: {
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    price: {
        color: '#007bff',
    },
};

export default Showbook;

import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookDetailEdit = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [selectedImage, setSelectedImage] = useState('');
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            const bookDoc = doc(db, 'ForRents', id);
            const bookSnapshot = await getDoc(bookDoc);
            if (bookSnapshot.exists()) {
                const bookData = { id: bookSnapshot.id, ...bookSnapshot.data() };
                setBook(bookData);
                setFormData(bookData); // Set form data to current book data
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        const bookDoc = doc(db, 'ForRents', id);
        await updateDoc(bookDoc, formData);
        toast.success("บันทึกข้อมูลสำเร็จ!");
        navigate(`/ForRentShowbook`); // Redirect after saving
    };

    const handleCancelRent = async () => {
        const bookDoc = doc(db, 'ForRents', id);
        await updateDoc(bookDoc, { availableforRent: false });
        setFormData((prevData) => ({ ...prevData, availableforRent: false })); // Update local state
        toast.success("ยกเลิกการปล่อยเช่าสำเร็จ!");
    };

    const handleForRent = async () => {
        const bookDoc = doc(db, 'ForRents', id);
        await updateDoc(bookDoc, { availableforRent: true });
        setFormData((prevData) => ({ ...prevData, availableforRent: true })); // Update local state
        toast.success("ยกเลิกการปล่อยเช่าสำเร็จ!");
    };

    if (isLoading) {
        return <p className="loading-message">กำลังโหลด...</p>;
    }

    if (!book) {
        return <p className="no-data-message">ไม่พบข้อมูลหนังสือ</p>;
    }

    const handleBackButtonClick = () => {
        navigate('/YourBooks');
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

            <h1 className="edit-title">แก้ไขข้อมูลหนังสือ</h1>
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
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <label>
                        ชื่อหนังสือ:
                        <input
                            type="text"
                            name="bookName"
                            value={formData.bookName || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        ผู้แต่ง:
                        <input
                            type="text"
                            name="author"
                            value={formData.author || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        ประเภท:
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        ISBN:
                        <input
                            type="text"
                            name="isbn"
                            value={formData.isbn || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        ราคาเช่า:
                        <input
                            type="number"
                            name="pricePerDay"
                            value={formData.pricePerDay || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        คำอธิบาย:
                        <textarea
                            name="introduction"
                            value={formData.introduction || ''}
                            onChange={handleInputChange}
                        />
                    </label>
                    <button type="submit">บันทึกข้อมูล</button>
                    <button type="button" onClick={handleCancelRent}>ยกเลิกการปล่อยเช่า</button>
                    <button type="button" onClick={handleForRent}>ปล่อยเช่าเล่มนี้</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BookDetailEdit;

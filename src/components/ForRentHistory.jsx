import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, doc, updateDoc, onSnapshot, getDoc,getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavBar from './NavBar';
import { arrowBack } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/ForRentHistory.css';

const ForRentHistory = () => {
    const [forRentHistory, setForRentHistory] = useState([]);
    const [trackingNumbers, setTrackingNumbers] = useState({});
    const [renterAddress, setRenterAddress] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRentalId, setSelectedRentalId] = useState(null);
    const [filteredRentals, setFilteredRentals] = useState([]);
    const [status, setStatus] = useState('');
    const userId = getAuth().currentUser?.uid;
    const navigate = useNavigate();

    const fetchForRentHistory = () => {
        if (userId) {
            const forRentsRef = collection(db, 'ForRents');
            const forRentsQuery = query(forRentsRef, where('userId', '==', userId));

            onSnapshot(forRentsQuery, async (forRentsSnapshot) => {
                const bookIds = forRentsSnapshot.docs.map(doc => doc.id);

                if (bookIds.length > 0) {
                    const rentalsRef = collection(db, 'rentals');
                    const rentalsQuery = query(rentalsRef, where('bookId', 'in', bookIds));

                    onSnapshot(rentalsQuery, async (rentalsSnapshot) => {
                        const rentalList = rentalsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));

                        const detailedRentals = await Promise.all(rentalList.map(async (rental) => {
                            const forRent = forRentsSnapshot.docs.find(doc => doc.id === rental.bookId);
                            return {
                                rentalId: rental.id,
                                bookName: forRent ? forRent.data().bookName : 'ไม่ระบุชื่อหนังสือ',
                                rentalDate: rental.date_rented,
                                returnDate: rental.date_return,
                                totalAmount: rental.totalAmount,
                                firstName: rental.firstName,
                                lastName: rental.lastName,
                                status: rental.status,
                                forRentId: rental.bookId,
                                forRentFirstName: forRent ? forRent.data().firstName : 'ไม่ระบุ',
                                forRentLastName: forRent ? forRent.data().lastName : 'ไม่ระบุ',
                                lessor_shipped: rental.lessor_shipped || false,
                                renter_received: rental.renter_received || false,
                                renter_returned: rental.renter_returned || false,
                                lessor_received_return : rental.lessor_received_return || false , 
                                CheckSlip: rental.CheckSlip || false,
                                userId: rental.userId,
                            };
                        }));

                        setForRentHistory(detailedRentals);
                        setFilteredRentals(detailedRentals);
                    });
                } else {
                    setForRentHistory([]);
                }
            });
        }
    };

    useEffect(() => {
        fetchForRentHistory();
    }, [userId]);

    const filterRentals = (statusFilter) => {
        setStatus(statusFilter);
        if (statusFilter === 'waiting') {
            setFilteredRentals(forRentHistory.filter(rental => !rental.lessor_shipped));
        } else if (statusFilter === 'renting') {
            // กรองให้เช็คว่า renter_returned เป็น false ด้วย
            setFilteredRentals(forRentHistory.filter(rental => rental.lessor_shipped && rental.renter_received && !rental.lessor_received_return));
        } else if (statusFilter === 'returned') {
            setFilteredRentals(forRentHistory.filter(rental => rental.lessor_shipped && rental.lessor_received_return && rental.renter_received && rental.renter_returned));
        }
    };

    const handleTrackingNumberChange = (rentalId, value) => {
        setTrackingNumbers(prev => ({
            ...prev,
            [rentalId]: value
        }));
    };

    const handleSaveTrackingNumber = async (rentalId) => {
        const trackingNumber = trackingNumbers[rentalId];
        if (rentalId && trackingNumber) {
            try {
                const rentalRef = doc(db, 'rentals', rentalId);
                await updateDoc(rentalRef, {
                    tracking_number: trackingNumber,
                    lessor_shipped: true,
                });
                alert('บันทึกเลขพัสดุเรียบร้อยแล้ว!');
                setTrackingNumbers(prev => ({
                    ...prev,
                    [rentalId]: ''
                }));
                fetchForRentHistory();
            } catch (error) {
                console.error("Error updating tracking number:", error);
            }
        } else {
            alert("กรุณากรอกเลขพัสดุ");
        }
    };

    // Fetch renter address and open modal
    const showAddressModal = async (rental) => {
        const renterId = rental.userId; // ดึง userId จาก rental
        try {
            // Step 1: Fetch email from 'users' collection
            const userRef = doc(db, 'users', renterId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userEmail = userSnap.data().email; // Get email from user

                // Step 2: Use email to fetch address from UserInformation
                const userInfoRef = query(collection(db, 'UserInformation'), where('email', '==', userEmail));
                const userInfoSnap = await getDocs(userInfoRef);

                if (!userInfoSnap.empty) {
                    userInfoSnap.forEach(doc => {
                        setRenterAddress(doc.data()); // Set renter address
                    });
                    setSelectedRentalId(rental.rentalId);
                    setIsModalOpen(true);
                } else {
                    console.warn("User information not found for the email.");
                }
            } else {
                console.warn("User not found.");
            }
        } catch (error) {
            console.error("Error fetching renter address:", error);
        }
    };

    const handleConfirmReceived = async (rentalId) => {
        if (rentalId) {
            const rentalRef = doc(db, 'rentals', rentalId);
            try {
                await updateDoc(rentalRef, {
                    renter_returned: true, // อัปเดตเป็น true
                    lessor_received_return : true,
                });
                alert('ยืนยันการได้รับหนังสือคืนเรียบร้อยแล้ว!');
                //fetchForRentHistory(); // โหลดประวัติการเช่าใหม่
            } catch (error) {
                console.error("Error updating document:", error);
            }
        }
    };

    const handleBackButtonClick = () => {
        navigate('/home');
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
            <div className='renting-history-page'>
                <h1>ประวัติการปล่อยเช่าหนังสือ</h1>

                <div>
                    <button onClick={() => filterRentals('waiting')}>รอจัดส่งหนังสือ</button>
                    <button onClick={() => filterRentals('renting')}>กำลังเช่า</button>
                    <button onClick={() => filterRentals('returned')}>ส่งคืนหนังสือแล้ว</button>
                </div>
                {filteredRentals.map((rental) => (
                    <div key={rental.rentalId} className='rental-item'>
                        <h2>ชื่อหนังสือ: {rental.bookName}</h2>
                        <p>ผู้เช่า: {rental.firstName} {rental.lastName}</p>
                        <p>วันเช่า: {rental.rentalDate}</p>
                        <p>วันคืน: {rental.returnDate}</p>
                        <p>ยอดรวม: {rental.totalAmount}</p>
                        <p>สถานะ: {rental.status || 'รอการจัดการ'}</p>

                        {/* แสดงปุ่มนี้เฉพาะเมื่อสถานะเป็น 'waiting' */}
                        {status === 'waiting' && (
                            <button onClick={() => showAddressModal(rental)}>แสดงที่อยู่ผู้เช่า</button>
                        )}

                        {!rental.tracking_number && !rental.lessor_shipped && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="กรอกเลขพัสดุ"
                                    value={trackingNumbers[rental.rentalId] || ''}
                                    onChange={(e) => handleTrackingNumberChange(rental.rentalId, e.target.value)}
                                />
                                {rental.CheckSlip ? (
                                    <button onClick={() => handleSaveTrackingNumber(rental.rentalId)}>จัดส่งหนังสือแล้ว</button>
                                ) : (
                                    <button disabled style={{ backgroundColor: 'gray', cursor: 'not-allowed' }}>
                                        ผู้เช่ายังไม่ทำการชำระเงิน
                                    </button>
                                )}
                            </div>
                        )}

                        {status === 'renting' && (
                            <button onClick={() => handleConfirmReceived(rental.rentalId)}>ยืนยันการได้รับหนังสือคืน</button>
                        )}
                    </div>
                ))}

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                            <h2>ข้อมูลผู้เช่า</h2>
                            <p>ชื่อ: {renterAddress.firstname} {renterAddress.lastName}</p>
                            <p>โทรศัพท์: {renterAddress.telephone}</p>
                            <h3>ที่อยู่</h3>
                            <p>บ้านเลขที่: {renterAddress.housenumber}</p>
                            <p>หมู่บ้าน: {renterAddress.villagenumber}</p>
                            <p>ชื่ออาคาร: {renterAddress.villagebuildingname}</p>
                            <p>ซอย: {renterAddress.soi}</p>
                            <p>ถนน: {renterAddress.streetname}</p>
                            <p>ตำบล: {renterAddress.subDistrict}</p>
                            <p>อำเภอ: {renterAddress.district}</p>
                            <p>จังหวัด: {renterAddress.province}</p>
                            <p>รหัสไปรษณีย์: {renterAddress.zipCode}</p>
                            
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForRentHistory;

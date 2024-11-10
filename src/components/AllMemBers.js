// src/pages/AllMembers.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import AdminNavBar from './AdminNavBar';
import '../WebStyle/Allmember.css'

const AllMembers = () => {
    const [forRentMembers, setForRentMembers] = useState([]);
    const [userInformationMembers, setUserInformationMembers] = useState([]);
    const [activeTab, setActiveTab] = useState('ForRents'); // Track the active tab

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                // Fetch data from the 'ForRents' collection
                const forRentCollection = collection(db, 'ForRents');
                const forRentSnapshot = await getDocs(forRentCollection);
                const forRentList = forRentSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nameTitle: data.nameTitle || '',
                        firstname: data.firstname || '',
                        lastName: data.lastName || '',
                        dateofBirth: data.dateofBirth || '',
                        telephone: data.telephone || '',
                        thaiID: data.thaiID || '',
                        housenumber: data.housenumber || '',
                        villagebuildingname: data.villagebuildingname || '',
                        villagenumber: data.villagenumber || '',
                        soi: data.soi || '',
                        streetname: data.streetname || '',
                        subDistrict: data.subDistrict || '',
                        district: data.district || '',
                        province: data.province || '',
                        zipCode: data.zipCode || '',
                        promptpayNumber: data.promptpayNumber || '',
                    };
                });
                setForRentMembers(forRentList);

                // Fetch data from the 'UserInformation' collection
                const userInformationCollection = collection(db, 'UserInformation');
                const userInformationSnapshot = await getDocs(userInformationCollection);
                const userInformationList = userInformationSnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nameTitle: data.nameTitle || '',
                        firstname: data.firstname || '',
                        lastName: data.lastName || '',
                        dateofBirth: data.dateofBirth || '',
                        telephone: data.telephone || '',
                        thaiID: data.thaiID || '',
                        housenumber: data.housenumber || '',
                        villagebuildingname: data.villagebuildingname || '',
                        villagenumber: data.villagenumber || '',
                        soi: data.soi || '',
                        streetname: data.streetname || '',
                        subDistrict: data.subDistrict || '',
                        district: data.district || '',
                        province: data.province || '',
                        zipCode: data.zipCode || '',
                    };
                });
                setUserInformationMembers(userInformationList);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div>
            <AdminNavBar />
            <div className="all-members">
            <h1>ข้อมูลสมาชิกในระบบ</h1>
            <div className="tabs">
                <button onClick={() => setActiveTab('ForRents')} className={activeTab === 'ForRents' ? 'active' : ''}>
                    ผู้ปล่อยเช่า
                </button>
                <button onClick={() => setActiveTab('UserInformation')} className={activeTab === 'UserInformation' ? 'active' : ''}>
                    ผู้เช่า
                </button>
            </div>
            <div className="member-card-container">
                {activeTab === 'ForRents' && forRentMembers.map(member => (
                    <div key={member.id} className="member-card">
                        <h3>{member.nameTitle} {member.firstname} {member.lastName}</h3>
                        {member.dateofBirth && <p><strong>วันเกิด :</strong> {member.dateofBirth}</p>}
                        {member.telephone && <p><strong>เบอร์โทรศัพท์ :</strong> {member.telephone}</p>}
                        {member.thaiID && <p><strong>หมายเลขบัตรประชาชน :</strong> {member.thaiID}</p>}
                        {member.housenumber && <p><strong>บ้านเลขที่ :</strong> {member.housenumber}</p>}
                        {member.villagebuildingname && <p><strong>ชื่อหมู่บ้าน / อาคาร :</strong> {member.villagebuildingname}</p>}
                        {member.villagenumber && <p><strong>หมู่ :</strong> {member.villagenumber}</p>}
                        {member.soi && <p><strong>ซอย :</strong> {member.soi}</p>}
                        {member.streetname && <p><strong>ถนน :</strong> {member.streetname}</p>}
                        {member.subDistrict && <p><strong>ตำบล / แขวง :</strong> {member.subDistrict}</p>}
                        {member.district && <p><strong>อำเภอ / เขต :</strong> {member.district}</p>}
                        {member.province && <p><strong>จังหวัด :</strong> {member.province}</p>}
                        {member.zipCode && <p><strong>รหัสไปรษณีย์:</strong> {member.zipCode}</p>}
                        {member.promptpayNumber && <p><strong>หมายเลขพร้อมเพย์ :</strong> {member.promptpayNumber}</p>}
                    </div>
                ))}
                {activeTab === 'UserInformation' && userInformationMembers.map(member => (
                    <div key={member.id} className="member-card">
                        <h3>{member.nameTitle} {member.firstname} {member.lastName}</h3>
                        {member.dateofBirth && <p><strong>วันเกิด :</strong> {member.dateofBirth}</p>}
                        {member.telephone && <p><strong>เบอร์โทรศัพท์ :</strong> {member.telephone}</p>}
                        {member.thaiID && <p><strong>หมายเลขบัตรประชาชน :</strong> {member.thaiID}</p>}
                        {member.housenumber && <p><strong>บ้านเลขที่ :</strong> {member.housenumber}</p>}
                        {member.villagebuildingname && <p><strong>ชื่อหมู่บ้าน / อาคาร :</strong> {member.villagebuildingname}</p>}
                        {member.villagenumber && <p><strong>หมู่ :</strong> {member.villagenumber}</p>}
                        {member.soi && <p><strong>ซอย :</strong> {member.soi}</p>}
                        {member.streetname && <p><strong>ถนน :</strong> {member.streetname}</p>}
                        {member.subDistrict && <p><strong>ตำบล / แขวง :</strong> {member.subDistrict}</p>}
                        {member.district && <p><strong>อำเภอ / เขต :</strong> {member.district}</p>}
                        {member.province && <p><strong>จังหวัด :</strong> {member.province}</p>}
                        {member.zipCode && <p><strong>รหัสไปรษณีย์:</strong> {member.zipCode}</p>}
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
    
};

export default AllMembers;

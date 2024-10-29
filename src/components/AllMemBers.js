// src/pages/AllMembers.js
import React, { useEffect, useState } from 'react';
import MemberCard from '../components/MemberCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import AdminNavBar from './AdminNavBar';
const AllMembers = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const membersCollection = collection(db, 'ForRents'); // Fetch data from the 'ForRents' collection
                const memberSnapshot = await getDocs(membersCollection);
                const memberList = memberSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMembers(memberList);
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    return (
        <div className="all-members">
            <AdminNavBar/>
            <h1>ข้อมูลสมาชิกในระบบ</h1>
            <div className="member-card-container">
                {members.map(member => (
                    <MemberCard key={member.userId} member={member} />
                ))}
            </div>
        </div>
    );
};

export default AllMembers;

// src/components/MemberCard.js
import React from 'react';
import '../WebStyle/MemberCard.css'; // Optional: Add your styles here

const MemberCard = ({ member }) => {
    return (
        <div className="member-card">
            <div className="card-content">
                <h2>{member.nameTitle} {member.firstname} {member.lastName}</h2>      
                <p>เบอร์ติดต่อ: {member.telephone}</p>
                <p>วันที่เกิด: {member.dateofBirth}</p>
                <p>เลขบัตรประชาชน: {member.thaiID}</p>
                <p>บ้านเลขที่: {member.housenumber}</p>
                <p>หมู่บ้าน: {member.villagebuildingname} หมู่ที่ {member.villagenumber}</p>
                <p>ซอย: {member.soi}</p>
                <p>ถนน: {member.streetname}</p>
                <p>ตำบล: {member.subDistrict}</p>
                <p>อำเภอ: {member.district}</p>
                <p>จังหวัด: {member.province}</p>
                <p>รหัสไปรษณีย์: {member.zipCode}</p>
                <h4>หนังสือ: {member.bookName}</h4>
                <p>ผู้เขียน: {member.author}</p>
                <p>ประเภท: {member.genre}</p>
                <p>ISBN: {member.isbn}</p>
                <p>ราคา: {member.pricePerDay} บาท/วัน</p>
            </div>
            <div className="card-back">
                <p>ผู้ปล่อยเช่า</p>
            </div>
        </div>
    );
};

export default MemberCard;

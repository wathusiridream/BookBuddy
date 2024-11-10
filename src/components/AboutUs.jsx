import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { IonIcon } from '@ionic/react';
import { searchCircleOutline, arrowBack } from 'ionicons/icons';
import '../WebStyle/AboutUs.css';

const AboutUs = () => {
    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        window.history.back();
    };

    const gradientStyle = {
        background: 'linear-gradient(180deg, rgba(67, 179, 174, 1) 0%, rgba(67, 179, 174, 0.76) 21%, rgba(245, 245, 220, 0.48) 76%, rgba(255, 255, 255, 0) 100%)',
        height: 'auto',
        color: '#000',
      };

    return (
        <div  style={gradientStyle}>
            <NavBar />
            <div className="about-us" >
               
                <h1>About BookBuddy</h1>

                <section className="store-details">
                    <h2>ชื่อร้านค้า: BookBuddy</h2>
                    <p>
                        BookBuddy เป็นแพลตฟอร์มการเช่าหนังสือที่มอบความสะดวกสบายให้กับผู้รักการอ่าน
                        คุณสามารถปล่อยเช่าหนังสือของคุณเองหรือเช่าหนังสือจากผู้อื่นได้อย่างง่ายดาย
                        ทุกขั้นตอนถูกออกแบบมาให้ใช้งานง่ายและเป็นมิตรต่อผู้ใช้
                    </p>
                </section>

                <section className="our-mission">
                    <h2>พันธกิจของเรา</h2>
                    <p>
                        พันธกิจของเราคือการเชื่อมโยงคนรักการอ่านเข้าด้วยกัน และทำให้การอ่านเข้าถึงได้ง่ายขึ้น
                        เราให้บริการเช่าหนังสือที่ประหยัดและคุ้มค่าเพื่อให้ทุกคนสามารถเข้าถึงหนังสือได้
                    </p>
                </section>

                <section className="how-it-works">
                    <h2>วิธีการทำงาน</h2>
                    <p>
                        การใช้งาน BookBuddy ง่ายดายและสะดวก เพียงแค่สมัครบัญชี เลือกหนังสือที่คุณสนใจ และดำเนินการเช่าหนังสือ
                        คุณสามารถปล่อยเช่าหนังสือของคุณเองได้ด้วยการลงทะเบียนหนังสือ
                    </p>
                </section>

                <section className="community-values">
                    <h2>ค่านิยมของชุมชน</h2>
                    <p>
                        BookBuddy ให้ความสำคัญกับชุมชนของนักอ่าน เราเชื่อว่าการแบ่งปันหนังสือสามารถสร้างความเชื่อมโยง
                        ระหว่างผู้คนและส่งเสริมการเรียนรู้ร่วมกัน
                    </p>
                </section>

                <section className="contact-info">
                    <h2>ติดต่อเรา</h2>
                    <p>
                        หากคุณมีข้อสงสัยหรือต้องการติดต่อเรา ส่งอีเมลมาที่ <a href="mailto:contact@bookbuddy.com">contact@bookbuddy.com</a>
                        หรือโทร <strong>02-123-4567</strong> ในเวลาทำการ
                    </p>
                </section>

                <section className="faq">
                    <h2>คำถามที่พบบ่อย</h2>
                    <p>
                        <strong>ฉันสามารถเช่าหนังสือได้นานเท่าใด?</strong><br />
                        ระยะเวลาการเช่าขึ้นอยู่กับผู้ให้เช่า โปรดตรวจสอบรายละเอียดการเช่าของหนังสือที่คุณสนใจ
                    </p>
                    <p>
                        <strong>ฉันสามารถยกเลิกการเช่าได้หรือไม่?</strong><br />
                        คุณสามารถยกเลิกการเช่าได้ตามนโยบายของผู้ให้เช่า โปรดติดต่อเราเพื่อขอข้อมูลเพิ่มเติม
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;

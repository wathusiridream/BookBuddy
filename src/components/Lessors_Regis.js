import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; 
import { db } from '../utils/firebase'; 
import '../WebStyle/Lessors_Regis_Form.css';
import Stepper from './Stepper'; // นำเข้า Stepper component

function Lessors_Regis() {
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // State สำหรับ Stepper
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    telephone: '',
    address: '',
    thaiID: '',
    promptpayNumber: ''
  });

  const nextStep = () => setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
  const prevStep = () => setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFormData({
            name: userData.name || '',
            lastName: userData.lastName || '',
            telephone: formatTelephone(userData.telephone || ''),
            address: userData.address || '',
            thaiID: formatThaiID(userData.thaiID || ''),
            promptpayNumber: formatPromptPay(userData.promptpayNumber || '') 
          });
        } else {
          navigate('/user-information');
        }
      } else {
        console.error("No authenticated user");
        navigate('/login'); 
      }
      setLoading(false); 
    };

    fetchUserData();
  }, [auth, navigate]);

  const formatTelephone = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : value;
  };

  const formatThaiID = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{4})(\d{3})(\d{2})(\d{3})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}-${match[4]}-${match[5]}` : value;
  };

  const formatPromptPay = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'telephone') {
      formattedValue = formatTelephone(value);
    } else if (name === 'thaiID') {
      formattedValue = formatThaiID(value);
    } else if (name === 'promptpayNumber') {
      formattedValue = formatPromptPay(value);
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
    
    // Update step based on form completion
    const stepOrder = ["name", "lastName", "telephone", "address", "thaiID", "promptpayNumber"];
    const currentIndex = stepOrder.indexOf(name) + 1;
    setCurrentStep(currentIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const lessorDocRef = doc(db, "lessors", user.uid);
        await setDoc(lessorDocRef, formData);
        console.log('Lessor information saved successfully');
        navigate('/Lessors-Dashboaard');
      } catch (error) {
        console.error("Error saving lessor information: ", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lessor-custom-background">
      <div className="lessors-info-page">
        <div className="container">

          
          <Stepper currentStep={currentStep} /> {/* เพิ่ม Stepper ที่นี่ */}
          <div className="lessors-information">
            <h1>Lessors Information</h1>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name :</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  readOnly
                />
              </div>
              <div>
                <label>Last Name :</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  readOnly
                  required
                />
              </div>
              <div>
                <label>Telephone :</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div>
                <label>Address :</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  readOnly
                  required
                />
              </div>
              <div>
                <label>Thai ID :</label>
                <input
                  type="text"
                  name="thaiID"
                  value={formData.thaiID}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div>
                <label>PromptPay Number :</label>
                <input
                  type="text"
                  name="promptpayNumber"
                  value={formData.promptpayNumber}
                  onChange={handleChange}
                  required
                  maxLength={10}
                />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lessors_Regis;

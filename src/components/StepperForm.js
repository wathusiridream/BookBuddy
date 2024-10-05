import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, TextField } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../utils/firebase'; // ปรับเส้นทางให้ถูกต้องตามโปรเจคของคุณ
import { ColorlibConnector, ColorlibStepIcon } from './CustomStepper';
import '../WebStyle/Lessors_Regis_Form.css';

const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstname: '',
    lastName: '',
    telephone: '',
    housenumber: '',
    district: '',
    province: '',
    postnumber: '',
    thaiID: '',
    promptpayNumber: '',
    bookName: '',
    genre: '',
    isbn: '',
    author: '',
    introduction: '',
    quantity: '',
    pricePerDay: '',
    coverbookimg: '',
    samplebookimg: '',
  });
  const steps = ['ข้อมูลส่วนตัว', 'ที่อยู่', 'บัญชีธนาคาร', 'ข้อมูลหนังสือ', 'ยืนยันข้อมูล'];
  const auth = getAuth();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      firstname: '',
      lastName: '',
      telephone: '',
      housenumber: '',
      district: '',
      province: '',
      postnumber: '',
      thaiID: '',
      promptpayNumber: '',
      bookName: '',
      genre: '',
      isbn: '',
      author: '',
      introduction: '',
      quantity: '',
      pricePerDay: '',
      coverbookimg: '',
      samplebookimg: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const lessorDocRef = doc(db, "lessors", user.uid);
        await setDoc(lessorDocRef, formData);
        console.log('Lessor information saved successfully');
        handleReset(); // รีเซ็ตฟอร์มหลังจากส่งข้อมูลสำเร็จ
      } catch (error) {
        console.error("Error saving lessor information: ", error);
      }
    }
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className='lessors-information'>
            <TextField 
              label="First Name" 
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="Phone Number"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="Thai ID"
              name="thaiID"
              value={formData.thaiID}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
          </div>
        );
      case 1:
        return (
            <div>
                <TextField 
                label="House Number" 
                name="housenumber"
                value={formData.housenumber}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                />
                <TextField 
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                />
                <TextField 
                label="Province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                />
                <TextField 
                label="Post Number"
                name="postnumber"
                value={formData.postnumber}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary" 
                fullWidth 
                />
            </div>
        )
      case 2:
        return (
          <div className='lessors-information'>
            <TextField
              label="PromptPay Number"
              name="promptpayNumber"
              value={formData.promptpayNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </div>
        );
      case 3:
        return (
          <div className='lessors-information'>
            <TextField 
              label="Book Name" 
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="Genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="ISBN Number"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="Introduction"
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              multiline 
              rows={4} 
              fullWidth 
            />
            <TextField 
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            <TextField 
              label="Price per Day"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
          </div>
        );
      case 4:
        return (
          <div className='lessors-information'>
            <Typography>ตรวจสอบข้อมูลของคุณ</Typography>
            <br />
            <div className='review-section'>
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className='review-item'>
                  <Typography className="label">{key}:</Typography>
                  <Typography className="value">{value}</Typography>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className="lessors-info-page">
      <div className="container">
        <Stepper className="stepper" activeStep={activeStep} alternativeLabel connector={<ColorlibConnector />}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel className="step-label" StepIconComponent={ColorlibStepIcon}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="lessor-information">
          {getStepContent(activeStep)}
        </div>
        <div className="buttons">
        <Button 
             disabled={activeStep === 0} 
             onClick={handleBack} 
             variant="outlined" 
             style={{
                marginRight: '10px', 
                backgroundColor: activeStep === 0 ? 'rgba(128, 128, 128, 0.3)' : 'transparent', 
                borderColor: activeStep === 0 ? 'gray' : 'black', 
                color: activeStep === 0 ? 'gray' : 'black' // เปลี่ยนสีตัวอักษรเมื่อปิดการใช้งาน
          }} 
            >
              Back
            </Button>
          {activeStep === steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              style={{ backgroundColor: 'green', color: 'white' }} // ปุ่ม Submit เป็นสีเขียว
            >
              Submit
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNext}
              style={{ backgroundColor: 'blue', color: 'white' }} // ปุ่ม Next เป็นสีน้ำเงิน
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );

};

export default StepperForm;

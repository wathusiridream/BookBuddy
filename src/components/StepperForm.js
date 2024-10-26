import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, TextField , FormControl , Radio , RadioGroup , FormControlLabel , InputLabel , Select , MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, setDoc , getFirestore } from 'firebase/firestore'; 
import { ColorlibConnector, ColorlibStepIcon } from './CustomStepper';
import '../WebStyle/Lessors_Regis_Form.css';
import { IonIcon } from '@ionic/react'; // Corrected Ionic icon import
import { personOutline, callOutline, cardOutline , calendarOutline , closeCircleOutline  ,homeOutline , navigateOutline ,mapOutline} from 'ionicons/icons';
//import { addYears ,subYears , addMonths} from 'date-fns';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra'; // plugin for Buddhist Era (BE)
import { ref, uploadBytes , getDownloadURL} from "firebase/storage";
import { auth, db, storage } from '../utils/firebase'; // อย่าลืมนำเข้า storage ด้วย

dayjs.extend(buddhistEra);

const thai = require('thai-data');

const StepperForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nameTitle: '',
    firstname: '',
    lastName: '',
    dateofBirth: '',
    telephone: '',
    housenumber: '',
    villagebuildingname: '' , 
    villagenumber: '' , 
    soi: '' , 
    steetname: '' , 
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
  const steps = ['ข้อมูลส่วนตัว', 'ที่อยู่', 'บัญชีธนาคาร', 'ข้อมูลหนังสือ', 'ภาพหนังสือ' , 'ยืนยันข้อมูล'];
  const auth = getAuth();
  const [birthDate, setBirthDate] = useState(null);
  const today = new Date();
  const maxDate = dayjs().subtract(15, 'year'); // 15 ปีจากวันปัจจุบัน
  const navigate = useNavigate();

  const handleNext = () => {
    if (!formData.thaiID) {  // ตรวจสอบว่า textbox ThaiID มีการกรอกข้อมูลหรือไม่
      alert("กรุณากรอกหมายเลขประจำตัวประชาชน");
      return;  // หยุดการทำงานถ้าไม่มีการกรอกข้อมูล
    }

    const isValid = chkDigitPid(formData.thaiID); // ตรวจสอบหมายเลขประจำตัวประชาชน

      if (isValid) {
        // ถ้าถูกต้อง ให้ดำเนินการต่อไป เช่น เปลี่ยนหน้าหรือขั้นตอน
        // คุณสามารถใส่โค้ดที่นี่เพื่อไปยังขั้นตอนถัดไป
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

      } else {
        console.log("Invalid ID");
        // คุณสามารถจัดการกรณีที่หมายเลขไม่ถูกต้องได้ที่นี่
        setActiveStep((prevActiveStep) => 0);
      }
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
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const lessorDocRef = doc(db, "lessors", user.uid);
        // Save lessor information
        await setDoc(lessorDocRef, formData);
        console.log('Lessor information saved successfully');
  
        // Now save houseNumber to Lessors_Address collection
        const addressDocRef = doc(db, "Lessors_Address", user.uid);
        await setDoc(addressDocRef, { houseNumber: formData.houseNumber });
        console.log('House number saved successfully');
  
        handleReset(); // รีเซ็ตฟอร์มหลังจากส่งข้อมูลสำเร็จ
      } catch (error) {
        console.error("Error saving lessor information: ", error);
      }
    }
  };

  function chkDigitPid(p_iPID) {
    var total = 0;
    var iPID;
    var chk;
    var Validchk;
    iPID = p_iPID.replace(/-/g, "");
    Validchk = iPID.substr(12, 1);
    var j = 0;
    var pidcut;
    for (var n = 0; n < 12; n++) {
        pidcut = parseInt(iPID.substr(j, 1));
        total = (total + ((pidcut) * (13 - n)));
        j++;
    }

    chk = 11 - (total % 11);

    if (chk == 10) {
        chk = 0;
    } else if (chk == 11) {
        chk = 1;
    }
    if (chk == Validchk) {
        return true;
    } else {
        alert("ระบุหมายเลขประจำตัวประชาชนไม่ถูกต้อง");
        return false;
    }
  }

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

  {/* ดึงข้อมูล จังหวัด อำเภอ ตำบล */}
  const [zipCode, setZipCode] = useState('')
  const [subDistrict, setSubDistrict] = useState(Array)
  const [subDistrictSelect, setSubDistrictSelect] = useState('')
  const [district, setDistrict] = useState('')
  const [province, setProvince] = useState('')
  const [isDisabledSubDistrictSelect, setIsDisabledSubDistrictSelect] = useState(true)

  const onSetZipCode = (e) => {
    setSubDistrictSelect('')
    setDistrict('')
    setProvince('')
    if (/^\d{0,5}$/.test(e)) {
      setZipCode(e)
      if (thai.getAutoSuggestion(e).subDistrict) {
        setSubDistrict(thai.getAutoSuggestion(e).subDistrict)
        setIsDisabledSubDistrictSelect(false)
      } else {
        setIsDisabledSubDistrictSelect(true)
      }
    }
  }

  const autoSuggestion = (zipCode, subDistrict) => {
   setDistrict(thai.getAutoSuggestion(zipCode, subDistrict).districtName)
   setProvince(thai.getAutoSuggestion(zipCode, subDistrict).provinceName)
  }

  const onSetDistrict = (subDistrict) => {
    setSubDistrictSelect(subDistrict)
    autoSuggestion(zipCode, subDistrict)
  }

  {/* BirthDate Picker */}
  const handleDateChange = (date) => {
    if (date.isAfter(maxDate)) {
      alert('คุณต้องมีอายุมากกว่า 15 ปี');
    } else {
      setBirthDate(date); // Update the selected date
    }
  };
  
  {/* Book Image */}
  const [coverPreviews, setCoverPreviews] = useState([]);  // สร้าง state สำหรับ cover images
  const [samplePreviews, setSamplePreviews] = useState([]); // สร้าง state สำหรับ sample images

  const handleCoverUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 2) {
      alert('You can only upload up to 2 cover images');
      return;
    }
    const coverImages = files.map(file => URL.createObjectURL(file));
    setCoverPreviews(coverImages);
  };

  const handleSampleUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 5) {
      alert('You can only upload up to 5 sample images');
      return;
    }
    const sampleImages = files.map(file => URL.createObjectURL(file));
    setSamplePreviews(sampleImages);
  };

  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <div className='lessors-information'>
            <div className="input-with-icon">
              <IonIcon icon={personOutline} />
              <FormControl component="fieldset" 
                           margin="5px" 
                           fullWidth
              >                
              <RadioGroup
                  row 
                  aria-label="nameTitle" 
                  name="nameTitle" 
                  value={formData.nameTitle} 
                  onChange={handleChange}
                >
                  <FormControlLabel value="นาย" 
                                    control={<Radio />} 
                                    label="นาย" 
                                    style={{ alignItems: 'center',
                                     }} 
                                    />
                  <FormControlLabel value="นางสาว" 
                                    control={<Radio />} 
                                    label="นางสาว" 
                                    style={{ alignItems: 'center' }} 
                                    />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="input-with-icon">
              <IonIcon icon={personOutline} />
              <TextField 
                label="ชื่อ" 
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary"
                fullWidth   
              />
            </div>
            <div className="input-with-icon">
              <IonIcon icon={personOutline} />
              <TextField 
                label="นามสกุล"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="white" 
                fullWidth 
              />
            </div>
            <div className="input-with-icon">
              <div className='BirthDatePick' >
                  <IonIcon icon={calendarOutline} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={['year', 'month', 'day']} // Enable year, month, and day selection
                        label="วันเกิด"
                        value={birthDate}
                        onChange={handleDateChange}
                        maxDate={maxDate}
                        inputFormat="วว/ดด/ปปปป" // Display format
                        renderInput={(params) => (
                          <TextField
                            {...params}    
                          />
                        )}
                      />
                    </LocalizationProvider>
              </div>
            </div>
            <div className="input-with-icon">
              <IonIcon icon={callOutline} />
              <TextField 
                label="หมายเลขโทรศัพท์"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary" 
                inputProps={{ maxLength: 12 }}
                fullWidth 
              />
            </div>
            <div className="input-with-icon">
              <IonIcon icon={cardOutline}/>
              <TextField 
                label="หมายเลขบัตรประชาชน"
                name="thaiID"
                value={formData.thaiID}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary" 
                inputProps={{ maxLength: 17 }}
                fullWidth 
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="lessors-information">
          <form className="form">
            <div className="form-row">
              <div className="form-group">
                <TextField
                  label="บ้านเลขที่"
                  name="housenumber"
                  value={formData.housenumber}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  required
                  htmlFor="field1"
                />
              </div>
              <div className="form-group">
                <TextField
                  label="ชื่อหมู่บ้าน / อาคาร"
                  name="villagebuildingname"
                  value={formData.villagebuildingname}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  htmlFor="field2"
                />
              </div>
              <div className="form-group">
                <TextField
                  label="หมู่ที่"
                  name="villagenumber"
                  value={formData.villagenumber}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  htmlFor="field3"
                />
              </div>
              <div className="form-group">
                <TextField
                  label="ซอย"
                  name="soi"
                  value={formData.soi}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                />
              </div>
              <div className="form-group">
                <TextField
                  label="ถนน"
                  name="streetname"
                  value={formData.streetname}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                />
              </div>
              </div>
              <div className="form-row">
              <div className="form-group">
                <TextField
                  label="รหัสไปรษณีย์"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={e => onSetZipCode(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  required
                />
              </div>        
              <div className="form-group">
                <FormControl fullWidth>
                  <InputLabel htmlFor="subDistrict">ตำบล/แขวง</InputLabel>
                  <Select
                    onChange={e => onSetDistrict(e.target.value)}
                    value={subDistrictSelect}
                    id="subDistrict"
                    disabled={zipCode.length !== 5}
                    fullWidth
                  >
                    <MenuItem value="">
                      <em>เลือก ตำบล/แขวง</em>
                    </MenuItem>
                    {!isDisabledSubDistrictSelect &&
                      subDistrict.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group">
                <TextField
                  label="อำเภอ/เขต"
                  name="district"
                  value={district}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled
                />
              </div>
              <div className="form-group">
                <TextField
                  label="จังหวัด"
                  name="province"
                  value={province}
                  margin="normal"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  disabled
                />
              </div>
            </div>
          </form>
        </div>
        
        );              
      case 2:
        return (
          <div className='lessors-information'>
            <div className="input-with-icon">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" 
                alt="PromptPay logo" 
                style={{ width: '170px', 
                         height: '84px', 
                         marginRight: '8px' 
                      }} 
              />              
            <TextField 
                label="หมายเลขพร้อมเพย์" 
                name="promptpayNumber"
                value={formData.promptpayNumber}
                onChange={handleChange}
                margin="normal" 
                variant="outlined" 
                color="secondary" 
                inputProps={{ maxLength: 12 }}
                fullWidth 
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className='lessors-information'>
              <div className="input-with-icon">
            <TextField 
              label="ชื่อหนังสือ" 
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            </div>
            <div className="input-with-icon">
            <TextField 
              label="ประเภทหนังสือ"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            </div>
            <div className="input-with-icon">
            <TextField 
              label="หมายเลข ISBN"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              inputProps={{ maxLength: 13 }}
              fullWidth 
            />
            </div>
            <div className="input-with-icon">
            <TextField 
              label="ชื่อผู้แต่ง"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            </div>
            <div className="input-with-icon">
            <TextField 
              label="เรื่องย่อ"
              name="introduction"
              value={formData.introduction}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              multiline 
              rows={3} 
              fullWidth 
            />
            </div>
            <div className="input-with-icon">
            <TextField 
              label="ราคาเช่าต่อวัน"
              name="pricePerDay"
              value={formData.pricePerDay}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            </div>
          </div>
        );
      case 4:
        return (
          <div className='lessors-information'>
            <div className="input-with-icon">
              <label htmlFor="coverUpload">อัพโหลดรูปภาพปกหนังสือ (สูงสุด 2 ภาพ)</label>
              <input type="file" id="coverUpload" accept="image/*" multiple onChange={handleCoverUpload} />
            </div>
            <div className="input-with-icon">
              {coverPreviews.length > 0 && coverPreviews.map((cover, index) => (
                <img key={index} src={cover} alt={`Book Cover Preview ${index + 1}`} style={{ width: '150px', height: 'auto', margin: '10px' }} />
              ))}
            </div>
            <div className="input-with-icon">
              <label htmlFor="sampleUpload">อัพโหลดรูปภาพตัวอย่างหนังสือ (สูงสุด 5   ภาพ)</label>
              <input type="file" id="sampleUpload" accept="image/*" multiple onChange={handleSampleUpload} />
            </div>
            <div className="input-with-icon">
                {samplePreviews.length > 0 && samplePreviews.map((sample, index) => (
                <img key={index} src={sample} alt={`Book Sample Preview ${index + 1}`} style={{ width: '150px', height: 'auto', margin: '10px' }} />
              ))}
            </div>
        </div>
        );
      case 5:
        return (
        <div className='lessors-information'>
            <Typography variant="h6" color="error">กรุณาตรวจสอบข้อมูลก่อนยืนยัน</Typography>
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
        {/* Back Arrow Icon */}
        <IonIcon 
              className='back'
              icon={closeCircleOutline} 
              style={{ fontSize: '45px', color: 'black', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} 
              onClick={() => navigate("/home")}
          />          
      </div>
    </div>
  );

};

export default StepperForm;

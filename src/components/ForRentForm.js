import React, { useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, TextField, FormControl, Radio, RadioGroup, FormControlLabel 
        , InputLabel , Select , MenuItem , Card, CardContent} from '@mui/material';
import { getAuth } from 'firebase/auth';
import { db } from '../utils/firebase'; // ปรับเส้นทางให้ถูกต้องตามโปรเจคของคุณ
import { ColorlibConnector, ColorlibStepIcon } from './CustomStepper';
import '../WebStyle/Lessors_Regis_Form.css';
import { IonIcon } from '@ionic/react'; // Corrected Ionic icon import
import { personOutline, callOutline, cardOutline , closeCircleOutline } from 'ionicons/icons';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { calendarOutline } from 'ionicons/icons'; // สำหรับ Ionicons
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import buddhistEra from 'dayjs/plugin/buddhistEra';
import NavBar from './NavBar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const storage = getStorage();

dayjs.extend(buddhistEra);

const thai = require('thai-data');

const uploadImage = async (file) => {
  if (!file) return null; // ถ้าไม่มีไฟล์ให้คืนค่า null
  const storageRef = ref(storage, `bookimages/${file.name}`); // ระบุเส้นทางที่ต้องการเก็บ
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef); // รับ URL ของไฟล์
  return url; // คืนค่า URL
};

const ForRentForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nameTitle: '',
    firstname: '',
    lastName: '',
    dateofBirth: '',
    telephone: '',
    thaiID: '',
    
    housenumber: '',
    villagebuildingname: '',
    villagenumber: '',
    soi: '',
    streetname: '',
    subDistrict: '',
    district: '',
    province: '',
    zipCode: '',
    
    promptpayNumber: '',
    
    bookName: '',
    genre: '',
    isbn: '',
    author: '',
    introduction: '',
    pricePerDay: '',
    coverbookimg: '',
    samplebookimg: '',

    availableforRent : true 
  });

  const steps = ['ข้อมูลส่วนตัว', 'ที่อยู่', 'บัญชีธนาคาร', 'ข้อมูลหนังสือ', 'ภาพหนังสือ', 'ยืนยันข้อมูล'];
  const auth = getAuth();
  const [birthDate, setBirthDate] = useState(null);
  const today = new Date();
  const maxDate = dayjs().subtract(15, 'year'); // 15 ปีจากวันปัจจุบัน
  const navigate = useNavigate();
  // ตัวอย่างการอัปโหลด
  const [coverbookimg, setCoverbookimg] = useState([]);
  const [samplebookimg, setSamplebookimg] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCoverUpload = async (e) => {
    setIsLoading(true); // เริ่มโหลด
    const files = e.target.files;
    const coverBookImgUrls = [];
  
    for (let i = 0; i < files.length; i++) {
      const coverBookFile = files[i];
      const coverBookImgUrl = await uploadImage(coverBookFile); // อัปโหลดและรับ URL
      coverBookImgUrls.push(coverBookImgUrl);
    }
  
    setFormData((prevData) => ({
      ...prevData,
      coverbookimg: coverBookImgUrls,
    }));
    setIsLoading(false); // โหลดเสร็จแล้ว
  };
  
  const handleSampleUpload = async (e) => {
    setIsLoading(true); // เริ่มโหลด
    const files = e.target.files;
    const sampleBookImgUrls = [];
  
    for (let i = 0; i < files.length; i++) {
      const sampleBookFile = files[i];
      const sampleBookImgUrl = await uploadImage(sampleBookFile); // อัปโหลดและรับ URL
      sampleBookImgUrls.push(sampleBookImgUrl);
    }
  
    setFormData((prevData) => ({
      ...prevData,
      samplebookimg: sampleBookImgUrls,
    }));
    setIsLoading(false); // โหลดเสร็จแล้ว
  };

  const handleFileChange = async (e) => {
    const coverBookFile = e.target.files[0]; // หรือใช้ e.target.files[1] สำหรับ samplebookimg
    const coverBookImgUrl = await uploadImage(coverBookFile); // อัปโหลดและรับ URL

    setFormData((prevData) => ({
      ...prevData,
      coverbookimg: coverBookImgUrl, // เก็บ URL ใน formData
    }));
  };

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
      zipCode: '',
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

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      Promise.all(uploadPromises).then((urls) => {
        setFormData((prevData) => ({
          ...prevData,
          [name]: urls, // เก็บ URL ของรูปภาพ
          [`${name}File`]: files, // เก็บข้อมูลไฟล์ด้วย
        }));
      }).catch((error) => {
        console.error("Error uploading image:", error);
      });
    }
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
        toast.info('กำลังบันทึกข้อมูล...'); // Show info toast while saving
        try {
            const forRentsCollectionRef = collection(db, "ForRents");
            await addDoc(forRentsCollectionRef, {
                ...formData,
                userId: user.uid,
                createdAt: serverTimestamp()
            });

            console.log('Rental information added successfully');
            toast.success('บันทึกข้อมูลสำเร็จ!'); // Show success toast
            handleReset();
            setTimeout(() => {
              navigate('/ShowBooks');
          }, 3000);
          
        } catch (error) {
            console.error("Error adding rental information: ", error);
            toast.error('บันทึกข้อมูลล้มเหลว!'); // Show error toast
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

  {/* ดึงข้อมูล จังหวัด อำเภอ ตำบล */ }
  const [zipCode, setZipCode] = useState('')
  const [subDistrict, setSubDistrict] = useState(Array)
  const [subDistrictSelect, setSubDistrictSelect] = useState('')
  const [district, setDistrict] = useState('')
  const [province, setProvince] = useState('')
  const [isDisabledSubDistrictSelect, setIsDisabledSubDistrictSelect] = useState(true)

  const onSetZipCode = (e) => {
    const newZipCode = e; // เก็บค่าที่อัปเดต
    setSubDistrictSelect('');
    setDistrict('');
    setProvince('');
  
    if (/^\d{0,5}$/.test(newZipCode)) {
      setZipCode(newZipCode);
      setFormData((prev) => ({
        ...prev,
        zipCode: newZipCode, // อัปเดต zipCode ใน formData
      }));
  
      if (thai.getAutoSuggestion(newZipCode).subDistrict) {
        const suggestions = thai.getAutoSuggestion(newZipCode).subDistrict;
        setSubDistrict(suggestions);
        setIsDisabledSubDistrictSelect(false);
      } else {
        setIsDisabledSubDistrictSelect(true);
      }
    }
  };

  const autoSuggestion = (zipCode, subDistrict) => {
    const { districtName, provinceName } = thai.getAutoSuggestion(zipCode, subDistrict);
    setDistrict(districtName);
    setProvince(provinceName);
    setFormData((prev) => ({
      ...prev,
      district: districtName, // อัปเดต district ใน formData
      province: provinceName, // อัปเดต province ใน formData
    }));
  };

  const onSetDistrict = (subDistrict) => {
    setSubDistrictSelect(subDistrict);
    autoSuggestion(zipCode, subDistrict);
    setFormData((prev) => ({
      ...prev,
      subDistrict: subDistrict, // อัปเดต subDistrict ใน formData
    }));
  };

  const handleDateChange = (date) => {
    if (date && date.isAfter(maxDate)) {
        alert('คุณต้องมีอายุมากกว่า 15 ปี');
    } else {
        setBirthDate(date); // ตั้งค่า birthDate
        const formattedDate = date.format('DD/MM/YYYY'); // แปลงวันที่เป็นรูปแบบที่ต้องการ

        // อัปเดต formData
        setFormData((prevData) => ({
            ...prevData,
            dateofBirth: formattedDate, // อัปเดต dateofBirth
        }));
    }
};

  const translateLabel = (key) => {
    const labels = {
      nameTitle: 'คำนำหน้า',
      firstname: 'ชื่อ',
      lastName: 'นามสกุล',
      dateofBirth: 'วันเกิด',
      telephone: 'เบอร์โทรศัพท์',
      thaiID: 'เลขบัตรประชาชน',
      
      housenumber: 'บ้านเลขที่',
      villagebuildingname: 'ชื่อหมู่บ้าน / อาคาร',
      villagenumber: 'หมู่ที่',
      soi: 'ซอย',
      streetname: 'ถนน',
      subDistrict: 'ตำบล/แขวง',
      district: 'อำเภอ/เขต',
      province: 'จังหวัด',
      zipCode: 'รหัสไปรษณีย์',

      promptpayNumber: 'หมายเลขพร้อมเพย์',
      
      bookName: 'ชื่อหนังสือ',
      genre: 'ประเภทหนังสือ',
      isbn: 'ISBN',
      author: 'ผู้แต่ง',
      introduction: 'บทนำ',
      pricePerDay: 'ราคา/วัน',
      coverbookimg: 'รูปภาพปกหนังสือ',
      samplebookimg: 'รูปตัวอย่างหนังสือ',
    };

    return labels[key] || key; // ถ้าไม่พบให้คืนค่า key เดิม
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
                color="secondary"
                fullWidth 
              />
            </div>
            <div className="input-with-icon">
              <div className='BirthDatePick' >
                <IonIcon icon={calendarOutline} />
                  <LocalizationProvider LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                          views={['year', 'month', 'day']} // Enable year, month, and day selection
                          label="Select your birth date"
                          value={birthDate}
                          onChange={handleDateChange}
                          maxDate={maxDate}
                          inputFormat="DD/MM/YYYY" // Display format
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
                    id="houseNumber"
                    type="text"
                    placeholder="บ้านเลขที่"
                    required
                    margin="normal"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="ชื่อหมู่บ้าน / อาคาร"
                    name="villagebuildingname"
                    value={formData.villagebuildingname}
                    onChange={handleChange}
                    id="villageBuildingName"
                    type="text"
                    margin="normal"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="หมู่ที่"
                    name="villagenumber"
                    value={formData.villagenumber}
                    onChange={handleChange}
                    id="villageNumber"
                    type="text"
                    margin="normal"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="ซอย"
                    name="soi"
                    value={formData.soi}
                    onChange={handleChange}
                    id="soi"
                    type="text"
                    margin="normal"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="ถนน"
                    name="streetname" // แก้ไขเป็น streetname
                    value={formData.streetname} // แก้ไขเป็น streetname
                    onChange={handleChange}
                    id="streetName"
                    type="text"
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
                    value={formData.zipCode}
                    onChange={e => onSetZipCode(e.target.value)}
                    id="zipCode"
                    type="text"
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
                      disabled={zipCode.length === 5 ? false : true}
                      id="subDistrict"
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
                    value={formData.district} // แก้ไขให้ใช้ formData
                    id="district"
                    type="text"
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
                    value={formData.province} // แก้ไขให้ใช้ formData
                    id="province"
                    type="text"
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
         <div className="lessors-information">
            <div className="input-with-icon">
              <label htmlFor="coverUpload">อัพโหลดรูปปกหนังสือ (สูงสุด 2 ภาพ)</label>
              <input type="file" id="coverUpload" accept="image/*" multiple onChange={handleCoverUpload} />
            </div>
            {isLoading && <p style={{ color: 'blue' }}>กำลังโหลด รอสักครู่...</p>}
            <div className="input-with-icon">
              {formData.coverbookimg && formData.coverbookimg.map((cover, index) => (
                <img key={index} src={cover} alt={`Book Cover Preview ${index + 1}`} style={{ width: '150px', margin: '10px' }} />
              ))}
            </div>
            <div className="input-with-icon">
              <label htmlFor="sampleUpload">อัพโหลดภาพเนื้อหาหนังสือ (สูงสุด 5 ภาพ)</label>
              <input type="file" id="sampleUpload" accept="image/*" multiple onChange={handleSampleUpload} />
            </div>
            {isLoading && <p style={{ color: 'blue' }}>กำลังโหลด รอสักครู่...</p>}
            <div className="input-with-icon">
              {formData.samplebookimg && formData.samplebookimg.map((sample, index) => (
                <img key={index} src={sample} alt={`Book Sample Preview ${index + 1}`} style={{ width: '150px', margin: '10px' }} />
              ))}
            </div>
          </div>
      );
      case 5:
        return (
            <div className='lessors-information'>
              <Typography variant="h6" color="error">กรุณาตรวจสอบข้อมูลก่อนยืนยัน</Typography>
              <br />
                {/* Card 1: ข้อมูลส่วนตัว */}
                <Card variant="outlined" style={{ marginBottom: '20px' }} className='detailcard' >
                    <CardContent >
                    <Typography variant="h6">ข้อมูลส่วนตัว</Typography>
                    {['nameTitle', 'firstname', 'lastName', 'dateofBirth', 'telephone', 'thaiID'].map((key) => (
                      <div key={key} className='review-item'>
                        <Typography className="label">{translateLabel(key)}:</Typography>
                        <Typography className="value">{formData[key]}</Typography>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Card 2: ข้อมูลการเงิน */}
                <Card variant="outlined" style={{ marginBottom: '20px' }} className='detailcard'>
                  <CardContent >
                    <Typography variant="h6">ข้อมูลการเงิน</Typography>
                    <div className='review-item'>
                      <Typography className="label">{translateLabel('promptpayNumber')}:</Typography>
                      <Typography className="value">{formData.promptpayNumber}</Typography>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3: ที่อยู่ */}
                <Card variant="outlined" style={{ marginBottom: '20px' }} className='detailcard' >
                  <CardContent >
                    <Typography variant="h6">ที่อยู่</Typography>
                    {['housenumber', 'villagebuildingname', 'villagenumber', 'soi', 'streetname', 'subDistrict', 'district', 'province' ].map((key) => (
                      <div key={key} className='review-item'>
                        <Typography className="label">{translateLabel(key)}:</Typography>
                        <Typography className="value">{formData[key]}</Typography>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Card 4: ข้อมูลหนังสือ */}
                <Card variant="outlined" style={{ marginBottom: '20px' }} className='detailcard'>
                  <CardContent>
                    <Typography variant="h6">ข้อมูลหนังสือ</Typography>
                    {['bookName', 'genre', 'isbn', 'author', 'introduction', 'pricePerDay', 'coverbookimg', 'samplebookimg'].map((key) => (
                      <div key={key} className='review-item'>
                        <Typography className="label">{translateLabel(key)}:</Typography>

                        {/* ตรวจสอบว่าเป็นรูปหรือไม่ */}
                        {key === 'coverbookimg' && formData.coverbookimg && (
                          Array.isArray(formData.coverbookimg) ? (
                            formData.coverbookimg.map((cover, index) => (
                              <img key={index} src={cover} alt={`Cover Book ${index + 1}`} className="preview-image" />
                            ))
                          ) : (
                            <img src={formData.coverbookimg} alt="Cover Book" className="preview-image" />
                          )
                        )}

                        {key === 'samplebookimg' && formData.samplebookimg && (
                          Array.isArray(formData.samplebookimg) ? (
                            formData.samplebookimg.map((sample, index) => (
                              <img key={index} src={sample} alt={`Sample Book ${index + 1}`} className="preview-image" />
                            ))
                          ) : (
                            <img src={formData.samplebookimg} alt="Sample Book" className="preview-image" />
                          )
                        )}
                        
                        {/* ถ้าไม่ใช่รูปภาพ จะแสดงเป็นข้อความ */}
                        {(key !== 'coverbookimg' && key !== 'samplebookimg') && (
                          <Typography className="value">{formData[key]}</Typography>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
          );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className="lessors-info-page"> 
      <NavBar/>
      <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          hideProgressBar={false} 
          closeOnClick 
          pauseOnHover 
          draggable 
          pauseOnFocusLoss 
      />
        <div className="forRent-container">
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

            {/* Back to homepage Icon */}
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

export default ForRentForm;

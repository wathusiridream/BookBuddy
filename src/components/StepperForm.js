import React, { useState , useEffect} from 'react';
import { Stepper, Step, StepLabel, Button, Typography, TextField , FormControl , FormLabel , Radio , RadioGroup , FormControlLabel } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../utils/firebase'; // ปรับเส้นทางให้ถูกต้องตามโปรเจคของคุณ
import { ColorlibConnector, ColorlibStepIcon } from './CustomStepper';
import '../WebStyle/Lessors_Regis_Form.css';
import { IonIcon } from '@ionic/react'; // Corrected Ionic icon import
import { personOutline, callOutline, cardOutline  } from 'ionicons/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addYears, isBefore ,subYears} from 'date-fns';


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
  const steps = ['ข้อมูลส่วนตัว', 'ที่อยู่', 'บัญชีธนาคาร', 'ข้อมูลหนังสือ', 'ยืนยันข้อมูล'];
  const auth = getAuth();
  const [birthDate, setBirthDate] = useState(null);
  const today = new Date();
  const minDate = addYears(today, -15); // 15 years ago


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
        await setDoc(lessorDocRef, formData);
        console.log('Lessor information saved successfully');
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

  const handleDateChange = (date) => {
    if (isBefore(date, minDate)) {
      setBirthDate(date);
    } else {
      alert('กรุณากรอกวันเกิด');
    }
  };

  const isValidDate = (date) => {
    const today = new Date();
    const minDate = subYears(today, 15);
    return date <= minDate;
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
                label="First Name" 
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
                label="Last Name"
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
                <DatePicker
                    selected={birthDate}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    maxDate={minDate}
                    showYearDropdown
                    yearDropdownItemNumber={15} // Show 15 years in dropdown
                    scrollableYearDropdown
                    placeholderText="Select your birth date"
                />
            </div>
            <div className="input-with-icon">
              <IonIcon icon={callOutline} />
              <TextField 
                label="Phone Number"
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
                label="Thai ID"
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
              <div className="px-0 py-0">
                <div className="p-4 antialiased text-gray-900 items-center">
                  <div className="grid grid-cols-12 gap-2 mt-4">
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor= "#">
                              บ้านเลขที่ *
                            </label>
                            <input 
                              name="housenumber" // เพิ่ม name ที่ตรงกับ formData
                              value={formData.housenumber}
                              onChange={handleChange}
                              className="shadow appearance-none border border-gray-200 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                              id="houseNumber"
                              type="text"
                              placeholder="บ้านเลขที่" 
                              required
                              />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor= "#">
                              ชื่อหมู่บ้าน / อาคาร 
                            </label>
                            <input 
                              name="villagebuildingname"
                              value={formData.villagebuildingname}
                              onChange={handleChange}
                              className="shadow appearance-none border border-gray-200 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                              id="houseNumber"
                              type="text"
                              placeholder="ชื่อหมู่บ้าน / อาคาร" />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor= "#">
                              หมู่ที่
                            </label>
                            <input 
                              name="villagenumber"
                              value={formData.villagenumber}
                              onChange={handleChange}
                              className="shadow appearance-none border border-gray-200 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                              id="houseNumber"
                              type="text"
                              placeholder="หมู่ที่" />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor= "#">
                              ซอย 
                            </label>
                            <input 
                              name="soi"
                              value={formData.soi}
                              onChange={handleChange}
                              className="shadow appearance-none border border-gray-200 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                              id="houseNumber"
                              type="text"
                              placeholder="ซอย" />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor= "#">
                              ถนน 
                            </label>
                            <input 
                              name="steetname"
                              value={formData.steetname}
                              onChange={handleChange}
                              className="shadow appearance-none border border-gray-200 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                              id="houseNumber"
                              type="text"
                              placeholder="ถนน" 
                              
                              />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                              รหัสไปรษณีย์ *
                            </label>
                            <input 
                              value={formData.zipCode} 
                              onChange={e => onSetZipCode(e.target.value)}
                              className="shadow appearance-none border border-gray-200 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500"
                              id="zipCode"
                              type="text"
                              placeholder="รหัสไปรษณีย์" />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="subDistrict">
                              ตำบล/แขวง *
                            </label>
                            <div className="relative">
                              <select
                                onChange={e => onSetDistrict(e.target.value)}
                                value={subDistrictSelect} disabled={zipCode.length === 5 ? false : true}
                                className={`block shadow  ${!isDisabledSubDistrictSelect ? 'text-gray-700' : 'bg-gray-200 text-gray-500'}
                                              appearance-none w-full border border-gray-200 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                                id="subDistrict"
                                placeholder=""
                              >
                                <option value="" disabled={!isDisabledSubDistrictSelect ? true : false}>
                                  เลือก ตำบล/แขวง</option>
                                {!isDisabledSubDistrictSelect &&
                                  subDistrict.map((item, index) => <option key={index}>{item}</option>)
                                }
                              </select>
                              {
                                !isDisabledSubDistrictSelect &&
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                  <svg className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                  </svg>
                                </div>
                              }
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="district">
                              อำเภอ/เขต *
                            </label>
                            <input value={district}
                              className="bg-gray-200 shadow appearance-none border border-gray-200  block w-full text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="district"
                              type="text"
                              placeholder="เลือก อำเภอ/เขต"
                              disabled />
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="lg:col-span-4 md:col-span-4 sm:col-span-4 col-span-4">
                      <div className="w-3/4 ">
                        <form className="bg-white shadow-md rounded px-4 pt-6 pb-4 mb-4">
                          <div className="mb-0">
                            <label className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="province">
                              จังหวัด *
                            </label>
                            <input value={province}
                              className="bg-gray-200 shadow appearance-none border border-gray-200  block w-full text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              id="province"
                              type="text"
                              placeholder="เลือก จังหวัด"
                              disabled />
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
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
                label="Promptpay Number" 
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
              label="Book Name" 
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
              label="Genre"
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
              label="ISBN Number"
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
              label="Author"
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
              label="Introduction"
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
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              margin="normal" 
              variant="outlined" 
              color="secondary" 
              fullWidth 
            />
            </div>
            <div className="input-with-icon">
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

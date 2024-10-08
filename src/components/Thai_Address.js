import React, { useState } from 'react';
import '../WebStyle/styles/custom.css'
import '../WebStyle/styles/main.css'
import '../WebStyle/styles/tailwind.css'
const thai = require('thai-data');

const Thai_Address = () => {

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

    return (
       <div className="px-4 py-4">
        <div className="p-4 antialiased text-gray-900 items-center">
        <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
        <div className="flex">
          <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <div>
            <p className="font-bold">ฟอร์ม สำหรับกรอก รหัสไปรษณีย์, ตำบล, อำเภอ และ จังหวัด ในประเทศไทย</p>
            <p className="text-sm">ได้รับแรงบันดาลใจ จาก เราไม่ทิ้งกัน.com</p>
          </div>
        </div>
        </div>
          <div className="grid grid-cols-12 gap-2 mt-4">
            <div  className="lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
            <div className="w-full">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                    รหัสไปรษณีย์ *
                  </label>
                  <input value={zipCode} onChange={e => onSetZipCode(e.target.value)} className="shadow appearance-none border border-gray-200 rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-gray-500" id="zipCode" type="text" placeholder="รหัสไปรษณีย์"/>
                </div>
              </form>
              </div>
            </div>
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
            <div className="w-full">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subDistrict">
                  ตำบล/แขวง *
                  </label>
                <div className="relative">
                <select 
                  onChange={e => onSetDistrict(e.target.value)}
                  value={subDistrictSelect} disabled={zipCode.length === 5 ? false : true} 
                  className={`block shadow  ${!isDisabledSubDistrictSelect ? 'text-gray-700' : 'bg-gray-200 text-gray-500'}  appearance-none w-full border border-gray-200 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500`}
                  id="subDistrict" 
                  placeholder=""
                >
                  <option value="" disabled={!isDisabledSubDistrictSelect ? true : false} >เลือก ตำบล/แขวง</option>
                  { !isDisabledSubDistrictSelect && 
                    subDistrict.map((item, index) => <option key={index}>{ item }</option>)
                  }
                </select>
                {
                  !isDisabledSubDistrictSelect &&
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                }
              </div>
                </div>
              </form>
              </div>
            </div>
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
            <div className="w-full">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="district">
                    อำเภอ/เขต *
                  </label>
                  <input value={district} className="bg-gray-200 shadow appearance-none border border-gray-200  block w-full text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="district" type="text" placeholder="เลือก อำเภอ/เขต" disabled/>
                </div>
              </form>
              </div>
            </div>
            <div className="lg:col-span-6 md:col-span-6 sm:col-span-12 col-span-12">
            <div className="w-full">
              <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="province">
                    จังหวัด *
                  </label>
                  <input value={province} className="bg-gray-200 shadow appearance-none border border-gray-200  block w-full text-gray-700 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="province" type="text" placeholder="เลือก จังหวัด" disabled/>
                </div>
              </form>
              </div>
            </div>
            </div>
          </div>
          <h1 className="text-center text-blue-500"><a rel="noopener noreferrer" href="https://facebook.com/JSKhamKham/" target="_blank">Made by JS ขำๆ</a></h1>
        </div>
    )
}
      

export default Thai_Address
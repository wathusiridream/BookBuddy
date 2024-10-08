import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isBefore, subYears } from 'date-fns';

const BirthdayPicker = () => {
  const [birthDate, setBirthDate] = useState(null);
  
  const handleDateChange = (newValue) => {
    setBirthDate(newValue);
  };

  const validateDate = (date) => {
    const today = new Date();
    const minDate = subYears(today, 15);
    return isBefore(date, minDate);
  };

  return (
    <div className="birthday-picker">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          label="Birth Date"
          value={birthDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
          maxDate={subYears(new Date(), 15)} // Limit to 15 years ago
          shouldDisableDate={(date) => !validateDate(date)} // Disable dates less than 15 years
        />
      </LocalizationProvider>
    </div>
  );
};

export default BirthdayPicker;

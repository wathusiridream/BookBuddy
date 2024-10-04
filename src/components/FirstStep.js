import React, { useContext } from 'react';
import { Button, TextField } from '@mui/material';
import { multiStepContext } from '../StepContext';

function FirstStep() {
  const { setStep, userData, finalData ,setUserData } = useContext(multiStepContext); // Correctly destructure the context

  return (
    <div>
      <div>
        <TextField 
          label="First Name" 
          value = {userData['firstname']}
          onChange={(e) => setUserData({...userData , "firstname" : e.target.value})} 
          margin="normal" 
          variant="outlined" 
          color="secondary" 
        />
      </div>
      <div>
        <TextField 
          label="Last Name"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
        />
      </div>
      <div>
        <TextField 
          label="Phone Number"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
        />
      </div>
      <div>
        <TextField 
          label="Thai ID"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
        />
      </div>
      <Button 
        variant="contained" 
        onClick={() => setStep(2)} 
        color="primary"
      >
        Next
      </Button>
    </div>
  );
}

export default FirstStep;

import React , {useContext} from 'react';
import { Button, TextField } from '@mui/material';
import { multiStepContext } from '../StepContext';

function ThirdStep() {
  const { setStep, userData, finalData ,submitData} = useContext(multiStepContext); // Correctly destructure the context

  return (
    <div>
      <div>
        <TextField 
          label="Book Name" 
          margin="normal" 
          variant="outlined" 
          color="secondary" 
        />
      </div>
      <div>
        <TextField 
          label="Genre"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
           
        />
      </div>
      <div>
        <TextField 
          label="ISBN Number"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
           
        />
      </div>
      <div>
        <TextField 
          label="Author"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
           
        />
      </div>
      <div>
        <TextField 
          label="Introduction"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
          multiline 
          rows={4} 
        />
      </div>
      <div>
        <TextField 
          label="Quantity"
          margin="normal" 
          variant="outlined" 
          color="secondary" 
        />
      </div>
      <div>
        <TextField 
          label="Price per Day"
          margin="normal" 
          variant="outlined" 
          color="secondary"  
        />
      </div>
      <div>
        <Button variant="contained" 
                onClick={() => setStep(2)} 
                color="primary"  
                style={{ marginRight: '10px' }} >Previous</Button>
        <Button variant="contained" 
                onClick={submitData} 
                color="primary">Submit</Button>
      </div>
    </div>
  );
}

export default ThirdStep;

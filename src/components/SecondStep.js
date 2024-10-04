import React , {useContext} from 'react'
import { Button, TextField } from '@mui/material';
import { multiStepContext } from '../StepContext';

function SecondStep() {

  const { setStep, userData, setUserData , finalData } = useContext(multiStepContext); // Correctly destructure the context

  return (
    <div>
    <div>
       <TextField label="House Number" 
                  value = {userData['housenumber']}
                  onChange={(e) => setUserData({...userData , "housenumber" : e.target.value})}
                  margin="normal" 
                  variant="outlined" 
                  color="secondary" />
    </div>
    <div><TextField label="District"
                    margin="normal" 
                    variant="outlined" 
                    color="secondary" />
    </div>
    <div><TextField label="Province"
                    margin="normal" 
                    variant="outlined" 
                    color="secondary" />
    </div>
    <div><TextField label="Post Number"
                    margin="normal" 
                    variant="outlined" 
                    color="secondary" />
    </div>
    <Button variant="contained" onClick={() => setStep(1)} color="primary"  style={{ marginRight: '10px' }} >Previous</Button>
     <Button variant="contained" onClick={() => setStep(3)} color="primary">Next</Button>
   </div>
  )
}
export default SecondStep;
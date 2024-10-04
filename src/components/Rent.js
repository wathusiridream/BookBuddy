import React , { useContext } from 'react'
import { Stepper, StepLabel, Step } from '@mui/material';
import FirstStep  from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import { multiStepContext } from '../StepContext';

function Rent() {
    const {currentStep , finalData} = useContext(multiStepContext);

    function showStep(Step) {
      switch(Step) {
        case 1 :
          return <FirstStep/>
        case 2 :
          return <SecondStep/>
        case 3 :
          return <ThirdStep/>
      }

  return (
    <div>
    <header className='App-Header'>
      <h3 style={{color:'red' , textDecoration:'underline' ,}}>ReactJS Multi Step App</h3>
      <div className='center-stepper'>
        <Stepper style={{width: '25%'}} activeStep={currentStep - 1} orientation='horizontal'>
          <Step>
            <StepLabel>

            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>
              
            </StepLabel>
          </Step>
        </Stepper>
      </div>
      {showStep (currentStep)}
      </header>
    </div>
  )
}
};

export default Rent;
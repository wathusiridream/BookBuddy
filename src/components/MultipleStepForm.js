import React, { useContext } from 'react';
import { Stepper, StepLabel, Step } from '@mui/material';
import FirstStep from './FirstStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import { multiStepContext } from '../StepContext'; 
import '../WebStyle/stepper.css'
import Home from './Home';


const MultiStepForm = ({onClose}) => {
    const { currentStep } = useContext(multiStepContext);

    function showStep(step) {
        switch(step) {
            case 1:
                return <FirstStep />;
            case 2:
                return <SecondStep />;
            case 3:
                return <ThirdStep />;
            
        }
    }

    return (
        <div className="stepper">
            <header className='stepper-Header'>
                <h3 style={{color: 'red', textDecoration: 'underline'}}>ReactJS Multi Step App</h3>
                <div className='center-stepper'>
                    <Stepper style={{width: '25%'}} activeStep={currentStep - 1} orientation='horizontal'>
                        <Step>
                            <StepLabel>Step 1</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Step 2</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Step 3</StepLabel>
                        </Step>
                    </Stepper>
                </div>
                {showStep(currentStep)}
            </header>
        </div>
    );
}

export default MultiStepForm;

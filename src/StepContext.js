import React, { useState } from 'react';
import MultiStepForm from './components/MultipleStepForm'; // Ensure this path is correct
import App from './App';
export const multiStepContext = React.createContext();

const StepContext = () => {
  const [currentStep, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [finalData, setFinalData] = useState({});

  function submitData() {
  }

  return (
    <multiStepContext.Provider value={{ currentStep, setStep, userData, setUserData, finalData, setFinalData }}>
      <App/>
      <MultiStepForm /> 
    </multiStepContext.Provider>
  );
}

export default StepContext;

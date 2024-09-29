import React from 'react'
import '../WebStyle/stepper.css'


const Stepper = (currentStep) => {

    const steps = ["Personal Info", "Contact Info", "Address", "Thai ID", "PromptPay"];

    return (
      <div className="stepper-container">
        {steps.map((step, index) => (
          <div key={index} className="step-container">
            <div className={`step ${index + 1 <= currentStep ? "active" : ""}`}>
              {index + 1}
            </div>
            {index !== steps.length - 1 && (
              <div className={`line ${index + 1 < currentStep ? "active" : ""}`} />
            )}
            <div className="step-label">{step}</div>
          </div>
        ))}
      </div>
    );
};

export default Stepper
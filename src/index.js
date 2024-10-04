import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import StepContext from './StepContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StepContext>
  <React.StrictMode>
      <App/>
  </React.StrictMode>
  </StepContext>  

  
);
reportWebVitals();

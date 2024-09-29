import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom'; // React Router hook for navigation
import '../WebStyle/Login.css';
import { IonIcon } from '@ionic/react'; // Corrected Ionic icon import
import { eyeOutline, eyeOffOutline } from 'ionicons/icons'; // Import specific icons

const Register = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
  const [name, setName] = useState('');
  const [surName, setSurName] = useState('');
  const [idNumber, setIdNumber] = useState('');

  // Handle input change for Thai ID number
  const handleIDNum = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters

    // Apply formatting
    let formattedValue = value;
    if (formattedValue.length > 1) {
      formattedValue = `${formattedValue.slice(0, 1)}-${formattedValue.slice(1)}`;
    }
    if (formattedValue.length > 6) {
      formattedValue = `${formattedValue.slice(0, 6)}-${formattedValue.slice(6)}`;
    }
    if (formattedValue.length > 12) {
      formattedValue = `${formattedValue.slice(0, 12)}-${formattedValue.slice(12)}`;
    }
    if (formattedValue.length > 15) {
      formattedValue = `${formattedValue.slice(0, 15)}-${formattedValue.slice(15)}`;
    }
    if (formattedValue.length > 17) {
      formattedValue = `${formattedValue.slice(0, 17)}-${formattedValue.slice(17)}`;
    }

    setIdNumber(formattedValue);
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Firebase authentication with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered as:', userCredential.user);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error registering:', error);
      setError('Registration failed. Please try again.');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>
      <section>
        <form onSubmit={handleRegister}>
          <h1>Register</h1>
          <div className="InputBox">
            <input
              type='email'
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>
          <div className="InputBox">
            <input
              type={showPassword ? 'text' : 'password'} // Toggle between password and text
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <IonIcon
              icon={showPassword ? eyeOffOutline : eyeOutline} // Toggle the eye icon for password visibility
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '20px', color: '#fff' }} // Adjust position and style
            />
            <label>Password</label>
          </div>
          <div className="InputBox">
            <input
              type={showConfirmPassword ? 'text' : 'password'} // Toggle between password and text
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <IonIcon
              icon={showConfirmPassword ? eyeOffOutline : eyeOutline} // Toggle the eye icon for confirm password visibility
              onClick={toggleConfirmPasswordVisibility}
              style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '20px', color: '#fff' }} // Adjust position and style
            />
            <label>Confirm Password</label>
          </div>
          <div className="InputBox">
            <input
              type='text'
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Name</label>
          </div>
          <div className="InputBox">
            <input
              type='text'
              placeholder="Surname"
              value={surName}
              onChange={(e) => setSurName(e.target.value)}
              required
            />
            <label>Surname</label>
          </div>   
          <div className="InputBox">
            <input
              type="text"
              id="thai-id"
              value={idNumber}
              maxLength="17"
              placeholder="Thai ID Number"
              onChange={handleIDNum}
              pattern="\d*" 
            />
            <label>Thai ID Number</label>
          </div>
          <button type="submit" className="login-button">Register</button>
          {error && <p className="error">{error}</p>}
        </form>
      </section>
    </div>
  );
};

export default Register;

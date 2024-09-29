import React, { useState , useEffect } from 'react';
import { signInWithGooglePopUp, signInWithFacebook, auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';  // React Router hook for navigation
import '../WebStyle/Login.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { IonIcon } from '@ionic/react'; // Corrected Ionic icon import
import { eyeOutline, eyeOffOutline, mailOutline } from 'ionicons/icons'; // Import specific icons
import { onAuthStateChanged } from 'firebase/auth';

const SignIn = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
  
  //Log in with Google
  const logGoogleUser = async () => {
    try {
      const response = await signInWithGooglePopUp();
      if (response.user) {
        console.log(response.user); // Handle response (user details) if needed
        navigate('/home'); // Navigate to the next page (home)
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  //Log in with Facebook
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithFacebook(); // Call the Facebook sign-in function
      console.log('User Info:', result.user);
      navigate('/home');  // Navigate to the home page after successful login
    } catch (error) {
      console.error("Facebook login error:", error);
    }
  };

  //Log in with Email + Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Firebase authentication with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in as:', userCredential.user);
      navigate('/home'); // Redirect to home page after successful login
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  // เปิด - ปิด การแสดงรหัสผ่าน
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //Remember Me
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/home'); // Redirect to home if user is already signed in
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, [navigate]);

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  //Register Navigate
  const registerHandle = () => {
    navigate('/register'); // Navigate to the Register page
  };
  

  return (
    <div>
      <section>
        <form onSubmit={handleSubmit}>
          <h1>Log In</h1>
          <br />
          <div className="InputBox">
            <IonIcon icon={mailOutline} /> 
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
          <div className="Forget">
          <label htmlFor="rememberMe">
              <input
                type='checkbox'
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMe}
              /> Remember me
            </label>
            <a href='#'>Forgot Password</a>
          </div>
          <button type="submit" className="login-button">Log In</button>
          <div className="Register">
            <p>I don't have an account <a href='#' className='ButtonRegister' onClick={registerHandle}>Register</a></p>
          </div>

          <p><center>or</center></p>
          <br />
          <button onClick={logGoogleUser} className="google-button">
            <img
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              alt="Google Logo"
              style={{ width: '30px', height: '30px' }}
            />
          </button>
          <button onClick={handleFacebookLogin} className="facebook-button">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
              alt="Facebook Logo"
              style={{ width: '30px', height: '30px' }}
            />
          </button>
        </form>
      </section>
    </div>
  );
};

export default SignIn;

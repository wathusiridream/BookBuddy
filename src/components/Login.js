import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import { signInWithGooglePopUp, signInWithFacebook, auth ,db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/style.css';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { IonIcon } from '@ionic/react'; // Corrected Ionic icon import
import { eyeOutline, eyeOffOutline, mailOutline } from 'ionicons/icons'; // Import specific icons
import ForgotPassword from './ForgotPassword';
import { getDoc , setDoc, doc } from "firebase/firestore";
import UserInformation from "./UserInformation";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset error message

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User already exists in Firestore.");
      } else {
        // Save user data to Firestore if new
        await saveUser(email, userId);
        console.log("User registered and saved to Firestore successfully.");
      }

      // Reset form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Navigate to the user-information page
      navigate('/user-information');

    } catch (error) {
      console.error("Error during registration:", error);
      setError(error.message);
    }
  };

  // Save user information in Firestore
  const saveUser = async (email, userId) => {
    await setDoc(doc(db, "users", userId), {
      email: email,
      // Add any other information you'd like to save
    });
  };
  
  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCredential.user.email;
  
      // ตรวจสอบว่าอีเมลลงท้ายด้วย '@bookbuddy.com'
      if (userEmail.endsWith('@bookbuddy.com')) {
        navigate('/adminHomepage'); // ถ้าใช่จะไปที่หน้า adminHomepage
      } else {
        navigate('/home'); // ถ้าไม่ใช่จะไปที่หน้า home
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials.');
    }
  };
  
  // Remember Me functionality
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
        navigate('/home');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
    if (e.target.checked) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }
  };

  //ForgotPassword
  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPassword(true); // Show the ForgotPassword component
  };

// Google Login
const logGoogleUser = async () => {
  try {
    const response = await signInWithGooglePopUp();
    if (response.user) {
      const userId = response.user.uid;
      const userEmail = response.user.email;

      // Check if the user exists in Firestore
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, save their email to Firestore
        await saveUser(userEmail, userId);
        navigate('/user-information'); // Redirect to user information page for new users
      } else {
        navigate('/home'); // Redirect to home page for existing users
      }
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

// Facebook Login
const handleFacebookLogin = async () => {
  try {
    const result = await signInWithFacebook();
    if (result.user) {
      const userId = result.user.uid;
      const userEmail = result.user.email;

      // Check if the user exists in Firestore
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If user doesn't exist, save their email to Firestore
        await saveUser(userEmail, userId);
        navigate('/user-information'); // Redirect to user information page for new users
      } else {
        navigate('/home'); // Redirect to home page for existing users
      }
    }
  } catch (error) {
    console.error("Facebook login error:", error);
  }
};

  // Toggle Register panels
  const toggleRegisterPanel = () => {
    setIsRightPanelActive(true);
  };

    // Toggle Register panels
  const toggleLoginPanel = () => {
    setIsRightPanelActive(false);
  };

    // Toggle show-not show Password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password show or not show
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
      {/* Register*/}
      <div className="form-container register-container">
            <form onSubmit={handleRegister}>
                <img
                  src = "logobook.png"
                  style={{ width: '200px', height: 'auto' }}
                />
                <h1>Register Here</h1>

                {/* Email Field */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <IonIcon
                        icon={mailOutline}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#888'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ paddingRight: '35px' }}
                    />
                </div>

                {/* Password Field */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <IonIcon
                        icon={showPassword ? eyeOffOutline : eyeOutline}
                        onClick={togglePasswordVisibility}
                        style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#888'
                        }}
                    />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ paddingRight: '35px' }}
                    />
                </div>

                {/* Confirm Password Field */}
                <div style={{ position: 'relative', width: '100%' }}>
                    <IonIcon
                        icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                        onClick={toggleConfirmPasswordVisibility}
                        style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#888'
                        }}
                    />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ paddingRight: '35px' }}
                    />
                </div>

                {/* Error Message */}
                {error && <p className="error" style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

                {/* Register Button */}
                <button type="submit">Register</button>

                <span>or use your account</span>

                {/* Social Buttons */}
                <div className="social-container">
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
                </div>
            </form>
        </div>
        
      {/* Login*/}
      <div>
      {!showForgotPassword ? (
        <div className="form-container login-container">
          <form onSubmit={handleSubmit}>
            <img
              src = "logobook.png"              
              style={{ width: '200px', height: 'auto' }}
              alt="Login"
            />
            <h1>Login Here</h1>
            {/* Email Field */}
            <div style={{ position: 'relative', width: '100%' }}>
              <IonIcon
                icon={mailOutline}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#888'
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingRight: '35px' }} // Adjust padding for the icon
              />
            </div>

            {/* Password Field */}
            <div style={{ position: 'relative', width: '100%' }}>
              <IonIcon
                icon={showPassword ? eyeOffOutline : eyeOutline}
                onClick={togglePasswordVisibility}
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#888'
                }} // Adjust icon position
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '35px' }} // Adjust padding for the icon
              />
            </div>

            {/* Error Message */}
            {error && <p className="error" style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

            {/* Remember Me Checkbox and Forgot Password Link */}
            <div className="content">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMe}
                />
                <label htmlFor="checkbox">Remember Me</label>
              </div>
              <div className="pass-link">
                <a href="#" onClick={handleForgotPasswordClick}>
                  Forgot Password?
                </a>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit">Login</button>
            <span>or use your account</span>

            {/* Social Buttons */}
            <div className="social-container">
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
            </div>
          </form>
        </div>
      ) : (
        <ForgotPassword />
      )}
    </div>


      {/* Overlay Transition*/}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
          <h1 className="title">Welcome Back <br/> to BookBuddy</h1>
          <p>If you have an account, log in here to continue your book journey!</p>
            <button className="ghost" onClick={toggleLoginPanel}> 
              Login
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1 className="title">Welcome to <br />BookBuddy</h1>
            <p>If you don't have an account, register here to start your reading adventure!</p>
            <button className="ghost" onClick={toggleRegisterPanel}> 
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

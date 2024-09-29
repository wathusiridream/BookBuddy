import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import '../WebStyle/style.css';
import { collection, query, where, getDocs } from "firebase/firestore";
import { IonIcon } from '@ionic/react'; // Use IonIcon component for icons
import { arrowBackCircleOutline } from 'ionicons/icons'; // Import specific icon

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const checkEmailExists = async (email) => {
        const q = query(collection(db, "users"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty; // Return true if email exists in Firestore
    };

    const forgotPassword = async (e) => {
        e.preventDefault();
        console.log("Attempting to send password reset email for:", email);

        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Please enter a valid email address.');
            setIsSuccess(false);
            return;
        }

        try {
            const emailExists = await checkEmailExists(email);

            if (!emailExists) {
                setMessage('No account found with this email. Please check your email address.');
                setIsSuccess(false);
                return;
            }

            await sendPasswordResetEmail(auth, email);
            console.log("Password reset email sent successfully");
            setMessage('Password reset email sent! Please check your inbox.');
            setIsSuccess(true);
        
        } catch (error) {
            console.error("Error sending email:", error);
            setMessage(error.message);
            setIsSuccess(false);
        }
    };

    const goToLogin = () => {
        navigate('/'); // Navigate to the login page
        window.location.reload(); // Refresh the page after navigation
    };

    return (
        <div className="form-container login-container">
            {/* Back button with an icon */}
            <div className="back-icon" onClick={goToLogin} style={{ cursor: 'pointer' }}>
                <IonIcon icon={arrowBackCircleOutline} size="large" />
            </div>
            <form onSubmit={forgotPassword}>
                <h1>Reset Password</h1>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Email</button>
                {message && (
                    <p className="message" style={{ color: isSuccess ? 'green' : 'red' }}>
                        {message}
                    </p>
                )}
                {/* Back to login link */}
                <a href='#' type="button" onClick={goToLogin}>
                    Back to Login
                </a>
            </form>
        </div>
    );
}

export default ForgotPassword;

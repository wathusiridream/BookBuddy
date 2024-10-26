import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import UserInformation from './components/UserInformation';
import Lessors_Dashboard from './components/Lessors_Dashboard';
import StepperForm from './components/StepperForm';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user-information" element={<UserInformation />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Rental" element={<StepperForm />} />
            <Route path="/Lessors-Dashboard" element={<Lessors_Dashboard />} />
          </Routes>
        </Router>
    </div>

  );
}

export default App;

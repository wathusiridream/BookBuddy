import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import UserInformation from './components/UserInformation';
import Lessors_Dashboard from './components/Lessors_Dashboard';
import StepperForm from './components/StepperForm';
import Thai_Address from './components/Thai_Address';
import RentalForm from './components/RentalForm';
import CheckSlip from './components/CheckSlip';
import RentHistory from './components/RentHistory';
import QRCodeGenerator from './components/QRCode';
import ReceiveDetails from './components/ReceiveDetails'; // เปลี่ยนชื่อเป็น ReceiveDetails
import ReturnDetails from './components/ReturnDetails';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user-information" element={<UserInformation />} />
            <Route path="/rental-form" element={<RentalForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Rental" element={<StepperForm />} />
            <Route path="/Lessors-Dashboard" element={<Lessors_Dashboard />} />
            <Route path='/ThaiAddress' element={<Thai_Address />} />
            <Route path='/CheckSlip' element={<CheckSlip />} />
            <Route path='/RentHistory' element={<RentHistory />} />
            <Route path='/QRCode' element={<QRCodeGenerator />} />
            <Route path="/" element={<RentalForm />} />
            <Route path="/receive-details/:rentalId" element={<ReceiveDetails />} />
            <Route path="/return-details/:rentalId" element={<ReturnDetails />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;

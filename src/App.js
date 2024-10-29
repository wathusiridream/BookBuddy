import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import UserInformation from './components/UserInformation';
import ForRentForm from './components/ForRentForm';
import AdminHomepage from './components/AdminHomepage';
import Showbook from './components/Showbooks';
import ProfileEdit from './components/ProfileEdit';
import RentingHistory from './components/ForRentHistory';
import RentalForm from './components/RentalForm';
import CheckSlip from './components/CheckSlip';
import RentHistory from './components/RentHistory';
import QRCodeGenerator from './components/QRCode';
import ReceiveDetails from './components/ReceiveDetails'; 
import ReturnDetails from './components/ReturnDetails';
import BookDetail from './components/BookDetail';
import ForRentHistory from './components/ForRentHistory';
import UserInformationForm from './components/UserInformation';
import AllRentalHistory from './components/AllRentalHistory';
import AllMemBers from './components/AllMemBers';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user-information" element={<UserInformation />} />
            <Route path="/home" element={<Home />} />
            <Route path="/ForRent" element={<ForRentForm />} />
            <Route path="/adminHomepage" element={<AdminHomepage />} />
            <Route path='/ShowBooks' element={<Showbook/>}/>
            <Route path='/ProfileEdit' element={<ProfileEdit/>}/>
            <Route path='/RentingHistory' element={<RentingHistory />} />
            <Route path='/CheckSlip' element={<CheckSlip />} />
            <Route path='/RentHistory' element={<RentHistory />} />
            <Route path='/QRCode' element={<QRCodeGenerator />} />
            <Route path="/Rentals/:id" element={<RentalForm />} />
            <Route path="/receive-details/:rentalId" element={<ReceiveDetails />} />
            <Route path="/return-details/:rentalId" element={<ReturnDetails />} />
            <Route path="/BooksDetail/:id" element={<BookDetail />} />
            <Route path="/ForRentHistory" element={<ForRentHistory />} />            
            <Route path="/UserInformationForm/:id" element={<UserInformationForm/>}/>
            <Route path="/AllRental" element={<AllRentalHistory/>}/>
            <Route path="/AllMembers" element={<AllMemBers/>}/>
          </Routes>
        </Router>
    </div>

  );
}

export default App;

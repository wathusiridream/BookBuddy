import './App.css';
//import Form from './components/Form'
//import TodoList from './components/TodoList'
import SignIn from './components/SignIn';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Register from './components/SignUp';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import UserInformation from './components/UserInformation';
//import Lessors_Regis from './components/Lessors_Regis';
import Rental from './components/Rental';
import Lessors_Dashboard from './components/Lessors_Dashboard';
import MultiStepForm from './components/FirstStep'
import StepContext from './StepContext';

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user-information" element={<UserInformation />} />
            <Route path="/home" element={<Home />} />
            <Route path="/lessors-regis" element={<MultiStepForm />} /> {/* Updated path */}
            <Route path="/Rental" element={<Rental />} />
            <Route path="/Lessors-Dashboard" element={<Lessors_Dashboard />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;

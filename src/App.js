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
import Lessors_Regis from './components/Lessors_Regis';
import Rental from './components/Rental';
import Lessors_Dashboard from './components/Lessors_Dashboard';
import Stepper from './components/Stepper';
import StepperControl from './components/StepperControl';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/user-information" element={<UserInformation />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Lessors-Regis" element={<Lessors_Regis />} />
          <Route path="/Rental" element={<Rental />} />
          <Route path='/Lessors-Dashboaard' element={<Lessors_Dashboard/>}/>
          <Route path='/Stepper' element={<Stepper/>}/>
          <Route path='/StepperControl' element={<StepperControl/>}/>

        </Routes>
      </Router>
    </div>
  );
}

export default App;

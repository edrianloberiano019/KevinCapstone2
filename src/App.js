import './App.css';
import Homepage from './components/Homepage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPortal from './adminportal/AdminPortal';
import StaffPortal from './staffportal/StaffPortal';
import CreateAccount from './components/CreateAccount';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Terms from './components/Terms';

function App() {
  return (
    <Router>
      <ToastContainer />
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/Homepage" />} />
          <Route path="/Homepage" element={<Homepage />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/staff" element={<StaffPortal />} />
          <Route path="/CreateAccount" element={<CreateAccount />} />
          <Route path="/TermsandCondition" element={<Terms />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

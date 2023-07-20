import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Verification from './Pages/Verification';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    // <a href="https://sda11serverlessproject.auth.us-east-1.amazoncognito.com/login?client_id=4is01usckduv6qbvrn76c6em3v&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000" 
    // > Login </a>    
  );
}

export default App;

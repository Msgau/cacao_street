import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Error404 from './error404/error404';
import Home from './home/Home';
import PostEmplacement from './emplacement/emplacement';
import Login from './connexion/Connexion';
import Login2 from './connexion/ConnexionOld';
import SignUp from './connexion/Inscription';
import Profile from '../components/test_co/profile.component';
import Dashboard from './dashboard/dashboard';

function RouteConfiguration() {
    return(
<div className="page-container">
      <div className="content-wrap">
      
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/*" element={<Error404 />} />
            <Route path="/addPlace" element={<PostEmplacement />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login2" element={<Login2 />} />
            <Route path="/signup" element={<SignUp />} />       
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
  
      </div>
      {/* <Footer /> */}
    </div>
    );
  }
  
  export default RouteConfiguration;
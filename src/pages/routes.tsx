import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Error404 from './error404/error404';
import Home from './home/Home';
import PostEmplacement from './emplacement/emplacement';
import Login from './connexion/Connexion';
import SignUp from './connexion/Inscription';
import Profile from './test_co/profile';
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
            <Route path="/addplace" element={<PostEmplacement />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />       
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profil" element={<Profile />} />
            {/* <Route path='/:username' element{Profile} */}
          </Routes>
        </Router>
  
      </div>
      {/* <Footer /> */}
    </div>
    );
  }
  
  export default RouteConfiguration;
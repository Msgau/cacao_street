import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import './Connexion.css';
import { NavLink } from "react-router-dom";

const Login2: React.FC = () => {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8989/auth/login', { email, password });
      const token = response.data.access_token;
      console.log("response : ", response);
      console.log(token);
      if (token) {
        localStorage.setItem('token', token);
        navigate('/home');
      } else {
        setError('Erreur de connexion');
      }
    } catch (error) {
      setError('Identifiants incorrects');
    }
  };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    return (
        <div>

            <Header />
            <div className='loginPage'>
                <h2>Connexion</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                       <label>Identifiant:</label>
                       <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                    </div>
                    <div>
                        <label>Mot de passe:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='connexion'>
                    {error && <div>{error}</div>}
                    <button type="submit">Se connecter</button>
                    <p><NavLink to="/signup">Créer un compte</NavLink></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login2;
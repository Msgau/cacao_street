import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import './Connexion.css';
import config from '../../config';

const API_URL_SIGNUP = config.url_signup;
const emailRegex = config.regex;

const SignUp: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Adresse e-mail invalide');
      return;
    }
    try {
      const response = await axios.post(API_URL_SIGNUP, {
        username: userName,
        email: email,
        password: password,
        roles: ['user']
      });
      if (response.status === 200) {
        navigate('/login');
      } else {
        setError('Erreur lors de la création de compte');
      }
    } catch (error) {
      setError('Une erreur s\'est produite lors de la création de compte: ' + error.message);
    }
  };

  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  return (
    <div>
      <Header />
      <div className='loginPage'>
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Pseudo :</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Adresse e-mail :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className='connexion'>
            {error && <div>{error}</div>}
            <button type="submit">Créer un compte</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

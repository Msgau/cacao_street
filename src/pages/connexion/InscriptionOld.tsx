import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/Header/Header';
import './Connexion.css';

const SignUp: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8989/users', { userName, email, password }); // Endpoint pour la création de compte
      const data = response.data;
      console.log(data);
      if (data.message === "UserCreated") {
        navigate('/home');
      } else {
        setError('Erreur lors de la création de compte');
      }
    } catch (error) {
      setError('Une erreur s\'est produite lors de la création de compte');
    }
  };

  return (
    <div>
      <Header />
      <div className='loginPage'>
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>UserName :</label>
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

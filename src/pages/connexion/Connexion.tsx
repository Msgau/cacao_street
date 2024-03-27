import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from '../../components/Header/Header';
import AuthService from '../../services/auth.service';
import './Connexion.css';

const Login: React.FC = () => {
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('This field is required!'),
    password: Yup.string().required('This field is required!'),
  });

  const handleSubmit = async (formValues: { username: string; password: string }) => {
    const { username, password } = formValues;
    console.log(formValues);
    try {
      const response = await AuthService.login(username, password);
      console.log(response)
      const token = response.accessToken;
      console.log(token)
      if (token) {
        console.log("connecté");
        localStorage.setItem('token', token);
        navigate('/home');
      } else {
        setError('Erreur de connexion');
      }
    } catch (error) {
      setError('Identifiants incorrects');
    }
  };
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: '',
  };

  return (
    <div>
      <Header />
      <div className="loginPage">
        <h2>Connexion</h2>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form>
            <div>
              <label>Nom d'utilisateur:</label>
              <Field type="text" name="username" required />
              <ErrorMessage name="username" component="div" />
            </div>
            <div>
              <label>Mot de passe:</label>
              <Field type="password" name="password" required />
              <ErrorMessage name="password" component="div" />
            </div>
            <div className="connexion">
              {error && <div>{error}</div>}
              <button type="submit">Se connecter</button>
            </div>
          </Form>
        </Formik>
        <p>
          <NavLink to="/signup">Créer un compte</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;

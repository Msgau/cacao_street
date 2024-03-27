import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import authService from "../../services/auth.service";

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const Header: React.FC = () => {
  // Récupérer les informations de l'utilisateur depuis le local storage
  const userString = localStorage.getItem("user");
  const user: User | null = userString ? JSON.parse(userString) : null;

  // Vérifier si l'utilisateur est connecté
  const isLoggedIn: boolean =
    !!user && !!user.roles && user.roles.includes("ROLE_USER");

  // Vérifier si l'utilisateur est un admin
  const isAdmin: boolean =
    !!user && !!user.roles && user.roles.includes("ROLE_ADMIN");

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    // Appeler la méthode logout de authService
    authService.logout();
  };

  return (
    <header>
      <div className="baseHeader">
      <h1>
        <NavLink to="/home" className="home">
        &gt;CACAOSTREET
        </NavLink>
      </h1>
      <nav>
        <ul>
          <li>Accueil</li>
          {/* Vérifier si l'utilisateur est connecté et a le rôle ROLE_USER */}
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <li>
                  <NavLink to="/dashboard" className="dashboardLink">
                    Dashboard
                  </NavLink>
                </li>
              )}
              <li>
                Mes cacaos
              </li>
              <li>
                <NavLink
                  to="/home"
                  className="logoutLink"
                  onClick={handleLogout}
                >
                  Déconnexion
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login" className="loginLink">
                Connexion
              </NavLink>
            </li>
          )}
          {/* <li>Mes cacaos</li> */}
        </ul>
      </nav>
      </div>
      {isLoggedIn ? (
        <div className="addPlace">
          <NavLink to="/addPlace" className="addPlaceLink">
            Ajouter un emplacement
          </NavLink>
        </div>
      ) : ""}
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import IUser from "../../types/user.type";
import Header from "../../components/Header/Header";
import './profile.css';
import ModalPatchUser from "../../components/ModalPatchUser/ModalPatchUser";
import config from "../../config";

const passwordRegex = config.passwordRegex;

const Profile = () => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [userReady, setUserReady] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser & { accessToken: string }>({ accessToken: "" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalAdressOpen, setIsModalAdressOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [newAdress, setNewAdress] = useState<string>("");
  const [newAdressPassword, setNewAdressPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [informationMessage, setInformationMessage] = useState<string>("");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleModalAdress = () => {
    setIsModalAdressOpen(!isModalAdressOpen);
  };

  const handleCloseModalNewPassword = () => {
    setErrorMessage("");
    setInformationMessage("");
    setIsModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleCloseModalAddress = () => {
    setIsModalAdressOpen(false);
    setErrorMessage("");
    setInformationMessage("");
    setNewAdress("");
    setNewAdressPassword("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Ancien mot de passe") setOldPassword(value);
    if (name === "Nouveau mot de passe") setNewPassword(value);
    if (name === "confirmer le nouveau mot de passe") setConfirmPassword(value);
  };

  const handleChangeAdress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "Votre nouvelle adresse") setNewAdress(value);
    if (name === "Votre mot de passe") setNewAdressPassword(value);
  };

  const handleSubmitNewPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier si les mots de passe ne sont pas vides
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    // Vérifier si les nouveaux mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    // Vérifier la complexité du nouveau mot de passe
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.");
      return;
    }

    // Envoyer la demande de modification du mot de passe
    try {
      const response = await fetch(`http://localhost:8989/api/users/${currentUser.id}/newpassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.accessToken
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });
      const data = await response.json();
      if (data.message === "User Updated"){
        setInformationMessage("Modification réussie !");
        setTimeout(() => {
          handleCloseModalNewPassword();
        }, 2000);
      }
      else {
        setErrorMessage("Erreur lors de la modification du mot de passe. Vérifiez l'état du réseau ou la conformité de votre ancien mot de passe.");
      }
    } catch (error) {
      console.error('Erreur lors de la modification du mot de passe :', error);
      setErrorMessage("Une erreur s'est produite lors de la modification du mot de passe.");
    }
  };

  const handleSubmitAdress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier si les champs ne sont pas vides
    if (!newAdress || !newAdressPassword) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    // Envoyer la demande de modification de l'adresse e-mail
    try {
      const response = await fetch(`http://localhost:8989/api/users/${currentUser.id}/newemail`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': currentUser.accessToken
        },
        body: JSON.stringify({
          password: newAdressPassword,
          newEmail: newAdress
        })
      });
      const data = await response.json();
      if (data.message === "User Updated"){
        handleCloseModalAddress(); // Fermer la modale après modification réussie
      }
    } catch (error) {
      console.error('Erreur lors de la modification de votre adresse mail :', error);
      setErrorMessage("Une erreur s'est produite lors de la modification de votre adresse mail.");
    }
  };

  const isFormValid = oldPassword && newPassword && confirmPassword;
  const isFormValidAdress = newAdress && newAdressPassword;

  return (
    <div>
      <Header />

      <div className="ProfileContainer">
        {userReady &&
          <div>
            <h3>
              Profil de <strong>{currentUser.username}</strong>
            </h3>

            <p>
              <strong>Id:</strong>{" "}
              {currentUser.id}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {currentUser.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
              {currentUser.roles &&
                currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
            <div className="patchButtons">
              <button onClick={toggleModalAdress}>Modifier mon Adresse</button>
              <button onClick={toggleModal}>Modifier mon mot de passe</button>
            </div>
          </div>
        }
        <ModalPatchUser
          isOpen={isModalOpen}
          onClose={handleCloseModalNewPassword}
          onSubmit={handleSubmitNewPassword}
          handleChange={handleChange}
          errorMessage={errorMessage}
          informationMessage={informationMessage}
          isFormValid={isFormValid}
          title="Modifier mon mot de passe"
          label1="Ancien mot de passe"
          label2="Nouveau mot de passe"
          label3="confirmer le nouveau mot de passe"
          type1="password"
          type2="password"
          type3="password"
        />
        <ModalPatchUser
          isOpen={isModalAdressOpen}
          onClose={handleCloseModalAddress}
          onSubmit={handleSubmitAdress}
          handleChange={handleChangeAdress}
          errorMessage={errorMessage}
          informationMessage={informationMessage}
          isFormValid={isFormValidAdress}
          title="Modifier mon adresse"
          label1="Votre nouvelle adresse"
          label2="Votre mot de passe"
          label3=""
          type1="email"
          type2="password"
          type3=""
        />
      </div>
    </div>
  );
}

export default Profile;

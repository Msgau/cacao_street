import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import IUser from "../../types/user.type";
import Header from "../../components/Header/Header";
import './profile.css';
import ModalPatchUSer from "../../components/ModalPatchUser/ModalPatchUser";

const Profile = () => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [userReady, setUserReady] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser & { accessToken: string }>({ accessToken: "" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) setRedirect("/home");
    setCurrentUser(currentUser);
    setUserReady(true);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.");
      return;
    }

    // Envoyer la demande de modification du mot de passe
    try {
      const response = await AuthService.changePassword(oldPassword, newPassword);
      // Traiter la réponse (redirection, message de succès, etc.)
      console.log(response); // Vous pouvez ajouter une logique pour gérer la réponse
      toggleModal(); // Fermer la modale après modification réussie
    } catch (error) {
      console.error('Erreur lors de la modification du mot de passe :', error);
      setErrorMessage("Une erreur s'est produite lors de la modification du mot de passe.");
    }
  }

  const isFormValid = oldPassword && newPassword && confirmPassword;

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
            <p>
              <button onClick={toggleModal}>Modifier mon mot de passe</button>
            </p>
          </div>
        }
        {isModalOpen && (
          <div className="PasswordModal" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={toggleModal}>&times;</span>
              <h2>Modifier mon mot de passe</h2>
              <form onSubmit={handleSubmit} className="formChangePassword">
                <label htmlFor="oldPassword">Ancien mot de passe</label>
                <input type="password" name="oldPassword" placeholder="Ancien mot de passe" onChange={handleChange} />
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input type="password" name="newPassword" placeholder="Nouveau mot de passe" onChange={handleChange} />
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                <input type="password" name="confirmPassword" placeholder="Confirmer le nouveau mot de passe" onChange={handleChange} />
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button type="submit" disabled={!isFormValid} className={isFormValid ? "formOk" : "formNotOk"}>Modifier</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;

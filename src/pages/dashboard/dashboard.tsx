import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./dashboard.css";
import MapTool from "../../components/map/MapTool";
interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

const Dashboard: React.FC = () => {
    // Récupérer les informations de l'utilisateur depuis le local storage
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");

    // Vérifier si l'utilisateur est connecté et a le rôle ROLE_ADMIN
    const isAdmin: boolean =
        !!user && !!user.roles && user.roles.includes("ROLE_ADMIN");

    const navigate = useNavigate();

    // Rediriger vers la page d'accueil si l'utilisateur n'est pas un admin
    useEffect(() => {
        if (!isAdmin) {
            navigate("/home");
        }
    }, [isAdmin, navigate]);

    if (!isAdmin) {
        return null;
    }

    return (
        <div>
            <Header />
            <div className="dashboard">

                <div className="dashboardMain">
                    <div className="usersRequest">
                        <h2>Requêtes utilisateurs</h2>
                        <div className="exempleUser">
                            <h3>Requête utilisateur 1</h3>
                            <p>message utilisateur</p>
                            <button>agrandir</button>
                        </div>
                        <div className="exempleUser">
                            <h3>Requête utilisateur 2</h3>
                            <p>Données gmaps fournies</p>
                            <button>modifier</button>
                            <button>valider</button>
                            <button>X</button>
                        </div>
                    </div>
                    <div className="right">
                        <input type="text"
                            className="searchDtb"
                            placeholder="Recherche dans la base de données" />
                        <div className="resultsBdd">
                            Résultats recherche BDD
                        </div>
                        <div className="dashboardMapContainer">
                            <MapTool
                                classNameMap={"dashboardMap"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

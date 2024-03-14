import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./dashboard.css";
import MapTool from "../../components/map/MapTool";
import NewPlace from "../../components/DashboardRequest/NewPlace";
import axios from "axios";
import data from "../../data/data.json"; // Importer les données du fichier JSON

interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

interface Shop {
    id: number;
    name: string;
    addressShop: string;
    position: string;
    price: number;
    hours: string | null;
}
interface Shop {
    id: number;
    name: string;
    addressShop: string;
    position: string;
    price: number;
    hours: string | null;
}

const Dashboard: React.FC = () => {
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin: boolean =
        !!user && !!user.roles && user.roles.includes("ROLE_ADMIN");
    const navigate = useNavigate();
    const [shops, setShops] = useState<Shop[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Shop[]>("http://localhost:8989/chocolate");
                const shopsValidation = response.data.data
                console.log(response);
                console.log(shopsValidation);
                setShops(shopsValidation);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

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

                        {shops.map((shop) => {
                            return (
                                <NewPlace
                                    key={shop.id} 
                                    placeName={shop.name} 
                                    placeDetails={`${shop.position}, ${shop.price}`}
                                />
                            );
                        })}
                    </div>
                    <div className="right">
                        <input type="text" className="searchDtb" placeholder="Recherche dans la base de données" />
                        <div className="resultsBdd">Résultats recherche BDD</div>
                        <div className="dashboardMapContainer">
                            <MapTool classNameMap={"dashboardMap"} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
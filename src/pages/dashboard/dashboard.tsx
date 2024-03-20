import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./dashboard.css";
import MapTool from "../../components/map/MapTool";
import NewPlace from "../../components/DashboardRequest/NewPlace";
import axios from "axios";

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
    hours: JSON | null;
}

const Dashboard: React.FC = () => {
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin: boolean =
        !!user && !!user.roles && user.roles.includes("ROLE_ADMIN");
    const navigate = useNavigate();
    const [shops, setShops] = useState<Shop[]>([]);

    const handleValidate = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "x-access-token": token
            };
            // Effectuer la mise à jour du statut allowed du shop
            await axios.patch(`http://localhost:8989/chocolate/${id}`, { allowed: true }, { headers });
            // On met à jour le state des shops en local
            setShops(shops.map(shop => shop.id === id ? { ...shop, allowed: true } : shop));
            // On supprime l'objet patché du dom.
            setShops(shops.filter(shop => shop.id !== id));
        } catch (error) {
            console.error("Error validating shop:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Shop[]>("http://localhost:8989/chocolate");
                const shopsValidation = response.data.data;
                // Filtrer les shops dont le statut allowed est à false
                const filteredShops = shopsValidation.filter(shop => !shop.allowed);
                setShops(filteredShops);
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

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                "x-access-token": token
            };
            await axios.delete(`http://localhost:8989/chocolate/${id}`, { headers });
            // Mettre à jour le dom
            setShops(shops.filter(shop => shop.id !== id));
        } catch (error) {
            console.error("Error deleting shop:", error);
        }
    };

    return (
        <div>
            <Header />
            <div className="dashboard">
                <div className="dashboardMain">
                    <div className="usersRequest">
                        {shops.map((shop) => {
                            return (
                                <NewPlace
                                    id={shop.id}
                                    key={shop.id}
                                    placeName={shop.name}
                                    addressShop={shop.addressShop}
                                    price={shop.price}
                                    placeDetails={`${shop.position}`}
                                    onDelete={() => handleDelete(shop.id)}
                                    closing={shop.hours}
                                    onValidate={() => handleValidate(shop.id)}
                                />
                            );
                        })}
                    </div>
                    <div className="right">
                        <input type="text" className="searchDtb" placeholder="Recherche dans la base de données" />
                        <div className="resultsBdd">Résultats recherche BDD</div>

                        <MapTool classNameMap={"dashboardMap"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

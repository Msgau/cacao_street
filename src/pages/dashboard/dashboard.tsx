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

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8989/chocolate/${id}`);
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
                                    price = {shop.price}
                                    placeDetails={`${shop.position}`}
                                    onDelete={() => handleDelete(shop.id)}
                                    closing={shop.hours}
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./dashboard.css";
import MapTool from "../../components/map/MapTool";
import NewPlace from "../../components/DashboardRequest/NewPlace";
import axios from "axios";
import ReportCard from "../../components/ReportCard/ReportCard";

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

interface Report {
    id: number;
    body: string;
    user_Id: number;
    chocolate_Id: number;
    isClose: boolean;
}

const Dashboard: React.FC = () => {
    const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
    const isAdmin: boolean = !!user && !!user.roles && user.roles.includes("ROLE_ADMIN");
    const navigate = useNavigate();
    const [shops, setShops] = useState<Shop[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const token = localStorage.getItem("token");

    const handleValidatePlace = async (id: number) => {
        try {
            const headers = {
                "x-access-token": token
            };
            await axios.patch(`http://localhost:8989/chocolate/${id}`, { allowed: true }, { headers });
            setShops(prevShops => prevShops.map(shop => shop.id === id ? { ...shop, allowed: true } : shop));
            setShops(prevShops => prevShops.filter(shop => shop.id !== id));
        } catch (error) {
            console.error("Error validating shop:", error);
        }
    };

    const handleCloseReport = async (id: number) => {
        try {
            const headers = {
                "x-access-token": token
            };
            console.log(id)
            await axios.patch(`http://localhost:8989/reporting/${id}`, { isClose: true }, { headers });
            setReports(prevReports => prevReports.map(report => report.id === id ? { ...report, isClose: true } : report));
            setReports(prevReports => prevReports.filter(report => report.id !== id));
        } catch (error) {
            console.error("Error closing report:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Shop[]>("http://localhost:8989/chocolate");
                const shopsValidation = response.data.data;
                const filteredShops = shopsValidation.filter(shop => !shop.allowed);
                setShops(filteredShops);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                if (token) {
                    const headers = {
                        "x-access-token": token
                    };
                    const response = await axios.get<Report[]>("http://localhost:8989/reporting", { headers });
                    const reportData = response.data.data;
                    setReports(reportData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchReport();
    }, [token]);

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
            const headers = {
                "x-access-token": token
            };
            await axios.delete(`http://localhost:8989/chocolate/${id}`, { headers });
            setShops(prevShops => prevShops.filter(shop => shop.id !== id));
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
                        <div className="NewPlaces">
                            <h2>Nouveaux ajouts :</h2>
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
                                        closing={shop.hours} // Assuming hours field is properly populated
                                        onValidate={() => handleValidatePlace(shop.id)}
                                    />
                                );
                            })}
                        </div>
                        <div className="reports">
                            <h2>Reports :</h2>
                            <div className="reports">
                                <h2>Reports :</h2>
                                {reports.filter(report => !report.isClose).map((report) => {
                                    return (
                                        <ReportCard
                                            key={report.id}
                                            id={report.id}
                                            reportBody={report.body}
                                            userId={report.user_Id}
                                            shopId={report.chocolate_Id}
                                            onClose={() => handleCloseReport(report.id)}
                                        />
                                    );
                                })}
                            </div>

                        </div>
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

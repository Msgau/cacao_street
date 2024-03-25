import axios from "axios";
import { useEffect, useState } from "react";

interface ReportCardProps {
    id: number;
    reportBody: string;
    userId: number;
    shopId: number;
    onClose: () => void;
    onDeleteReport: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ id, reportBody, userId, shopId, onClose, onDeleteReport }) => {
    const token = localStorage.getItem("token");
    const [shopName, setShopName] = useState<string>("");
    const[userName, setUserName] = useState<string>("");

    useEffect(() => {
        const getShopNameById = async () => {
            try {
                if (token) {
                    const headers = {
                        "x-access-token": token
                    };
                    const response = await axios.get(`http://localhost:8989/chocolate/${shopId}`, { headers });
                    const reportData = response.data.data;
                    setShopName(reportData.name); // Stocker le nom du magasin dans l'état local
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getShopNameById();
    }, [shopId, token]); // Ajouter shopId et token à la liste des dépendances pour déclencher useEffect lorsque l'un d'eux change

    useEffect(() => {
        const getUserById = async () => {
            try {
                if (token) {
                    const headers = {
                        "x-access-token": token
                    };
                    const response = await axios.get(`http://localhost:8989/api/admin/users/${userId}`, { headers });
                    const reportData = response.data.data;
                    setUserName(reportData.username); // Stocker le nom du magasin dans l'état local
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        getUserById();
    }, [userId, token]);

    return (
        <div className="exempleUser">
            <h3>Report {id} :</h3>
            <p>Utilisateur : {userName}</p>
            <p>Sujet : {shopName}</p>
            <p>Message : {reportBody}</p>

            <div className='buttonsUserRequest'>
                <button className='closeButton' onClick={onClose}>Fermer</button>
                <button className='deleteButton' onClick={onDeleteReport}>Supprimer</button>
            </div>
        </div>
    );
};

export default ReportCard;

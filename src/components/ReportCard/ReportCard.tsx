import axios from "axios";
import { useEffect, useState } from "react";
import './ReportCard.css';

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
    const [userName, setUserName] = useState<string>("");
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

    useEffect(() => {
        const getShopNameById = async () => {
            try {
                if (token) {
                    const headers = {
                        "x-access-token": token
                    };
                    const response = await axios.get(`http://localhost:8989/chocolate/${shopId}`, { headers });
                    const reportData = response.data.data;
                    setShopName(reportData.name);
                }
            } catch (error) {
                console.error("Error fetching shop data:", error);
            }
        };
        getShopNameById();
    }, [shopId, token]);

    useEffect(() => {
        const getUserById = async () => {
            try {
                if (token) {
                    const headers = {
                        "x-access-token": token
                    };
                    const response = await axios.get(`http://localhost:8989/api/admin/users/${userId}`, { headers });
                    const reportData = response.data.data;
                    setUserName(reportData.username);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        getUserById();
    }, [userId, token]);

    const handleDeleteReportWithConfirmation = () => {
        setShowConfirmationModal(true);
    };

    const confirmDeleteReport = async () => {
        // Close confirmation modal
        setShowConfirmationModal(false);
        try {
            // Call onDeleteReport function if user confirms deletion
            await onDeleteReport();
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    };

    return (
        <div className="reportsBlock">
            <h3>Report {id} :</h3>
            <p><b>Utilisateur :</b> {userName}</p>
            <p><b>Sujet :</b> {shopName}</p>
            <p className="reportBody"><b>Message :</b> {reportBody}</p>

            <div className='buttonsUserReport'>
                <button className='closeButton' onClick={onClose}>Fermer</button>
                <button className='deleteButton' onClick={handleDeleteReportWithConfirmation}>Supprimer</button>
            </div>

            {/* Modal de confirmation */}
            {showConfirmationModal && (
                <div className="confirmationModal">
                    <p>Êtes-vous sûr de vouloir supprimer ce rapport ?</p>
                    <div className="confirmationButtons">
                        <button onClick={() => setShowConfirmationModal(false)}>Non</button>
                        <button onClick={confirmDeleteReport}>Oui</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportCard;

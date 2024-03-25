import React from 'react';

interface ReportCard {
    id : number;
    reportBody : string;
    userId : number;
    shopId : number;
    onClose: () => void;
}

const ReportCard: React.FC<ReportCard> = ({ id, reportBody, userId, shopId, onClose }) => {
    
    return (
        <div className="exempleUser">
            <h3>Report {id} :</h3>
            <p>Utilisateur : {userId}</p>
            <p>Sujet : {shopId}</p>
            <p>Message : {reportBody}</p>
            
            <div className='buttonsUserRequest'>
                <button className='closeButton' onClick={onClose}>Fermer</button>
                <button className='deleteButton'>Supprimer</button>
                
            </div>
        </div>
    );
};

export default ReportCard;

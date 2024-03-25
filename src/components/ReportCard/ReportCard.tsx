interface ReportCardProps {
    id : number;
    reportBody : string;
    userId : number;
    shopId : number;
    onClose: () => void;
    onDeleteReport: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ id, reportBody, userId, shopId, onClose, onDeleteReport }) => {
    
    return (
        <div className="exempleUser">
            <h3>Report {id} :</h3>
            <p>Utilisateur : {userId}</p>
            <p>Sujet : {shopId}</p>
            <p>Message : {reportBody}</p>
            
            <div className='buttonsUserRequest'>
                <button className='closeButton' onClick={onClose}>Fermer</button>
                <button className='deleteButton' onClick={onDeleteReport}>Supprimer</button> {/* Correction ici */}
            </div>
        </div>
    );
};

export default ReportCard;

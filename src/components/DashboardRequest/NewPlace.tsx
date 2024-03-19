import './NewPlace.css';
interface NewPlaceProps {
    placeName: string;
    placeDetails: string;
    addressShop: string;
    price: number;
    id: number;
    onDelete: () => void;
    closing: string;
}

const NewPlace: React.FC<NewPlaceProps> = ({ placeName, placeDetails, addressShop, price, id, onDelete, closing }) => {
    const handleDeleteClick = () => {
        onDelete(); // Appeler la fonction de suppression lorsque le bouton est cliqué
    };
    return (
        <div className="exempleUser">
            <h3>Nom : {placeName}</h3>
            <p title={addressShop}><b>Adresse :</b> {addressShop}</p>
            <p title={placeDetails}><b>Coordonnées :</b> {placeDetails}</p>
            <div className='priceOpening'><p><b>Prix :</b> {price}€</p><p className={closing ? "afficher": "masquer"}><b>, fermé le : </b>{closing}</p></div>
            
            <div className='buttonsUserRequest'>
                <button className='putButton'>modifier</button>
                <button className='validationButton'>valider</button>
                <button className='deleteButton' onClick={handleDeleteClick}>X</button>
            </div>
        </div>
    );
};

export default NewPlace;

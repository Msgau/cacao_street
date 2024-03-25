import './NewPlace.css';
import React from 'react';

interface NewPlaceProps {
    placeName: string;
    placeDetails: string;
    addressShop: string;
    price: number;
    id: number;
    onDelete: () => void;
    onValidate: () => void;
    closing: JSON | null;
}

const NewPlace: React.FC<NewPlaceProps> = ({ placeName, placeDetails, addressShop, price, onDelete, closing, onValidate }) => {

    const formatAddress = (address: string) => {
        const firstCommaIndex = address.indexOf(',');
        if (firstCommaIndex !== -1) {
            const firstPart = address.substring(0, firstCommaIndex + 1);
            const secondPart = address.substring(firstCommaIndex + 1);
            return (
                <>
                    {firstPart}
                    <br /> {/* Ajoute un retour à la ligne après la première virgule */}
                    {secondPart}
                </>
            );
        }
        return address; // Si aucune virgule n'est trouvée, retourne l'adresse inchangée
    };

    return (
        <div className="exempleUser">
            <h3>Nom : {placeName}</h3>
            <p title={addressShop}><b>Adresse :</b> {formatAddress(addressShop)}</p>
            <p title={placeDetails}><b>Coordonnées :</b> {placeDetails}</p>
            <div className='priceOpening'>
                <p><b>Prix :</b> {price}€</p>
                <p className={closing ? "afficher" : "masquer"}><b>, fermé le : </b>{closing}</p>
            </div>
            
            <div className='buttonsUserRequest'>
                <button className='validationButton' onClick={onValidate}>Valider</button>
                <button className='putButton'>modifier</button>
                <button className='deleteButton' onClick={onDelete}>X</button>
            </div>
        </div>
    );
};

export default NewPlace;

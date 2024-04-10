import "./emplacement.css"
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header'
import axios from 'axios';
import PlaceAutocompleteClassic from "../../components/PlaceAutoComplete/PlaceAutoComplete";
import { APIProvider } from "@vis.gl/react-google-maps";
import config from "../../config";
import AuthChecker from "../../components/AuthChecker/AuthChecker";
import joursSemaine from "../../data/joursSemaine.json";

export default function PostEmplacement() {
    const API_KEY = config.googleMapsApiKey;

    const [name, setName] = useState('');
    const [addressShop, setAddressSop] = useState('');
    const [position, setPosition] = useState('');
    const [price, setPrice] = useState('');
    const [hours, setHours] = useState('');
    const [error, setError] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);

    useEffect(() => {
        if (selectedPosition) {
            setName(selectedPosition.name);
            setAddressSop(selectedPosition.formatted_address);
            setPosition(selectedPosition.geometry.location);
        }
    }, [selectedPosition]);

    useEffect(() => {
        if (name && addressShop && position && price) {
            setAllFieldsFilled(true);
        } else {
            setAllFieldsFilled(false);
        }
    }, [name, addressShop, position, price]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPosition || !price) {
            setError("Veuillez sélectionner une adresse et/ou saisir un prix.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const positionString = `(${selectedPosition.geometry.location.lat()}, ${selectedPosition.geometry.location.lng()})`;
            const postData = { name: name, addressShop: addressShop, position: positionString, price: price, hours: JSON.stringify(hours) };
            console.log(postData)
            const postConfig = {
                headers: {
                    // "Authorization": `bearer ${token}`,
                    "x-access-token": token,
                    'Content-Type': 'application/json;charset=UTF-8',
                }
            };
            const response = await axios.post(
                "http://localhost:8989/chocolate",
                postData,
                postConfig,
            );
            console.log("response:", response);
        } catch (err) {
            console.log(err, error);
            setError('erreur');
        }
    };
    const handleDayChange = (dayAbbr, isChecked) => {
        if (isChecked) {
            setHours([...hours, dayAbbr]);
        } else {
            setHours(hours.filter(item => item !== dayAbbr));
        }
    };

    return (
        <div>
            <AuthChecker>
                <Header />
                <form onSubmit={handleSubmit} className="postEmplacement">
                    <label htmlFor="autocomplete">Ecrivez le nom d'un café/bar* :</label>
                    <APIProvider apiKey={API_KEY} version="weekly">
                        <PlaceAutocompleteClassic onPlaceSelect={(place) => setSelectedPosition(place)} className="test" />
                    </APIProvider>

                    <label htmlFor="name">Nom du café/bar :</label>
                    <input
                        type="text"
                        disabled
                        required
                        value={name}
                    />
                    <label htmlFor="address">Adresse de l'établissement :</label>
                    <input
                        type="text"
                        disabled
                        required
                        value={addressShop}
                    />
                    <label htmlFor="position">Coordonnées GPS :</label>
                    <input
                        type="text"
                        disabled
                        required
                        value={position}
                    />

                    <label htmlFor="price">Prix du chocolat chaud* :</label>
                    <input
                        type="text"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Prix du chocolat chaud"
                    />
                    <label htmlFor="closing">Jours de fermeture (facultatif) :</label>
                    <ul className="closing-days">
                        {joursSemaine.map(day => (
                            <li key={day.id}>
                                <input
                                    type="checkbox"
                                    id={day.id}
                                    value={day.abbr}
                                    checked={hours.includes(day.abbr)}
                                    onChange={(e) => handleDayChange(day.abbr, e.target.checked)}
                                />
                                <label htmlFor={day.id}>{day.label}</label>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="submit"
                        title={selectedPosition ? "Envoyer mon chocolat" : "Remplissez le formulaire avant de l'envoyer ! :)"}
                        disabled={!allFieldsFilled || !selectedPosition}
                        className={allFieldsFilled && selectedPosition ? "formOk" : "formNotOk"}>
                        Ajouter un chocolat chaud ☕
                    </button>

                </form>
            </AuthChecker>
        </div>
    )
} 

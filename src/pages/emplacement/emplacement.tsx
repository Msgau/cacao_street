import "./emplacement.css"
import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header'
import axios from 'axios';
import PlaceAutocompleteClassic from "../../components/PlaceAutoComplete/PlaceAutoComplete";
import { APIProvider } from "@vis.gl/react-google-maps";
import config from "../../config";

export default function PostEmplacement() {
    const API_KEY = config.googleMapsApiKey;

    const [name, setName] = useState('');
    const [addressShop, setAddressSop] = useState('');
    const [rate, setRate] = useState('');
    const [position, setPosition] = useState('');
    const [price, setPrice] = useState('');
    const [hours, setHours] = useState('');
    const [error, setError] = useState('');
    const [selectedPosition, setSelectedPosition] = useState(null);

    useEffect(() => { 
        console.log("selectedPosition changed:", selectedPosition);
    }, [selectedPosition]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const postData = { name: name, addressShop: addressShop, rate: rate, position: position, price: price, hours: hours }
            const postConfig = {
                headers: {
                    "Authorization": `bearer ${token}`,
                    'Content-Type': 'application/json;charset=UTF-8',
                }
            }
            const response = await axios.post(
                "http://localhost:8989/chocolate",
                postData,
                postConfig,
            )
            console.log("response:", response)
        } catch (err) {
            console.log(err, error)
            setError('erreur')
        }
    }
    return (
        <div>
            <Header />

            <form onSubmit={handleSubmit} className="postEmplacement">
                <APIProvider apiKey={API_KEY} version="weekly">
                    <PlaceAutocompleteClassic onPlaceSelect={setSelectedPosition} />
                </APIProvider>
                <p>{selectedPosition ? JSON.stringify(selectedPosition) : ''}</p>
                <input
                    type="text"
                    value={selectedPosition ? selectedPosition.name : name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nom du café/bar" />

                <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Prix du chocolat chaud" />

                <input
                    type="text"
                    value={selectedPosition ? selectedPosition.formatted_address : addressShop}
                    onChange={(e) => setAddressSop(e.target.value)}
                    placeholder="Adresse" />


                <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="Jours de fermeture" />

                <input
                    type="text"
                    value={selectedPosition ? `${selectedPosition.geometry.location}` : position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="position" />

                <input
                    type="text"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="rate" />

                <button type="submit">Ajouter un chocolat chaud ☕ </button>
            </form>
        </div>
    )
} 

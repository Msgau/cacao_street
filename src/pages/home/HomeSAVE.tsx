import { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import config from "../../config";
import PlaceAutocompleteClassic from "../../components/PlaceAutoComplete/PlaceAutoComplete.jsx"
import MapHandler from "../../components/map-handler/map-handler.js";
import Header from "../../components/Header/Header.js";
import HiddenContent from "../../components/HiddentContent/HiddenContent.jsx";
import "./Home.css";
import formatted from "../../data/cafés";

const API_KEY = config.googleMapsApiKey;
const MAP_ID = config.mapId;

const Home = () => {

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fonction pour obtenir la position de l'utilisateur
    const getUserLocation = async () => {

      // Utilisation de l'API du navigateur pour obtenir la position de l'utilisateur
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Erreur de géolocalisation:', error);
            // Si l'utilisateur refuse la géolocalisation du navigateur, utiliser l'API Geolocation de Google Maps via une requête HTTP
            if (error.code === error.PERMISSION_DENIED) {
              getUserLocationWithGoogleMaps();
            }
          }
        );
      } else {
        console.error("La géolocalisation n'est pas prise en charge par ce navigateur.");
      }
    };

    // Fonction pour obtenir la position de l'utilisateur avec l'API Geolocation de Google Maps via une requête HTTP
    const getUserLocationWithGoogleMaps = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ considerIp: true }),
        });
        const data = await response.json();
        setUserLocation({
          lat: data.location.lat,
          lng: data.location.lng,
        });
      } catch (error) {
        console.error('Erreur de géolocalisation avec Google Maps:', error);
      }
    };

    // Appel de la fonction pour obtenir la position de l'utilisateur
    getUserLocation();
  }, []); // Exécuter une seule fois lors du montage du composant

  const position = userLocation || { lat: 48.705047607421875, lng: 2.4535863399505615 };
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  
// Fonction pour déterminer si le lieu est ouvert aujourd'hui
const isOpenToday = () => {
  if (!selectedPlace || !selectedPlace.closing) return false;
  const currentDayOfWeek = new Date().toLocaleDateString('fr-FR', { weekday: 'short' }).toLowerCase().substring(0, 3);
  // Si le lieu est ouvert tous les jours, il est ouvert sauf s'il est fermé aujourd'hui
  if (selectedPlace.closing.includes("opn")) {
    return !selectedPlace.closing.includes(currentDayOfWeek);
  } 
  // Sinon, cela signifie qu'il est fermé certains jours, donc il est fermé si le jour actuel est spécifiquement un jour de fermeture
  return !selectedPlace.closing.includes(currentDayOfWeek);
};


  // Utilisation du résultat pour afficher le statut d'ouverture dans l'InfoWindow
  const openStatus = isOpenToday() ? "ouvert aujourd'hui" : "fermé aujourd'hui";

  return (
    <div>
      <Header />
      <APIProvider apiKey={API_KEY} version="weekly">
        <div style={{ height: "78vh", width: "90%" }} className="map-container">
          <PlaceAutocompleteClassic onPlaceSelect={setSelectedPosition} />
          <MapHandler place={selectedPosition} />
          <Map
            zoom={15}
            center={position}
            mapId={MAP_ID}
            // gestureHandling={"greedy"}
            // disableDefaultUI={true}
          >
            <AdvancedMarker
              position={position}
            >
              <Pin
                background={"grey"}
                borderColor={"green"}
                glyphColor={"purple"}
              />
            </AdvancedMarker>

            {selectedPlace && (
              <InfoWindow
                position={selectedPlace.position}
                pixelOffset={new window.google.maps.Size(0, -30)}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <div>Note : {selectedPlace.rating}/5</div>
                  <h3>{selectedPlace.name}</h3>
                  {selectedPlace.price && (
                    <p>Prix: {selectedPlace.price} €</p>
                  )}
                  <p>{selectedPlace.adress}</p>
                  {/* Afficher le statut d'ouverture */}
                  <p>{openStatus}</p>
                  {/* Utilisation du composant HiddenContent pour afficher/masquer les jours d'ouverture */}
                  <HiddenContent
                    collapseTitle="Jours d'ouverture"
                    collapseDescription={
                      <p>
                        {[
                          "Lundi",
                          "Mardi",
                          "Mercredi",
                          "Jeudi",
                          "Vendredi",
                          "Samedi",
                          "Dimanche",
                        ].map((day) => {
                          const dayAbbreviation = day.substring(0, 3).toLowerCase();
                          const isOpenDay =
                            selectedPlace.closing &&
                            !selectedPlace.closing.includes(dayAbbreviation);
                          return (
                            <span
                              key={dayAbbreviation}
                              className={isOpenDay ? "openDay" : "closedDay"}
                            >
                              {isOpenDay ? day : <s>{day}</s>}
                            </span>
                          );
                        })}
                      </p>
                    }
                  />
                </div>
              </InfoWindow>
            )}

            <Markers points={formatted} setSelectedPlace={setSelectedPlace} />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

const Markers = ({ points, setSelectedPlace }) => {
  return (
    <>
      {points.map(
        ({ name, price, adress, rating, closing, lat, lng, key }) => (
          <AdvancedMarker
            position={{ lat, lng }}
            key={key}
            onClick={() =>
              setSelectedPlace({
                name,
                price,
                adress,
                rating,
                closing,
                position: { lat, lng },
              })
            }
          >
            <span style={{ fontSize: "2rem" }}>☕</span>
          </AdvancedMarker>
        )
      )}
    </>
  );
};

export default Home;

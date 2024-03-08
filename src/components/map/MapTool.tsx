import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import config from "../../config";
import PlaceAutocompleteClassic from "../../components/PlaceAutoComplete/PlaceAutoComplete.jsx";
import MapHandler from "../../components/map-handler/map-handler.js";
import HiddenContent from "../../components/HiddentContent/HiddenContent.jsx";
import formatted from "../../data/cafés";

const API_KEY = config.googleMapsApiKey;
const MAP_ID = config.mapId;

const MapTool = ( {classNameMap} ) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

const closeModal = (e) => {
  e.stopPropagation(); // Arrête la propagation de l'événement de clic
  console.log(isModalOpen);
  setIsModalOpen(false);
  console.log(isModalOpen);
};


  // Fonction pour déterminer si le lieu est ouvert aujourd'hui
  const isOpenToday = () => {
    if (!selectedPlace || !selectedPlace.closing) return false;
    const currentDayOfWeek = new Date().toLocaleDateString("fr-FR", {
      weekday: "short",
    }).toLowerCase().substring(0, 3);
    if (selectedPlace.closing.includes("opn")) {
      return !selectedPlace.closing.includes(currentDayOfWeek);
    }
    return !selectedPlace.closing.includes(currentDayOfWeek);
  };

  // Utilisation du résultat pour afficher le statut d'ouverture dans la modal
  const openStatus = isOpenToday() ? "ouvert aujourd'hui" : "fermé aujourd'hui";

  return (
    <div>
      <APIProvider apiKey={API_KEY} version="weekly">
      <div className={classNameMap}>
          <PlaceAutocompleteClassic onPlaceSelect={setSelectedPosition} />
          <MapHandler place={selectedPosition} />
          <Map
            defaultZoom={15}
            defaultCenter={userLocation || { lat: 48.705047607421875, lng: 2.4535863399505615 }}
            mapId={MAP_ID}
          >
            <AdvancedMarker
              position={userLocation || { lat: 48.705047607421875, lng: 2.4535863399505615 }}
            >
              <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"} />
            </AdvancedMarker>

            {selectedPlace && (
              <>
                {isModalOpen && (
                  <div className="overlay" onClick={closeModal}></div>
                )}
                <div className={`modal ${isModalOpen ? 'open' : ''}`}>
                  <div>
                    <div className="bouton">
                      <button onClick={closeModal}>X</button>
                    </div>
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
                </div>
              </>
            )}

            <Markers points={formatted} setSelectedPlace={setSelectedPlace} openModal={openModal} />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

const Markers = ({ points, setSelectedPlace, openModal }) => {
  return (
    <>
      {points.map(
        ({ name, price, adress, rating, closing, lat, lng, key }) => (
          <AdvancedMarker
            position={{ lat, lng }}
            key={key}
            onClick={() => {
              setSelectedPlace({
                name,
                price,
                adress,
                rating,
                closing,
                position: { lat, lng },
              });
              openModal();
            }}
          >
            <span style={{ fontSize: "2rem" }}>☕</span>
          </AdvancedMarker>
        )
      )}
    </>
  );
};

export default MapTool;

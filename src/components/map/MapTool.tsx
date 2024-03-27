import { useState, useEffect } from "react";
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
import axios from "axios";
import './MapTool.css';
import Report from "../Report/Report.js";

const API_KEY = config.googleMapsApiKey;
const MAP_ID = config.mapId;
const URL_GET_ALL_CHOCOLATE = config.url_get_all_chocolate;
const URL_POST_REPORTING = config.url_post_reporting;

const MapTool = ({ classNameMap }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [reportWindow, setReportWindow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL_GET_ALL_CHOCOLATE);
        const shopsInfo = response.data.data;
        setShops(shopsInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  const reportShop = async (reportText, userToken, shopId) => {
      try {
          const token = localStorage.getItem('token');
          const headers = {
              'x-access-token': token,
              'Content-Type': 'application/json' // Indique le type de contenu JSON
          };
  
          const requestBody = {
              body: reportText,
              chocolate_Id: shopId.id
          };
          // Envoi de la requête POST avec Axios
          const response = await axios.post(URL_POST_REPORTING, requestBody, { headers });
  
          console.log('Report submitted:', response.data);
  
      } catch (error) {
          console.error('Error submitting report:', error);
      }
  };
  


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
    setReportWindow(false);
  };

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

  const openStatus = isOpenToday() ? "ouvert aujourd'hui" : "fermé aujourd'hui";

  return (
    <div>
      <APIProvider apiKey={API_KEY} version="weekly">
        <div className={classNameMap}>
          <PlaceAutocompleteClassic onPlaceSelect={setSelectedPosition} />
          <MapHandler place={selectedPosition} />
          <Map
            defaultZoom={15}
            defaultCenter={
              userLocation || { lat: 48.705047607421875, lng: 2.4535863399505615 }
            }
            mapId={MAP_ID}
          >
            <AdvancedMarker
              position={
                userLocation || { lat: 48.705047607421875, lng: 2.4535863399505615 }
              }
            >
              <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"} />
            </AdvancedMarker>

            {selectedPlace && (
              <>
                {isModalOpen && <div className="overlay" onClick={closeModal}></div>}
                <div className={`modal ${isModalOpen ? 'open' : ''}`}>
                  <div>
                    <div className="bouton">
                      <button onClick={closeModal}>X</button>
                    </div>
                    <div>Note : {selectedPlace.rating}/5</div>
                    <h3>{selectedPlace.name}</h3>
                    {selectedPlace.price && <p>Prix: {selectedPlace.price} €</p>}
                    <p>
                      {selectedPlace.address && selectedPlace.address.split(',').map((part, index) => (
                        <span key={index}>
                          {index > 0 && <br />}
                          {part}
                        </span>
                      ))}
                    </p>

                    {selectedPlace && selectedPlace.closing !== '""' ? (
                      <>
                        <p>{openStatus}</p>
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
                      </>
                    ) :
                      <p>Jours d'ouverture non communiqués</p>
                    }
                    {reportWindow && (
                      <Report setReportWindow= {setReportWindow} onSend={(reportText, userToken) => reportShop(reportText, userToken, selectedPlace)} />
                    )}

                    <button title="signaler une problème" className={`${isModalOpen ? 'displayReportButton' : 'none'}`} onClick={() => setReportWindow(true)}>!</button>
                  </div>
                </div>
              </>
            )}

            <Markers shops={shops} setSelectedPlace={setSelectedPlace} openModal={openModal} />
          </Map>
        </div>
      </APIProvider>
    </div>
  );
};

const Markers = ({ shops, setSelectedPlace, openModal }) => {
  return (
    <>
      {shops.map(
        ({ name, price, addressShop, rating, hours, position, id, allowed }) => (
          allowed && (
            <AdvancedMarker
              position={{
                lat: parseFloat(position.split(',')[0].slice(1)),
                lng: parseFloat(position.split(',')[1].slice(0, -1)),
              }}
              key={id}
              onClick={() => {
                setSelectedPlace({
                  id,
                  name,
                  price,
                  address: addressShop,
                  rating,
                  closing: hours,
                  position: {
                    lat: parseFloat(position.split(',')[0].slice(1)),
                    lng: parseFloat(position.split(',')[1].slice(0, -1)),
                  },
                });
                openModal();
              }}
            >
              <span style={{ fontSize: "2rem" }}>☕</span>
            </AdvancedMarker>
          )
        )
      )}
    </>
  );
};

export default MapTool;

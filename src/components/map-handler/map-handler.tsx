import { useMap } from '@vis.gl/react-google-maps';
import React, { useEffect } from 'react';
// https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=fr#PlaceOpeningHoursPeriod
interface Props {
  place: google.maps.places.PlaceResult | null;
  opening: google.maps.places.PlaceOpeningHoursTime | null;
}

const MapHandler = ({place, opening}: Props) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place) return;
    if (opening?.day) {
      console.log(opening.day)
    }
    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
  }, [map, place, opening]); 

  return null;
};

export default React.memo(MapHandler);

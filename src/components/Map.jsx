import Leaflet from "leaflet";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";
import CountryFlag from "./CountryFlag";
import styles from "./Map.module.css";

const getMarkerIcon = (color = "blue") =>
  Leaflet.icon({
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    iconUrl: `/markers/marker-icon-${color}.png`,
    shadowUrl: "/markers/marker-shadow.png",
  });

function ChangeCenter({ postion }) {
  const map = useMap();
  map.setView(postion);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const normalizedLng = ((((lng + 180) % 360) + 360) % 360) - 180;
      navigate(`form?lat=${lat}&lng=${normalizedLng}`);
    },
  });
}

function Map() {
  const navigate = useNavigate();
  const { cities, currentCity } = useCitiesContext();
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition: getGeoLocationPosition,
  } = useGeoLocation();
  const [lat, lng] = useUrlPosition();
  const [mapPosition, setMapPosition] = useState([22, 80]);

  useEffect(() => {
    if (geoLocationPosition)
      navigate(
        `form?lat=${geoLocationPosition.lat}&lng=${geoLocationPosition.lng}`,
      );
  }, [geoLocationPosition, navigate]);

  useEffect(() => {
    if (lat && lng) setMapPosition([lat, lng]);
  }, [lat, lng]);

  const onGeoLocation =
    geoLocationPosition &&
    lat == geoLocationPosition.lat &&
    lng == geoLocationPosition.lng;

  return (
    <div className={styles.mapContainer}>
      {!onGeoLocation && (
        <Button type="position" onClick={getGeoLocationPosition}>
          {isLoadingPosition ? "Loading..." : "Use your position"}
        </Button>
      )}
      <MapContainer center={mapPosition} zoom={5} className={styles.map}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <Marker position={mapPosition} icon={getMarkerIcon("grey")} />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
            icon={getMarkerIcon(city.id == currentCity.id ? "green" : "blue")}
          >
            <Popup>
              <span>
                <CountryFlag emoji={city.emoji} />
              </span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter postion={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

export default Map;

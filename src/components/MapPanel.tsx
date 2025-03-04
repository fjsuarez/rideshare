import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Required for leaflet icons to work properly.
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapCard: React.FC = () => {
    const position: [number, number] = [51.505, -0.09]; // Example coordinates

    return (
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
              <Popup>
                  A marker here.
              </Popup>
          </Marker>
      </MapContainer>
    );
};

export default MapCard;
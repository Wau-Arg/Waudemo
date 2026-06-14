import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CardPrestador from './CardPrestador';

// Fix para los íconos de Leaflet con Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const iconoPrestador = new L.DivIcon({
  html: `<div style="background:#f18c11;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🐾</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

const CENTRO_DEFAULT = [-34.6037, -58.3816]; // Buenos Aires

export default function MapaPrestadores({ prestadores }) {
  const conCoords = prestadores.filter((p) => p.lat && p.lng);

  return (
    <MapContainer
      center={CENTRO_DEFAULT}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {conCoords.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={iconoPrestador}>
          <Popup minWidth={240} maxWidth={280}>
            <CardPrestador prestador={p} compact />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

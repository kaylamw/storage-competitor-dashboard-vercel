
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function App() {
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
  const [center, setCenter] = useState([33.4484, -112.0740]); // Default: Phoenix, AZ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!location) return;
    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(`/api/search?location=${encodeURIComponent(location)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data);
        if (data[0]?.geometry?.location) {
          setCenter([data[0].geometry.location.lat, data[0].geometry.location.lng]);
        }
      }
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '1rem' }}>
        📍 Storage Finder
      </h1>
      <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
        Search for storage near any ZIP, city, or address.
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={fetchData}
          style={{
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <MapContainer center={center} zoom={13} style={{ height: '400px', marginBottom: '2rem' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {results.map((place, idx) => (
            <Marker
              key={idx}
              position={[
                place.geometry.location.lat,
                place.geometry.location.lng
              ]}
            >
              <Popup>
                <strong>{place.name}</strong><br />
                {place.formatted_address}<br />
                ⭐ {place.rating} ({place.user_ratings_total} reviews)
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {results.map((place, index) => (
        <div key={index} style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          borderLeft: index === 0 ? '5px solid #0070f3' : 'none'
        }}>
          <h2 style={{ margin: 0 }}>
            #{index + 1} - {place.name}
            {index === 0 && <span style={{ color: '#0070f3', marginLeft: '10px' }}>⭐ Top Google Result</span>}
          </h2>
          <p><strong>Address:</strong> {place.formatted_address}</p>
          <p><strong>Rating:</strong> {place.rating} ({place.user_ratings_total} reviews)</p>
          <p><strong>Distance:</strong> {place.distance_miles?.toFixed(2)} mi</p>
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0070f3', textDecoration: 'none' }}
          >
            View on Google Maps
          </a>
        </div>
      ))}
    </div>
  );
}

export default App;

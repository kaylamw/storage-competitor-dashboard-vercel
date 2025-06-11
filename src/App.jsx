import { useState } from 'react';

export default function App() {
  const [location, setLocation] = useState('');
  const [results, setResults] = useState([]);
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
      }
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Search Storage Units</h1>

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter address, city, state or ZIP"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />

      <button onClick={fetchData} style={{ padding: '0.5rem 1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length === 0 && !loading && location !== '' && !error && (
        <p>No storage units found for: {location}</p>
      )}

      {results.map((place, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '10px',
            marginTop: '1rem',
          }}
        >
          <h2>{place.name}</h2>

          {place.rating && (
            <p>
              <strong>Rating:</strong> {place.rating} (
              {place.user_ratings_total || 0} reviews)
            </p>
          )}

          <p>
            <strong>Address:</strong> {place.formatted_address}
          </p>

          {place.opening_hours && (
            <p>
              <strong>Open Now:</strong>{' '}
              {place.opening_hours.open_now ? 'Yes' : 'No'}
            </p>
          )}

          <a
            href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Google Maps
          </a>
        </div>
      ))}
    </div>
  );
}

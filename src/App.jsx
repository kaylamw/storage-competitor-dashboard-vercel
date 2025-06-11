import { useState } from 'react';

export default function App() {
  const [zip, setZip] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompetitors = async () => {
    if (!zip) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?zip=${zip}`);
      const data = await res.json();
      setCompetitors(data);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Enter ZIP code..."
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
      />
      <button onClick={fetchCompetitors} style={{ marginBottom: '1rem' }}>
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {competitors.length === 0 && !loading && !error && zip !== '' && (
        <p>No results found for ZIP {zip}</p>
      )}

      {competitors.map((comp, i) => (
        <div
          key={i}
          style={{
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h2>{comp.name}</h2>
          <p>
            <strong>Rating:</strong> {comp.rating}{' '}
            ({comp.user_ratings_total} reviews)
          </p>
          <p>
            <strong>Address:</strong> {comp.formatted_address}
          </p>
          {comp.opening_hours && (
            <p>
              <strong>Open Now:</strong>{' '}
              {comp.open

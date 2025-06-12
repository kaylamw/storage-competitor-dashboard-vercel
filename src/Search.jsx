import { useState } from 'react';

export default function Search({ onResults }) {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?location=${encodeURIComponent(location)}`);
      const data = await res.json();
      onResults(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Enter address, city, state or zip"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: '8px', width: '250px' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 12px', marginLeft: '8px' }}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}

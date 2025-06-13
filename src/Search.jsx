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
      console.error('Error fetching data:', err);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter location (city, zip, etc)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ padding: '8px', width: '250px' }}
      />
      <button
        onClick={handleSearch}
        style={{ marginLeft: '8px', padding: '8px 12px' }}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}

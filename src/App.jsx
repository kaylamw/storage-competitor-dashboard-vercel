
import { useState } from 'react';
import Search from './Search';

function App() {
  const [results, setResults] = useState([]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Storage Competitor Finder</h1>
      <Search onResults={setResults} />
      {results.length === 0 && <p>No results yet. Enter a location above.</p>}
      <ul>
        {results.map((place) => (
          <li key={place.place_id} style={{ marginBottom: '1rem' }}>
            <strong>{place.name}</strong><br />
            {place.formatted_address}<br />
            ⭐ {place.rating} ({place.user_ratings_total} reviews)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

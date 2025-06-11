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
        value={

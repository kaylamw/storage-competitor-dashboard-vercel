export default async function handler(req, res) {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Missing location parameter' });
  }

  const query = encodeURIComponent(`self storage near ${location}`);

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (!data || !data.results) {
      return res.status(500).json({ error: 'No results found' });
    }

    res.status(200).json(data.results);
  } catch (error) {
    console.error('Google API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


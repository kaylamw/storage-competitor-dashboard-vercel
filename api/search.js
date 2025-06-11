export default async function handler(req, res) {
  const { zip } = req.query;

  if (!zip) {
    return res.status(400).json({ error: 'Missing ZIP code' });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=self+storage+${zip}&key=${process.env.GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (!data || !data.results) {
      return res.status(500).json({ error: 'Invalid response from Google' });
    }

    res.status(200).json(data.results);
  } catch (error) {
    console.error('Google API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

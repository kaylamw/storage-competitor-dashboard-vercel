const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async function handler(req, res) {
  const { zip } = req.query;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=self+storage+${zip}&key=${process.env.GOOGLE_API_KEY}`
    );

    const data = await response.json();

    if (!data.results) {
      return res.status(500).json({ error: 'Invalid API response' });
    }

    res.status(200).json(data.results);
  } catch (error) {
    console.error('API fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

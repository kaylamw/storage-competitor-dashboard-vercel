
export default async function handler(req, res) {
  const { location } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!location || !apiKey) {
    return res.status(400).json({ error: 'Missing location or API key' });
  }

  try {
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
    );
    const geoData = await geoRes.json();
    const { lat, lng } = geoData.results[0].geometry.location;

    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=storage&key=${apiKey}`
    );
    const placesData = await placesRes.json();

    res.status(200).json(
      placesData.results.map((place) => ({
        name: place.name,
        formatted_address: place.vicinity,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        place_id: place.place_id
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}

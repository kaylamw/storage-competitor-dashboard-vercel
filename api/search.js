// pages/api/search.js (or /api/search.js in Vercel functions folder)
import fetch from 'node-fetch';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export default async function handler(req, res) {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ error: 'Missing location parameter' });
  }

  try {
    // Step 1: Geocode the user-provided location to lat/lng
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_MAPS_API_KEY}`
    );
    const geoData = await geoRes.json();
    const geo = geoData.results[0]?.geometry?.location;

    if (!geo) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const { lat, lng } = geo;

    // Step 2: Search for nearby storage places using Places API
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=storage&keyword=self+storage&key=${GOOGLE_MAPS_API_KEY}`
    );
    const placesData = await placesRes.json();

    if (!placesData.results || !placesData.results.length) {
      return res.status(404).json({ error: 'No results found' });
    }

    // Step 3: Build the response
    const results = placesData.results.map((place) => {
      const destLat = place.geometry.location.lat;
      const destLng = place.geometry.location.lng;

      // Calculate distance in miles (Haversine formula)
      const R = 3958.8; // Earth radius in miles
      const dLat = ((destLat - lat) * Math.PI) / 180;
      const dLng = ((destLng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((destLat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance_miles = R * c;

      return {
        name: place.name,
        formatted_address: place.vicinity,
        rating: place.rating || 0,
        user_ratings_total: place.user_ratings_total || 0,
        geometry: place.geometry,
        place_id: place.place_id,
        distance_miles: distance_miles,
      };
    });

    // Sort by distance then rating
    results.sort((a, b) => a.distance_miles - b.distance_miles || b.rating - a.rating);

    return res.status(200).json(results);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

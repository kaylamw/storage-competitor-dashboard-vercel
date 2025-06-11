export default async function handler(req, res) {
  const { zip } = req.query;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=self+storage+${zip}&key=${process.env.GOOGLE_API_KEY}`
  );

  const data = await response.json();
  res.status(200).json(data.results);
}

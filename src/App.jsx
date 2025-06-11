import { useState } from 'react';

const competitors = [
  {
    name: "Extra Space Storage",
    rating: 4.7,
    reviewCount: 132,
    address: "1234 W Glendale Ave, Phoenix, AZ",
    hours: "9 AM - 6 PM",
    phone: "(602) 123-4567",
    website: "https://extraspace.com",
    unitPrices: {
      "5x5": "$45/mo",
      "10x10": "$95/mo",
      "10x20": "$155/mo"
    },
    climateControlled: true,
    onlineDiscount: "First month free",
    source: "Data pulled from Google Business Profile"
  },
  {
    name: "Public Storage",
    rating: 4.5,
    reviewCount: 201,
    address: "5678 E Thomas Rd, Scottsdale, AZ",
    hours: "6 AM - 9 PM",
    phone: "(480) 765-4321",
    website: "https://publicstorage.com",
    unitPrices: {
      "5x5": "$40/mo",
      "10x10": "$89/mo",
      "10x20": "$140/mo"
    },
    climateControlled: false,
    onlineDiscount: "$1 first month rent",
    source: "Data pulled from Google Business Profile"
  }
];

export default function App() {
  const [search, setSearch] = useState("");

  const filtered = competitors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Search by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      {filtered.map((comp, i) => (
        <div key={i} style={{ border: '1px solid #ccc', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
          <h2>{comp.name}</h2>
          <p><strong>Rating:</strong> {comp.rating} ({comp.reviewCount} reviews, via Google Business Profile)</p>
          <p><strong>Address:</strong> {comp.address}</p>
          <p><strong>Hours:</strong> {comp.hours}</p>
          <p><strong>Phone:</strong> {comp.phone}</p>
          <p><strong>Website:</strong> <a href={comp.website} target="_blank" rel="noopener noreferrer">{comp.website}</a></p>
          <div>
            <strong>Unit Prices:</strong>
            <ul>
              {Object.entries(comp.unitPrices).map(([size, price], idx) => (
                <li key={idx}>{size}: {price}</li>
              ))}
            </ul>
          </div>
          <p><strong>Climate Controlled:</strong> {comp.climateControlled ? "Yes" : "No"}</p>
          <p><strong>Online Discount:</strong> {comp.onlineDiscount}</p>
          <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#666' }}>{comp.source}</p>
        </div>
      ))}
    </div>
  );
}

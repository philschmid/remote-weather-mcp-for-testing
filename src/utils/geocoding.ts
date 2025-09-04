export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function resolveLocationToCoordinates(
  location: string
): Promise<Coordinates> {
  const coordinateMatch = location.match(
    /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
  );

  let latitude: number | null = null;
  let longitude: number | null = null;

  if (coordinateMatch) {
    latitude = parseFloat(coordinateMatch[1]);
    longitude = parseFloat(coordinateMatch[2]);
  } else {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      location
    )}&count=1`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) {
      throw new Error(`Geocoding failed with status ${geoRes.status}`);
    }
    const geoJson: any = await geoRes.json();
    if (!geoJson.results || geoJson.results.length === 0) {
      throw new Error("Location not found");
    }
    latitude = geoJson.results[0].latitude as number;
    longitude = geoJson.results[0].longitude as number;
  }

  if (latitude == null || longitude == null) {
    throw new Error("Invalid coordinates");
  }

  return {
    latitude,
    longitude,
  };
}

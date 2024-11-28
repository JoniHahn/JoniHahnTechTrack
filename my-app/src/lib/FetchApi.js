const clientId = "9e45ac2557ba400e8c497c99b5d26504"; // Vervang door je eigen Client ID
const clientSecret = "1908ab4103c8468ea7c94334a4ae26d9"; // Vervang door je eigen Client Secret

async function getAccessToken() {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Kon geen toegangstoken ophalen.");
  }
  return data.access_token;
}

async function fetchAlbums(artistIds) {
  try {
    const token = await getAccessToken();
    let allAlbums = [];

    for (const [artistName, artistId] of Object.entries(artistIds)) {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Kon albums niet ophalen voor ${artistName}`);
      }

      allAlbums = [
        ...allAlbums,
        ...data.items.map((album) => ({
          name: album.name,
          artist: artistName,
          totalTracks: album.total_tracks, 
        })),
      ];
    }

    return allAlbums;
  } catch (error) {
    console.error("Fout bij het ophalen van albums:", error);
    throw error;
  }
}

export { fetchAlbums };

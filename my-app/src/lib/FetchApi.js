const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

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

async function searchArtists(query, limit = 10) {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok || !data.artists) {
      throw new Error(data.error?.message || "Kon artiesten niet ophalen.");
    }

    return data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      followers: artist.followers.total,
      popularity: artist.popularity,
      image: artist.images[0]?.url || "",
    }));
  } catch (error) {
    console.error("Fout bij het zoeken naar artiesten:", error);
    throw error;
  }
}

// No longer need fetchAlbums since we're only showing artist data now.

export { searchArtists };


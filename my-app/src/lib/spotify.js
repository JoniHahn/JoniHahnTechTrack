export const getAccessToken = async () => {
  const clientId = 'ab9e777a63784d36b86e403969d0ef85';  // Vervang door je eigen Spotify Client ID
  const clientSecret = '4ca068ef035d4109987c5aae1f434214';  // Vervang door je eigen Spotify Client Secret

  const credentials = btoa(`${clientId}:${clientSecret}`);  // Base64 encoding van de Client ID en Secret

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ 'grant_type': 'client_credentials' }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Could not get access token');
    }

    return data.access_token;  // Return het access token als het succesvol is
  } catch (error) {
    console.error('Fout bij het verkrijgen van een access token:', error);
    throw error;
  }
};

export const getArtistAlbums = async (artistId) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Fout bij het ophalen van de albums');
    }

    let albums = data.items || [];
    const desiredAlbums = [
      "Taylor Swift (Deluxe Edition)", "Fearless (Taylor's Version)", "Speak Now (Taylor's Version)",
      "Red (Taylor's Version)", "1989 (Taylor's Version)", 'reputation', 'Lover', 'folklore',
      'evermore', 'Midnights', 'THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY'
    ];

    albums = albums.filter(album =>
      desiredAlbums.some(desired => album.name.toLowerCase() === desired.toLowerCase())
    );

    albums.sort((a, b) => {
      const aIndex = desiredAlbums.findIndex(desired => desired.toLowerCase() === a.name.toLowerCase());
      const bIndex = desiredAlbums.findIndex(desired => desired.toLowerCase() === b.name.toLowerCase());
      return aIndex - bIndex;
    });

    const albumsWithTracks = await Promise.all(albums.map(async (album) => {
      const albumTracksResponse = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks?limit=32`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const albumTracksData = await albumTracksResponse.json();
      album.tracks = albumTracksData.items;

      const trackIds = album.tracks.map(track => track.id).join(',');
      if (trackIds.length > 0) {
        const audioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const audioFeaturesData = await audioFeaturesResponse.json();

        album.tracks = album.tracks.map(track => {
          const features = audioFeaturesData.audio_features.find(f => f && f.id === track.id);
          if (features) {
            track.danceability = features.danceability;
            track.energy = features.energy;
          }
          return track;
        });
      }

      return album;
    }));

    return albumsWithTracks;
  } catch (error) {
    console.error('Fout bij het ophalen van de artiestalbums:', error);
    throw error;
  }
};

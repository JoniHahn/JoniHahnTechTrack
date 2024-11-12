export const getAccessToken = async () => {
    const clientId = 'ab9e777a63784d36b86e403969d0ef85';  // Vervang door je eigen Spotify Client ID
    const clientSecret = '4ca068ef035d4109987c5aae1f434214';  // Vervang door je eigen Spotify Client Secret
  
    const credentials = btoa(`${clientId}:${clientSecret}`);  // Base64 encoding van de Client ID en Client Secret
  
    // Vraag een access token aan via de Client Credentials Flow
    const response = await fetch('https://accounts.spotify.com/api/token?', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,  // Voeg de Base64-encoded Client ID en Secret toe
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',  // Dit is de flow voor systeemtoegang
      }),
    });
  
    const data = await response.json();
    if (data.access_token) {
      return data.access_token;  // Return het access token als het succesvol is
    } else {
      throw new Error('Could not get access token');
    }
  };
  
  // Functie om albums van een artiest op te halen
  export const getArtistAlbums = async (artistId) => {
    const token = await getAccessToken();  // Verkrijg het access token
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,  // Voeg het access token toe aan de header
      },
    });
  
    const data = await response.json();
    let albums = data.items || [];
  
    console.log('Albums:', albums.map(album => album.name));
  
    const desiredAlbums = [
      "Taylor Swift (Deluxe Edition)",
      "Fearless (Taylor's Version)",
      "Speak Now (Taylor's Version)",
      "Red (Taylor's Version)",
      "1989 (Taylor's Version)",
      'reputation',
      'Lover',
      'folklore',
      'evermore',
      'Midnights',
      'THE TORTURED POETS DEPARTMENT: THE ANTHOLOGY'
    ];
  
    albums = albums.filter(album =>
      desiredAlbums.some(desired =>
        album.name.toLowerCase() === desired.toLowerCase() // Exacte vergelijking (case insensitive)
      )
    );
  
    albums = albums.sort((a, b) => {
      const aIndex = desiredAlbums.findIndex(desired => desired.toLowerCase() === a.name.toLowerCase());
      const bIndex = desiredAlbums.findIndex(desired => desired.toLowerCase() === b.name.toLowerCase());
      return aIndex - bIndex;  // Vergelijk de indexen om de volgorde te bepalen
    });
  
    const albumsWithTracks = await Promise.all(albums.map(async (album) => {
      const albumTracksResponse = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks?limit=32`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const albumTracksData = await albumTracksResponse.json();
      album.tracks = albumTracksData.items;  // Voeg de tracks toe aan elk album
  
      // Haal de audiofeatures op voor elke track in het album
      const trackIds = album.tracks.map(track => track.id).join(',');
      const audioFeaturesResponse = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const audioFeaturesData = await audioFeaturesResponse.json();
      console.log(audioFeaturesData)
  
      // Voeg de audiofeatures toe aan de bijbehorende track
      album.tracks = album.tracks.map(track => {
        const features = audioFeaturesData.audio_features.find(f => f && f.id === track.id);
        if (features) {
          track.danceability = features.danceability;
          track.energy = features.energy;
        }
        return track;
      });
  
      return album;
    }));
  
    // Log de gefilterde albums om te zien of we alleen de gewenste albums hebben
    console.log('Filtered Albums with Tracks and Features:', albumsWithTracks);
  
    return albumsWithTracks;
  };
  
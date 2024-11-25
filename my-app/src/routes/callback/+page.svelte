<!-- src/Callback.svelte
<script>
  import { onMount } from 'svelte';

  let errorMessage = '';
  let accessToken = '';

  onMount(async () => {
    // Haal de 'code' op uit de URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Dit is de authorization code van Spotify

    if (code) {
      try {
        // Stuur een POST-verzoek naar Spotify om de code om te zetten in een access token
        const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code, // De code die we hebben ontvangen van Spotify
            redirect_uri: 'http://localhost:5173/callback', // Dezelfde redirect URI als in de Spotify Developer Console
            client_id: 'ab9e777a63784d36b86e403969d0ef85', // Vervang met je Client ID
            client_secret: '4ca068ef035d4109987c5aae1f434214', // Vervang met je Client Secret
          }),
        });

        const data = await response.json();

        // Als de response succesvol is, haal het access token op
        if (response.ok) {
          accessToken = data.access_token;

          // Sla het access token op in localStorage voor gebruik in andere delen van de app
          localStorage.setItem('spotify_token', accessToken);
        } else {
          errorMessage = data.error_description || 'Failed to get access token';
        }
      } catch (error) {
        errorMessage = 'Failed to get access token';
        console.error(error);
      }
    } else {
      errorMessage = 'No authorization code found in the URL';
    }
  });
</script>

{#if errorMessage}
  <p>{errorMessage}</p>
{:else if accessToken}
  <!-- <p>Access Token: {accessToken}</p> -->
  <!-- Je kunt hier de access token gebruiken om gegevens op te halen van de Spotify API -->
{/if} -->

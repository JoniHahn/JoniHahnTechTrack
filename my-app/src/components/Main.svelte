<script>
  import { onMount } from 'svelte';
  import { getArtistAlbums } from '../lib/spotify.js';  // Zorg ervoor dat je het juiste pad instelt

  let albums = [];  // De lijst van albums met tracks
  let loading = true;  // Laadstatus
  let errorMessage = '';  // Foutmelding

  // Vervang hier de artiest-ID door de ID van de artiest die je wilt
  const artistId = '06HL4z0CvFAxyc27GXpf02';  // Dit is Taylor Swift's artiest-ID (verander het indien nodig)

  onMount(async () => {
    try {
      // Haal de albums op voor de opgegeven artiest
      albums = await getArtistAlbums(artistId);
      console.log('Albums retrieved:', albums);  // Log de opgehaalde albums
    } catch (error) {
      errorMessage = 'Er is een fout opgetreden bij het ophalen van de albums';
      console.error(error);
    } finally {
      loading = false;  // Stop de laadstatus
    }
  });
</script>

<style>
  .album-list {
    list-style-type: none;
    padding: 0;
  }

  .album-item {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .album-item img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }

  .album-item p {
    margin: 0;
  }

  .track-list {
    list-style-type: none;
    padding-left: 20px;
  }

  .track-item {
    margin: 5px 0;
  }
</style>

<!-- <h1>Taylor Swift Albums & Tracks</h1> -->

{#if loading}
  <p>Loading albums...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <ul class="album-list">
    {#each albums as album}
      <li class="album-item">
        <img src={album.images[0].url} alt={album.name} />
        <p><strong>{album.name}</strong></p>
        <ul class="track-list">
          {#each album.tracks as track}
            <li class="track-item">
              <p>{track.name}</p>
              <span>Danceability: {track.danceability.toFixed(2)} | Energy: {track.energy.toFixed(2)}</span>
            </li>
          {/each}
        </ul>
      </li>
    {/each}
  </ul>
{/if}

<script>
  import { onMount } from 'svelte';
  import { getArtistAlbums } from '../lib/spotify.js';

  let albums = [];
  let selectedAlbums = new Set();
  let loading = true;
  let errorMessage = '';
  const artistId = '06HL4z0CvFAxyc27GXpf02';

  onMount(async () => {
    try {
      // Haal albums op van Spotify API
      albums = await getArtistAlbums(artistId);
    } catch (error) {
      errorMessage = 'Er is een fout opgetreden bij het ophalen van de albums.';
      console.error("Fout:", error);
    } finally {
      loading = false;
    }
  });

  // Toggle selectie van een album
  function toggleSelection(albumId) {
    if (selectedAlbums.has(albumId)) {
      selectedAlbums.delete(albumId);
    } else {
      selectedAlbums.add(albumId);
    }
    // Verzend een event om de geselecteerde albums naar de parent te sturen
    dispatch('selectionChange', Array.from(selectedAlbums));
  }

</script>

<style>
  .album-list {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 20px;
    padding: 0;
  }
  .album-item {
    list-style: none;
    width: 150px;
    text-align: center;
  }
  .album-item img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;
  }
</style>

{#if loading}
  <p>Albums worden geladen...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
  <div>

    <ul class="album-list">
      {#each albums as album}
        <li class="album-item">
          <input 
            type="checkbox" 
            id={album.id} 
            value={album.id}
            on:change={() => toggleSelection(album.id)}
          />
          <label for={album.id}>
            <img src={album.images[0]?.url} alt={album.name} />
          </label>
        </li>
      {/each}
    </ul>
  </div>
{/if}
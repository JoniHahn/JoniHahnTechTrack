<script>
  import { onMount } from 'svelte';
  import { getArtistAlbums } from '../lib/spotify.js';
  import * as d3 from 'd3';

  let albums = [];
  let tracks = [];
  let loading = true;
  let errorMessage = '';
  const artistId = '06HL4z0CvFAxyc27GXpf02';

  onMount(async () => {
    try {
      // Haal albums op van Spotify
      albums = await getArtistAlbums(artistId);
      console.log("Albums opgehaald:", albums);

      // Filter tracks die 'danceability' en 'energy' hebben
      tracks = albums.flatMap(album => album.tracks)
                     .filter(track => track.danceability !== undefined && track.energy !== undefined);

      console.log("Geldige tracks gevonden:", tracks);

      // Controleer of er geldige tracks zijn
      if (tracks.length === 0) {
        errorMessage = "Er zijn geen tracks met de vereiste eigenschappen.";
        console.log(errorMessage);
      }
    } catch (error) {
      errorMessage = 'Er is een fout opgetreden bij het ophalen van de albums';
      console.error("Fout bij ophalen albums:", error);
    } finally {
      loading = false;
      console.log("Data is geladen en klaar.");
    }
  });

  function createScatterPlot(albums) {
    const width = 928;
    const height = 600;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Dancebility"])]).nice()
      .range([marginLeft, width - marginRight])

  // Create the vertical (y) scale, positioning N/A values on the bottom margin.
  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Energy"])]).nice()
      .range([height - marginBottom, marginTop])

  }
  
</script>


<style>
  #scatterplot {
    margin-top: 20px;
    width: 100%;   /* Zorg ervoor dat de grafiek schaalt */
    height: 600px; /* Geef een vaste hoogte */
    display: block; /* Zorg ervoor dat de container zich uitstrekt */
    background-color: #f5f5f5;
  }

  ul {
    list-style: none;
    display: flex;
    justify-content: space-evenly;
    padding: 0;
  }

  @keyframes albumSpinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  ul img {
    border-radius: 50%;
    height: 5em;
    width: 5em;
    animation: albumSpinner 4s linear infinite;
    animation-iteration-count: infinite;
  }

  /* input[type="checkbox"] {
display: none;
} */
</style>

{#if loading}
  <p>Loading albums...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{:else}
<ul class="album-list">
  {#each albums as album}
    <li class="album-item">
      <input 
        type="checkbox" 
        id={album.id} 
        on:change={() => toggleSelection(album.id)}
      />
      <label for={album.id}>
        <img src={album.images[0].url} alt={album.name} />
      </label>
    </li>
  {/each}
</ul>
    <!-- <ul class="album-list">
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
    </ul> -->
   

    <!-- De container voor de scatterplot --> 
    <div id="scatterplot"></div>
  
{/if}

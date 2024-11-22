<script>
  import { onMount } from 'svelte';
  import { getArtistAlbums } from '../lib/spotify.js';
  import * as d3 from 'd3';

  let albums = [];
  let loading = true;
  let errorMessage = '';
  const artistId = '06HL4z0CvFAxyc27GXpf02';

  onMount(async () => {
    try {
      albums = await getArtistAlbums(artistId);
      if (albums.length > 0) {
        // Wanneer albums zijn geladen, roep de createScatterPlot functie aan
        createScatterPlot(albums);
      }
    } catch (error) {
      errorMessage = 'Er is een fout opgetreden bij het ophalen van de albums';
      console.error(error);
    } finally {
      loading = false;
    }
  });

  function createScatterPlot(albums) {
    // Verwerk tracks voor scatterplot data
    const tracks = albums.flatMap(album => album.tracks).filter(track => track.danceability !== undefined && track.energy !== undefined);

    if (tracks.length === 0) {
      console.log('Geen geldige tracks gevonden');
      return;
    }

    // D3.js setup
    const width = 928;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 70, left: 70 };

    const svg = d3.select("#scatterplot")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    // X-as schaling
    const x = d3.scaleLinear()
      .domain([0, d3.max(tracks, d => d.danceability)]).nice()
      .range([margin.left, width - margin.right]);

    // Y-as schaling
    const y = d3.scaleLinear()
      .domain([0, d3.max(tracks, d => d.energy)]).nice()
      .range([height - margin.bottom, margin.top]);

    // Voeg de X-as toe
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", width - margin.right)
      .attr("y", -4)
      .attr("fill", "black")
      .attr("text-anchor", "end")
      .text("Danceability");

    // Voeg de Y-as toe
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .append("text")
      .attr("x", 4)
      .attr("y", margin.top)
      .attr("fill", "black")
      .attr("text-anchor", "start")
      .text("Energy");

    // Voeg de punten toe aan de scatterplot
    svg.selectAll("circle")
      .data(tracks)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.danceability))
      .attr("cy", d => y(d.energy))
      .attr("r", 5)
      .attr('fill', 'steelblue');
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
  <div>
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

    De container voor de scatterplot
    <div id="scatterplot"></div>  
  </div>
{/if}

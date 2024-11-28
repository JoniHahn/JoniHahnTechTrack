<script>
  import { fetchAlbums } from "../lib/FetchApi.js";
  import * as d3 from 'd3';
  

  let albums = [];
  let isLoading = false;
  let selectedArtist = ""; // Hier slaan we de gekozen artiest-ID op

  // Object met artiesten en hun Spotify-ID's
  const artistOptions = {
    "Taylor Swift": "06HL4z0CvFAxyc27GXpf02",
    "Ariana Grande": "66CXWjxzNUsdJxJ2JdwvnR",
    "Sabrina Carpenter": "74KM79TiuVKeVCqs8QtB0B",
    "Dua Lipa": "6M2wZ9GZgrQXHCFfjv46we",
    "Chappel Roan":"7GlBOeep6PqTfFi59PTUUN",
    "Bruno Mars":"0du5cEVh5yTK9QJze8zA0C",
    "bankzitters":"1g9nyCbUH0kbNgXAsw7tUB",


  };

  // Functie om albums te laden van de geselecteerde artiest
  async function loadAlbums() {
    if (!selectedArtist) {
      alert("Selecteer een artiest.");
      return;
    }

    try {
      isLoading = true;
      const artistId = artistOptions[selectedArtist];
      albums = await fetchAlbums({ [selectedArtist]: artistId });
      console.log("Gevonden albums:", albums); // Loggen van de albums die zijn opgehaald
      createChart();  // Roep de D3-functie aan om de grafiek te maken
    } catch (error) {
      console.error("Fout tijdens het laden van albums:", error);
    } finally {
      isLoading = false;
    }
  }

  // D3-functie om een bar chart te maken van het aantal tracks per album
  function createChart() {
    // Verwijder eventuele eerdere grafieken voordat je een nieuwe maakt
    const chartContainer = document.getElementById("chart-container");
    chartContainer.innerHTML = '';  // Maak de container leeg voor een nieuwe grafiek

    const margin = { top: 20, right: 30, bottom: 40, left: 400 };
    const width = 800 - margin.left - margin.right;
    const height = 550 - margin.top - margin.bottom;

    // Maak de schaal voor de x-as (aantal tracks)
    const x = d3.scaleLinear()
      .domain([0, d3.max(albums, d => d.totalTracks)]) // van 0 tot het maximale aantal tracks
      .range([0, width]);

    // Maak de schaal voor de y-as (album namen)
    const y = d3.scaleBand()
      .domain(albums.map(d => d.name))  // Gebruik de albumnaam als de y-as
      .range([0, height])
      .padding(0.4); // Ruimte tussen de bars

    // Maak een SVG-container
    const svg = d3.select(chartContainer).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Voeg een rect toe voor elk album
    svg.selectAll(".bar")
      .data(albums)
      .join("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => y(d.name))
      .attr("width", d => x(d.totalTracks))
      .attr("height", y.bandwidth());

    // Voeg labels toe voor elk album
    svg.selectAll(".label")
      .data(albums)
      .join("text")
      .attr("class", "label")
      .attr("x", d => x(d.totalTracks) + 5)
      .attr("y", d => y(d.name) + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text(d => d.totalTracks);

    // Voeg de x-as toe
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Voeg de y-as toe
    svg.append("g")
      .call(d3.axisLeft(y));
  }
</script>

<style>
  button {
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
    background-color: #1db954;
    color: white;
    border: none;
    border-radius: 5px;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  select {
    margin: 1rem 0;
    padding: 0.5rem;
    font-size: 1rem;
  }

  #chart-container {
    margin-top: 30px;
  }
</style>

<!-- Dropdown voor het selecteren van een artiest -->
<select bind:value={selectedArtist}>
  <option value="" disabled>Selecteer een artiest</option>
  {#each Object.keys(artistOptions) as artist}
    <option value={artist}>{artist}</option>
  {/each}
</select>

<!-- Knop om albums op te halen -->
<button on:click={loadAlbums} disabled={isLoading}>
  {isLoading ? "Laden..." : "Haal albums op"}
</button>

 <!-- Chart container voor de D3 grafiek -->
<div id="chart-container"></div>

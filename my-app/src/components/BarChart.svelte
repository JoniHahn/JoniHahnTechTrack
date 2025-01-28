<script>
import { searchArtists } from "../lib/FetchApi.js";
import * as d3 from 'd3';

let searchQuery = ""; // Gebruikerszoekterm
let artists = []; // Zoekresultaten
let isLoading = false;
let selectedArtist = null; // Gebruiker kan een artiest selecteren

// Functie om artiesten te zoeken
async function loadArtists() {
  if (!searchQuery) {
    alert("Voer een zoekterm in.");
    return;
  }

  try {
    isLoading = true;
    artists = await searchArtists(searchQuery, 10); // Zoek de eerste 10 artiesten
    console.log("Gevonden artiesten:", artists);
    createArtistPopularityChart(artists); // Maak de grafiek na het ophalen van artiesten
  } catch (error) {
    console.error("Fout bij het zoeken naar artiesten:", error);
  } finally {
    isLoading = false;
  }
}

// Functie om de grafiek te maken
function createArtistPopularityChart(artists) {
  // Chart afmetingen en marges
  const width = 1050;
  const height = 500;
  const marginTop = 30;
  const marginRight = 50;
  const marginBottom = 30;
  const marginLeft = 100;

  // Gegevens voorbereiden: artiesten met hun populariteit
  const data = artists.map(artist => ({
    name: artist.name, 
    popularity: artist.popularity // De populariteit van de artiest
  }));

  // X-as schaal (horizontaal, gebaseerd op populariteit)
  const x = d3.scaleLinear()
      .domain([0, 100]) // Het bereik van populariteit, van 0 tot 100
      .range([marginLeft, width - marginRight]);

  // Y-as schaal (verticaal, voor de artiesten)
  const y = d3.scaleBand()
      .domain(data.map(d => d.name)) // Artiesten op de y-as
      .range([marginTop, height - marginBottom])
      .padding(0.1); // Ruimte tussen de staven

  // SVG-container maken
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // Voeg de sterren als bar toe voor elke artiest
  svg.append("g")
  .attr("fill", "#1db954")  // Maak de sterren groen
    .selectAll()
    .data(data)
    .join("text")
    .attr("x", marginLeft) // Zet de sterren aan het begin van de staaf
    .attr("y", (d) => y(d.name) + y.bandwidth() / 2) // Zet de sterren verticaal gecentreerd in de staaf
    .attr("dy", ".35em") // Verticaal centreren van de sterren
    .style("font-size", "9px") // Grootte van de sterren
    .text((d) => "★".repeat(Math.floor(d.popularity))); // Voeg het juiste aantal sterren toe op basis van populariteit

  // Voeg de x-as toe en label
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

  // Voeg de y-as toe, verwijder de domain lijn en voeg label toe
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());
          

          svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .style("fill", "gray");  // Maak de x-as ticks grijs

// Artiestennamen op de Y-as grijs maken
svg.selectAll(".tick text").style("fill", "gray");


  // Voeg de grafiek toe aan de container
  const chartContainer = document.getElementById("chart-container");
  chartContainer.innerHTML = '';  // Maak de container leeg voor een nieuwe grafiek
  chartContainer.appendChild(svg.node()); // Voeg de SVG toe aan de container
}

  // import { fetchAlbums} from "../lib/FetchApi.js";
  // import * as d3 from 'd3';

  // let albums = [];
  // let isLoading = false;
  // let selectedArtist = "";
  // let artistOptions = [];

  // // Functie om artiesten op te halen van de API
  // async function loadArtists() {
  //   try {
  //     artistOptions = await fetchArtists(); // Haal een lijst van artiesten op
  //   } catch (error) {
  //     console.error("Fout tijdens het laden van artiesten:", error);
  //   }
  // }

  // // Functie om albums te laden van de geselecteerde artiest
  // async function loadAlbums() {
  //   if (!selectedArtist) {
  //     alert("Selecteer een artiest.");
  //     return;
  //   }

  //   try {
  //     isLoading = true;
  //     // Vind de artiest-ID voor de geselecteerde artiest
  //     const artistId = artistOptions.find(a => a.name === selectedArtist)?.id;
  //     if (!artistId) {
  //       throw new Error("Artiest niet gevonden");
  //     }

  //     // Haal de albums op voor de geselecteerde artiest
  //     albums = await fetchAlbums({ [selectedArtist]: artistId });
  //     createChart();  // Roep de D3-functie aan om de grafiek te maken
  //   } catch (error) {
  //     console.error("Fout tijdens het laden van albums:", error);
  //   } finally {
  //     isLoading = false;
  //   }
  // }

  // // D3-functie om een bar chart te maken van het aantal tracks per album
  // function createChart() {
  //   const chartContainer = document.getElementById("chart-container");
  //   chartContainer.innerHTML = '';  // Maak de container leeg voor een nieuwe grafiek

  //   const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  //   const width = chartContainer.clientWidth - margin.left - margin.right;
  //   const height = 550 - margin.top - margin.bottom;

  //   const x = d3.scaleLinear()
  //     .domain([0, d3.max(albums, d => d.totalTracks)])
  //     .range([0, width]);

  //   const y = d3.scaleBand()
  //     .domain(albums.map(d => d.name))
  //     .range([0, height])
  //     .padding(0.4);

  //   const svg = d3.select(chartContainer).append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //     .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  //     .append("g")
  //     .attr("transform", `translate(${margin.left},${margin.top})`);

  //   svg.selectAll(".bar")
  //     .data(albums)
  //     .join("rect")
  //     .attr("class", "bar")
  //     .attr("x", 0)
  //     .attr("y", d => y(d.name))
  //     .attr("width", d => x(d.totalTracks))
  //     .attr("height", y.bandwidth());

  //   svg.selectAll(".label")
  //     .data(albums)
  //     .join("text")
  //     .attr("class", "label")
  //     .attr("x", d => x(d.totalTracks) + 5)
  //     .attr("y", d => y(d.name) + y.bandwidth() / 2)
  //     .attr("dy", ".35em")
  //     .text(d => d.totalTracks);

  //   svg.append("g")
  //     .attr("transform", `translate(0,${height})`)
  //     .call(d3.axisBottom(x));

  //   svg.append("g")
  //     .call(d3.axisLeft(y));
  // }

  // // Laad artiesten bij het opstarten
  // loadArtists();
  
</script>

<style>
  h3 {
    color: #1db954;
    margin-bottom: 0;
  }
  /* button {
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
    width: 100%;
  } */
</style>

<!-- Dropdown voor het selecteren van een artiest -->
<!-- <select bind:value={selectedArtist}>
  <option value="" disabled>Selecteer een artiest</option>
  {#each artistOptions as artist}
    <option value={artist.name}>{artist.name}</option>
  {/each}
</select> -->

<!-- Knop om albums op te halen -->
<!-- <button on:click={loadAlbums} disabled={isLoading}>
  {isLoading ? "Laden..." : "Haal albums op"}
</button> -->

<!-- Chart container voor de D3 grafiek -->
<!-- <div id="chart-container"></div> -->
<!-- <div>
  {#each artists as artist}
    <div>
      <h3>{artist.name}</h3>
      <p>Genres: {artist.genres.join(", ")}</p>
      <p>Volgers: {artist.followers}</p>
      <p>Populariteit: {artist.popularity}</p>
      <p>Aantal Albums: {artist.albumCount}</p>
      <img src={artist.image} alt="{artist.name}" width="150" />
    </div>
  {/each}
</div> -->
<h3>Zoeken</h3>
<input
  type="text"
  placeholder="Zoek naar een artiest"
  bind:value={searchQuery}
/>
<button on:click={loadArtists} disabled={isLoading}>
  {isLoading ? "Zoeken..." : "Zoek artiesten"}
</button>

<div id="chart-container"></div>


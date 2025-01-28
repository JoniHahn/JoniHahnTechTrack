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
    .text((d) => "★".repeat(Math.floor(d.popularity))) // Voeg het juiste aantal sterren toe op basis van populariteit
    .on("mouseover", function(event, d) {
      // Spraakfunctie die tekst voorleest
      responsiveVoice.speak(`Artiest: ${d.name}, Populariteit: ${d.popularity}`, "Dutch Female");
    });

  // Voeg de x-as toe en label
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

  // Voeg de y-as toe, verwijder de domain lijn en voeg label toe
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());

  // Maak de x-as ticks grijs
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll("text")
    .style("fill", "gray");  // Maak de x-as ticks grijs

  // Maak de artiestennamen op de Y-as grijs
  svg.selectAll(".tick text").style("fill", "gray");

  // Voeg de grafiek toe aan de container
  const chartContainer = document.getElementById("chart-container");
  chartContainer.innerHTML = '';  // Maak de container leeg voor een nieuwe grafiek
  chartContainer.appendChild(svg.node()); // Voeg de SVG toe aan de container
}

  
</script>

<style>
  h3 {
    color: #1db954;
    margin-bottom: 0;
  }

</style>

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


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

      // Verzamel tracks met geldige danceability en energy waarden
      tracks = albums.flatMap(album => album.tracks)
                     .filter(track => track.danceability !== undefined && track.energy !== undefined);

      // Als er tracks zijn, teken de scatterplot
      if (tracks.length > 0) {
        createScatterPlot(tracks);
      } else {
        errorMessage = "Er zijn geen tracks met de vereiste eigenschappen.";
      }
    } catch (error) {
      errorMessage = 'Er is een fout opgetreden bij het ophalen van de albums';
      console.error("Fout bij ophalen albums:", error);
    } finally {
      loading = false;
    }
  });

  function createScatterPlot(data) {
    const width = 928;
    const height = 400;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Schalen voor danceability (X) en energy (Y)
    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.danceability)]).nice()
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.energy)]).nice()
      .range([height - marginBottom, marginTop]);

    // Selecteer de container
    const svg = d3.select("#scatterplot")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    // X-as
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x))
      .call(g => g.select(".domain").remove())
      .selectAll(".tick text")
      .attr("fill", "white")
      // .call(g => g.append("text")
      //   .attr("x", width - marginRight)
      //   .attr("y", -4)
      //   .attr("fill", "#1db954")
      //   .attr("font-weight", "bold")
      //   .attr("text-anchor", "end")
      //   .text("Danceability"));

    // Y-as
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .selectAll(".tick text")
      .attr("fill", "white")
        // .attr("x", 4)
        // .attr("fill", "#1db954")
        // .attr("text-anchor", "start")
        // .attr("font-weight", "bold")
        // .text("Energy")

    // Scatterplot-punten
    const dots = svg.append("g")
      .attr("fill", "#1db954")
      .attr("stroke", "none")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", d => x(d.danceability))
      .attr("cy", d => y(d.energy))
      .attr("r", 4);

    // Tooltip
    const tooltip = d3.select("#scatterplot")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "5px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none");

    dots.on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
        .html(`
          <strong>${d.name}</strong><br>
        `);
    }).on("mousemove", (event) => {
      tooltip.style("top", `${event.pageY - 40}px`)
        .style("left", `${event.pageX + 10}px`);
    }).on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });
  }
</script>

<div id="scatterplot"></div>

{#if loading}
  <p>Loading...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{/if}

  
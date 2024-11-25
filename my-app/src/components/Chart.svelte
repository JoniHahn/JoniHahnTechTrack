<script>
  import { onMount } from 'svelte';
  import { getArtistAlbums } from '../lib/spotify.js';
  import * as d3 from 'd3';

  let albums = [];
  let allTracks = [];
  let filteredTracks = [];
  let selectedAlbumIds = [];
  let highlightedTracks = new Set(); // Tracks currently highlighted
  let loading = true;
  let errorMessage = '';
  const artistId = '06HL4z0CvFAxyc27GXpf02'; // Example: Taylor Swift

  onMount(async () => {
    try {
      albums = await getArtistAlbums(artistId);
      allTracks = albums.flatMap(album =>
        album.tracks.map(track => ({
          ...track,
          albumId: album.id // Link tracks to albums
        }))
      ).filter(track => track.danceability !== undefined && track.energy !== undefined);

      filteredTracks = []; // Initially no points
      drawScatterPlot();
    } catch (error) {
      errorMessage = 'Failed to fetch albums.';
      console.error("Error fetching albums:", error);
    } finally {
      loading = false;
    }
  });

  function updateFilter() {
    filteredTracks = selectedAlbumIds.length === 0
      ? []
      : allTracks.filter(track => selectedAlbumIds.includes(track.albumId));
    updateScatterPlot();
  }

  function toggleHighlight(trackId) {
    if (highlightedTracks.has(trackId)) {
      highlightedTracks.delete(trackId); // Remove highlight
    } else {
      highlightedTracks.add(trackId); // Add highlight
    }
    updateScatterPlot(); // Redraw points
  }

  function drawScatterPlot() {
    const width = 1400;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select("#scatterplot")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg.append("g").attr("class", "x-axis");
    svg.append("g").attr("class", "y-axis");
    svg.append("g").attr("class", "points");
    svg.append("g").attr("class", "tooltip");

    const xScale = d3.scaleLinear()
      .domain([0, 1]) // Danceability range
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 1]) // Energy range
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(10);

    svg.select(".x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "white");

    svg.select(".y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll("text")
      .attr("fill", "white");

    svg.append("text")
      .attr("x", width - 50)
      .attr("y", height - 5)
      .text("Danceability")
      .attr("fill", "white");

    svg.append("text")
      .attr("x", 20)
      .attr("y", 20)
      .text("Energy")
      .attr("fill", "white");

    updateScatterPlot(); // Draw initial points
  }

  function updateScatterPlot() {
    const width = 1400;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select("#scatterplot svg");
    const pointsGroup = svg.select(".points");

    const xScale = d3.scaleLinear()
      .domain([0, 1]) // Danceability range
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 1]) // Energy range
      .range([height - margin.bottom, margin.top]);

    const points = pointsGroup.selectAll("circle")
      .data(filteredTracks, d => d.id);

    points.enter()
      .append("circle")
      .attr("cx", d => xScale(d.danceability))
      .attr("cy", d => yScale(d.energy))
      .attr("r", 5)
      .attr("fill", d => highlightedTracks.has(d.id) ? "orange" : "#1db954")
      .attr("stroke", d => highlightedTracks.has(d.id) ? "yellow" : "none")
      .attr("stroke-width", 2)
      .on("click", (event, d) => toggleHighlight(d.id)) // Toggle highlight on click
      .on("mouseover", (event, d) => showTooltip(event, d)) // Tooltip
      .on("mouseout", hideTooltip);

    points.attr("cx", d => xScale(d.danceability))
      .attr("cy", d => yScale(d.energy))
      .attr("fill", d => highlightedTracks.has(d.id) ? "orange" : "#1db954")
      .attr("stroke", d => highlightedTracks.has(d.id) ? "yellow" : "none");

    points.exit().remove();
  }

</script>

<style>
  ul {
    display: flex;
    justify-content: space-between;
  }

  li {
    list-style: none;
  }

  img {
    border-radius: 100%;
    height: 5em;
    width: 5em;
  }

  input {
    display: none;
  }
</style>

<ul>
  {#each albums as album}
<li>
  <label>
    <input
      type="checkbox"
      value={album.id}
      bind:group={selectedAlbumIds}
      on:change={updateFilter}
    />
    <img src={album.images[0]?.url} alt={album.name} />
  </label>
</li>
  {/each}
</ul>

<div id="scatterplot"></div>

{#if loading}
  <p>Loading...</p>
{:else if errorMessage}
  <p>{errorMessage}</p>
{/if}



  
import { createTooltip } from "./components/tooltip.js";
import { drawStateMap } from "./components/state-map.js";
import { drawJobMarkers } from "./components/job-markers.js";
import { addMapZoom } from "./components/map-zoom.js";

const mapShell = document.querySelector("#map-shell");
const mapSvg = document.querySelector("#us-map");
const loadingMessage = document.querySelector("#map-loading");
const errorMessage = document.querySelector("#map-error");
const count = document.querySelector("#job-count");
const searchInput = document.querySelector("#job-search");
const stateFilter = document.querySelector("#state-filter");
const cityFilter = document.querySelector("#city-filter");
const clearFilters = document.querySelector("#clear-filters");
const filterSummary = document.querySelector("#filter-summary");
const tooltip = createTooltip(mapShell);

start();

async function start() {
  try {
    const [jobs, map] = await Promise.all([
      loadSampleJobs(),
      drawStateMap(mapSvg, tooltip)
    ]);

    addMapZoom(mapSvg, map.viewport, map.bounds);
    const updateMarkers = drawJobMarkers(map.viewport, map.projection, jobs, tooltip);
    setupFilters(jobs, updateMarkers);
    loadingMessage.hidden = true;
  } catch (error) {
    console.error("Unable to load the map or job listings.", error);
    loadingMessage.hidden = true;
    errorMessage.textContent = "The map could not be loaded. Check your internet connection and reload the page.";
    errorMessage.hidden = false;
  }
}

function setupFilters(jobs, updateMarkers) {
  const states = [...new Set(jobs.map((job) => job.state))].sort();
  setOptions(stateFilter, "All states", states);
  populateCities(jobs);

  const applyFilters = () => {
    const titleQuery = searchInput.value.trim().toLocaleLowerCase();
    const selectedState = stateFilter.value;
    const selectedCity = cityFilter.value;
    const filteredJobs = jobs.filter((job) =>
      job.title.toLocaleLowerCase().includes(titleQuery)
      && (!selectedState || job.state === selectedState)
      && (!selectedCity || job.city === selectedCity)
    );

    tooltip.hide();
    updateMarkers(filteredJobs);
    count.textContent = String(filteredJobs.length).padStart(2, "0");
    filterSummary.textContent = `Showing ${filteredJobs.length} of ${jobs.length} roles`;
    clearFilters.disabled = !titleQuery && !selectedState && !selectedCity;
  };

  searchInput.addEventListener("input", applyFilters);
  cityFilter.addEventListener("change", applyFilters);
  stateFilter.addEventListener("change", () => {
    cityFilter.value = "";
    populateCities(jobs, stateFilter.value);
    applyFilters();
  });
  clearFilters.addEventListener("click", () => {
    searchInput.value = "";
    stateFilter.value = "";
    cityFilter.value = "";
    populateCities(jobs);
    applyFilters();
    searchInput.focus();
  });

  applyFilters();
}

function populateCities(jobs, state = "") {
  const cities = [...new Set(jobs
    .filter((job) => !state || job.state === state)
    .map((job) => job.city))].sort();
  setOptions(cityFilter, "All cities", cities);
}

function setOptions(select, placeholder, values) {
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.textContent = placeholder;
  select.replaceChildren(placeholderOption);

  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  }
}

async function loadSampleJobs() {
  const response = await fetch("./data/jobs.json");
  if (!response.ok) throw new Error(`Job data request failed (${response.status}).`);
  return response.json();
}

// Replace this stub with an API request and map the response to the jobs.json shape.
export async function fetchRealTimeJobs() {
  return [];
}

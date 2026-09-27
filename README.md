# Interactive Job Finder

An interactive map for exploring sample job opportunities across the United States. Built as a modular, browser-based frontend with D3.js, the project combines geographic visualization with practical search and filtering controls.

## Features

- Explore state boundaries and job locations on a responsive U.S. map.
- Search job titles and filter results by state and city.
- Group postings by city; markers show the number of matching roles at each location.
- Select a marker to keep its details open, switch the active location, or dismiss the popup.
- Zoom and pan the map while keeping it within the U.S. map bounds.
- Use keyboard-accessible map markers and controls.

## Technology

- HTML, CSS, and native JavaScript modules
- D3.js for geographic rendering, marker joins, and map interaction
- TopoJSON for U.S. state boundary data

No build step or package installation is required.

## Run locally

Python 3 and an internet connection are required. The app fetches its JSON data and loads D3.js, TopoJSON, and state boundaries from CDNs, so it must be served over HTTP rather than opened directly as a `file://` URL.

```powershell
git clone https://github.com/everettlopez/InteractiveJobFinder.git
cd InteractiveJobFinder
python -m http.server 8000
```

On Windows, `py -m http.server 8000` also works if the Python launcher is installed. Open [http://localhost:8000](http://localhost:8000) in a browser. Stop the server with `Ctrl+C`.

## Project structure

```text
index.html                  Page structure and browser dependencies
styles.css                  Responsive layout, map, and popup styles
script.js                   Data loading, filters, and app initialization
components/
  state-map.js              State boundary rendering and state interactions
  job-markers.js            City grouping, job markers, and selection behavior
  map-zoom.js               Bounded map zoom controls
  tooltip.js                Shared popup rendering and dismissal behavior
data/
  jobs.json                 Sample job listings
```

## Data and API integration

Listings are illustrative sample data, not live job openings. Each record includes an ID, title, company, coordinates, state, city, and description. `script.js` currently loads `data/jobs.json`; `fetchRealTimeJobs()` is an integration placeholder for a future jobs API. An API response can be mapped to the same record shape and passed through the existing filtering and marker flow.

## Current scope

This is a frontend-only project. It does not include a backend, user accounts, saved jobs, or a live job feed. The sample data and external map dependencies make it easy to explore locally while keeping a clear path for future API integration.
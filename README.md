# Interactive Job Finder

A small, modular browser app that plots sample job postings on an interactive map of the United States. It uses D3.js for drawing and TopoJSON for state boundaries; there is no build step or package install.

## Run locally

The app fetches its JSON data, so serve the project over HTTP instead of opening `index.html` as a `file://` URL.

1. Open a terminal in this project directory.
2. Start a local static server with Python:

   ```powershell
   py -m http.server 8000
   ```

   On systems where `py` is unavailable, use `python -m http.server 8000`.
3. Visit `http://localhost:8000` in a browser.
4. Stop the server with `Ctrl+C`.

D3.js, TopoJSON, the US state-boundary data, and the optional Google Fonts are loaded from CDNs, so the map requires an internet connection.

## Project layout

- `index.html` contains the page structure and loads the browser dependencies.
- `styles.css` contains responsive layout, map, tooltip, and motion styles.
- `script.js` loads sample jobs and coordinates the map modules.
- `components/state-map.js` draws the states and handles state hover/focus.
- `components/job-markers.js` plots job locations and handles job hover/focus.
- `components/tooltip.js` renders safe, text-based tooltip content.
- `data/jobs.json` is the sample job dataset.

## Job data and API integration

Each job includes an `id`, `title`, `company`, `latitude`, `longitude`, `state`, `city`, and `description`. To connect a service later, replace `loadSampleJobs()` in `script.js` with an API request that returns the same array shape. `fetchRealTimeJobs()` is included as an intentionally empty integration placeholder. Pass the returned jobs to `drawJobMarkers()` to render them.

State and job tooltips are keyboard-focusable as well as hoverable. State messages use the requested placeholder format, such as “Sample info for California.”

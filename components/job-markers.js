export function drawJobMarkers(viewport, projection, jobs, tooltip) {
  const markerLayer = d3.select(viewport).append("g").attr("class", "job-markers");
  let selectedLocationId = null;

  function clearSelection() {
    selectedLocationId = null;
    markerLayer.selectAll("g.job-location")
      .classed("is-selected", false)
      .attr("aria-pressed", "false");
    tooltip.hide(true);
  }

  function pinLocation(location, pointerEvent, anchor) {
    selectedLocationId = location.id;
    markerLayer.selectAll("g.job-location")
      .classed("is-selected", (item) => item.id === location.id)
      .attr("aria-pressed", (item) => String(item.id === location.id));
    tooltip.show(locationTooltip(location), pointerEvent, anchor, {
      pinned: true,
      onClose: clearSelection
    });
  }

  document.addEventListener("click", (event) => {
    if (selectedLocationId === null) return;
    if (event.target.closest?.(".job-location, #map-tooltip")) return;
    clearSelection();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && selectedLocationId !== null) clearSelection();
  });

  function updateMarkers(visibleJobs) {
    const cityGroups = d3.group(visibleJobs, (job) => JSON.stringify([job.state, job.city]));
    const locations = Array.from(cityGroups, ([id, cityJobs]) => ({
      id,
      city: cityJobs[0].city,
      state: cityJobs[0].state,
      jobs: cityJobs,
      count: cityJobs.length,
      latitude: d3.mean(cityJobs, (job) => job.latitude),
      longitude: d3.mean(cityJobs, (job) => job.longitude)
    }));
    const markerJoin = markerLayer.selectAll("g.job-location").data(locations, (location) => location.id);
    const exitingMarkers = markerJoin.exit();
    exitingMarkers.select("circle")
      .interrupt()
      .transition()
      .duration(120)
      .attr("r", 0)
      .remove();
    exitingMarkers.interrupt().transition().duration(120).remove();

    const enteringMarkers = markerJoin.enter()
      .append("g")
      .attr("class", "job-location")
      .attr("role", "button")
      .attr("tabindex", 0);

    enteringMarkers.append("circle").attr("class", "job-marker").attr("r", 0);
    enteringMarkers.append("text")
      .attr("class", "job-marker-count")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("aria-hidden", "true");
    enteringMarkers.append("title");

    const markers = enteringMarkers.merge(markerJoin);
    markers
      .attr("transform", (location) => {
        const [x, y] = projection([location.longitude, location.latitude]) ?? [-20, -20];
        return `translate(${x},${y})`;
      })
      .attr("aria-label", (location) => {
        const listings = location.jobs.map((job) => `${job.title} at ${job.company}`).join("; ");
        return `${location.count} job listing${location.count === 1 ? "" : "s"} in ${location.city}, ${location.state}: ${listings}`;
      })
      .classed("is-selected", (location) => selectedLocationId === location.id)
      .attr("aria-pressed", (location) => String(selectedLocationId === location.id))
      .select("title")
      .text((location) => `${location.count} job listing${location.count === 1 ? "" : "s"} in ${location.city}`);

    markers.select("text.job-marker-count")
      .text((location) => location.count > 1 ? String(location.count) : "");

    markers.interrupt()
      .transition()
      .duration(180)
      .select("circle.job-marker")
      .attr("r", (location) => location.count > 1 ? Math.max(9, String(location.count).length * 3.5 + 4) : 5);

    markers
      .on("pointerenter pointermove", function (event, location) {
      if (selectedLocationId !== null) return;
      d3.select(this).raise();
      tooltip.show(locationTooltip(location), event);
    })
    .on("pointerleave", (_event, location) => {
      if (selectedLocationId !== location.id) tooltip.hide();
    })
    .on("focus", function (event, location) {
      if (selectedLocationId !== null) return;
      const [x, y] = d3.zoomTransform(viewport.ownerSVGElement)
        .apply(projection([location.longitude, location.latitude]));
      tooltip.show(locationTooltip(location), null, { x, y });
    })
    .on("blur", (_event, location) => {
      if (selectedLocationId !== location.id) tooltip.hide();
    })
    .on("click", function (event, location) {
      event.stopPropagation();
      pinLocation(location, event);
    })
    .on("keydown", function (event, location) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      const [x, y] = d3.zoomTransform(viewport.ownerSVGElement)
        .apply(projection([location.longitude, location.latitude]));
      pinLocation(location, null, { x, y });
    });
}

  updateMarkers(jobs);
  return updateMarkers;
}

function locationTooltip(location) {
  const isSingleListing = location.count === 1;
  const job = location.jobs[0];

  return {
    kicker: `${location.city}, ${location.state}`,
    title: isSingleListing ? job.title : `${location.count} open roles`,
    copy: isSingleListing ? `${job.company} · ${job.description}` : "",
    actionLabel: isSingleListing ? "" : "View jobs"
  };
}

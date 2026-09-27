export function drawJobMarkers(viewport, projection, jobs, tooltip) {
  const markerLayer = d3.select(viewport).append("g").attr("class", "job-markers");

  function updateMarkers(visibleJobs) {
    const markerJoin = markerLayer.selectAll("circle").data(visibleJobs, (job) => job.id);
    markerJoin.exit()
      .interrupt()
      .transition()
      .duration(120)
      .attr("r", 0)
      .remove();

    const enteringMarkers = markerJoin.enter()
      .append("circle")
      .attr("class", "job-marker")
      .attr("cx", (job) => projection([job.longitude, job.latitude])?.[0] ?? -20)
      .attr("cy", (job) => projection([job.longitude, job.latitude])?.[1] ?? -20)
      .attr("r", 0)
      .attr("tabindex", 0);

    enteringMarkers.append("title");

    const markers = enteringMarkers.merge(markerJoin);
    markers
      .attr("aria-label", (job) => `${job.title} at ${job.company}, ${job.city}, ${job.state}`)
      .select("title")
      .text((job) => `${job.title} at ${job.company}`);

    markers.interrupt()
      .transition()
      .duration(180)
      .attr("r", 5);

    markers
    .on("pointerenter pointermove", function (event, job) {
      d3.select(this).raise();
      tooltip.show({
        kicker: `${job.city}, ${job.state}`,
        title: job.title,
        copy: `${job.company} · ${job.description}`
      }, event);
    })
    .on("pointerleave", tooltip.hide)
    .on("focus", function (event, job) {
      const [x, y] = d3.zoomTransform(viewport.ownerSVGElement)
        .apply(projection([job.longitude, job.latitude]));
      tooltip.show({
        kicker: `${job.city}, ${job.state}`,
        title: job.title,
        copy: `${job.company} · ${job.description}`
      }, null, { x, y });
    })
    .on("blur", tooltip.hide);
}

  updateMarkers(jobs);
  return updateMarkers;
}

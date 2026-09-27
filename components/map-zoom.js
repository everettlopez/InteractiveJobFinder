export function addMapZoom(svg, viewport, mapBounds) {
  const svgSelection = d3.select(svg);
  const defaultConstrain = d3.zoom().constrain();
  const zoom = d3.zoom()
    .extent([[0, 0], [975, 610]])
    .translateExtent(mapBounds)
    .scaleExtent([1, 8])
    .constrain((transform, extent, translateExtent) => {
      if (transform.k <= 1) return d3.zoomIdentity;
      return defaultConstrain(transform, extent, translateExtent);
    })
    .on("zoom", (event) => {
      d3.select(viewport).attr("transform", event.transform);
    });

  svgSelection.call(zoom);

  document.querySelector("#zoom-in").addEventListener("click", () => {
    svgSelection.transition().duration(180).call(zoom.scaleBy, 1.5);
  });
  document.querySelector("#zoom-out").addEventListener("click", () => {
    svgSelection.transition().duration(180).call(zoom.scaleBy, 1 / 1.5);
  });
}
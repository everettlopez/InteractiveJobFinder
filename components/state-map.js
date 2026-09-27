const STATE_NAMES = {
  1: "Alabama", 2: "Alaska", 4: "Arizona", 5: "Arkansas", 6: "California",
  8: "Colorado", 9: "Connecticut", 10: "Delaware", 11: "District of Columbia",
  12: "Florida", 13: "Georgia", 15: "Hawaii", 16: "Idaho", 17: "Illinois",
  18: "Indiana", 19: "Iowa", 20: "Kansas", 21: "Kentucky", 22: "Louisiana",
  23: "Maine", 24: "Maryland", 25: "Massachusetts", 26: "Michigan", 27: "Minnesota",
  28: "Mississippi", 29: "Missouri", 30: "Montana", 31: "Nebraska", 32: "Nevada",
  33: "New Hampshire", 34: "New Jersey", 35: "New Mexico", 36: "New York",
  37: "North Carolina", 38: "North Dakota", 39: "Ohio", 40: "Oklahoma", 41: "Oregon",
  42: "Pennsylvania", 44: "Rhode Island", 45: "South Carolina", 46: "South Dakota",
  47: "Tennessee", 48: "Texas", 49: "Utah", 50: "Vermont", 51: "Virginia",
  53: "Washington", 54: "West Virginia", 55: "Wisconsin", 56: "Wyoming"
};

export async function drawStateMap(svg, tooltip) {
  const topology = await d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json");
  const states = topojson.feature(topology, topology.objects.states).features
    .filter((state) => STATE_NAMES[Number(state.id)]);
  const projection = d3.geoAlbersUsa().translate([487.5, 305]).scale(1250);
  const path = d3.geoPath(projection);
  const map = d3.select(svg);
  const viewport = map.append("g").attr("class", "map-viewport");

  viewport.append("g")
    .selectAll("path")
    .data(states)
    .join("path")
    .attr("class", "state")
    .attr("d", path)
    .attr("tabindex", 0)
    .attr("aria-label", (state) => `${stateName(state)}, state information`)
    .on("pointerenter pointermove", function (event, state) {
      if (event.type === "pointerenter") d3.select(this).raise();
      tooltip.show({
        kicker: "State overview",
        title: stateName(state),
        copy: `Sample info for ${stateName(state)}`
      }, event);
    })
    .on("pointerleave", tooltip.hide)
    .on("focus", function (_event, state) {
      const [x, y] = d3.zoomTransform(svg).apply(path.centroid(state));
      tooltip.show({
        kicker: "State overview",
        title: stateName(state),
        copy: `Sample info for ${stateName(state)}`
      }, null, { x, y });
    })
    .on("blur", tooltip.hide);

  const bounds = path.bounds({ type: "FeatureCollection", features: states });
  return { projection, viewport: viewport.node(), bounds };
}

function stateName(state) {
  return STATE_NAMES[Number(state.id)] ?? "United States";
}

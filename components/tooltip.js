// Shared tooltip rendering for map states and job markers.
export function createTooltip(container) {
  const tooltip = document.querySelector("#map-tooltip");

  function show({ kicker, title, copy }, pointerEvent, anchor) {
    tooltip.replaceChildren();
    tooltip.append(makeText("p", "tooltip-kicker", kicker));
    tooltip.append(makeText("p", "tooltip-title", title));
    tooltip.append(makeText("p", "tooltip-copy", copy));
    tooltip.hidden = false;

    const bounds = container.getBoundingClientRect();
    const point = pointerEvent
      ? { x: pointerEvent.clientX - bounds.left, y: pointerEvent.clientY - bounds.top }
      : anchor;
    const left = Math.max(10, Math.min(point.x + 14, bounds.width - tooltip.offsetWidth - 10));
    const top = Math.max(10, Math.min(point.y + 14, bounds.height - tooltip.offsetHeight - 10));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function hide() {
    tooltip.hidden = true;
  }

  return { show, hide };
}

function makeText(tag, className, value) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = value;
  return element;
}

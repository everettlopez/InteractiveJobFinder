// Shared tooltip rendering for map states and job markers.
export function createTooltip(container) {
  const tooltip = document.querySelector("#map-tooltip");
  let pinned = false;

  function show({ kicker, title, copy, actionLabel }, pointerEvent, anchor, options = {}) {
    if (pinned && !options.pinned) return;

    tooltip.replaceChildren();
    pinned = Boolean(options.pinned);
    tooltip.classList.toggle("is-pinned", pinned);
    tooltip.append(makeText("p", "tooltip-kicker", kicker));
    tooltip.append(makeText("p", "tooltip-title", title));
    if (copy) tooltip.append(makeText("p", "tooltip-copy", copy));
    if (actionLabel) {
      const action = document.createElement("button");
      action.className = "tooltip-action";
      action.type = "button";
      action.textContent = actionLabel;
      tooltip.append(action);
    }
    if (pinned) {
      const close = document.createElement("button");
      close.className = "tooltip-close";
      close.type = "button";
      close.setAttribute("aria-label", "Close job details");
      close.title = "Close";
      close.textContent = "×";
      close.addEventListener("click", (event) => {
        event.stopPropagation();
        hide(true);
        options.onClose?.();
      });
      tooltip.append(close);
    }
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

  function hide(force = false) {
    if (pinned && !force) return;
    pinned = false;
    tooltip.classList.remove("is-pinned");
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

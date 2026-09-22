/** Watch viewport and text-size changes without observing layout changed by pinning itself. */
export function observeSceneFit(sync: () => void): () => void {
  const probe = document.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText =
    'position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;width:1rem;height:1rem;';
  document.body.append(probe);
  const observer = new ResizeObserver(sync);
  observer.observe(probe);
  window.addEventListener('resize', sync, { passive: true });
  let disposed = false;
  void document.fonts.ready.then(() => {
    if (!disposed) sync();
  });
  return () => {
    disposed = true;
    observer.disconnect();
    probe.remove();
    window.removeEventListener('resize', sync);
  };
}

export function sceneContentFits(
  elements: readonly HTMLElement[],
  availableHeight: number,
  panels: readonly HTMLElement[] = [],
): boolean {
  return (
    elements.every((element) => element.getBoundingClientRect().height <= availableHeight - 24) &&
    panels.every(
      (panel) =>
        panel.scrollHeight <= panel.clientHeight + 1 && panel.scrollWidth <= panel.clientWidth + 1,
    )
  );
}

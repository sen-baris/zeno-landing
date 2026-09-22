import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeSceneFit, sceneContentFits } from '../../src/lib/motion/scene-fit';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('pinned scene content fit', () => {
  it('keeps complete content static when its natural height cannot fit', () => {
    const element = document.createElement('div');
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ height: 620 } as DOMRect);
    expect(sceneContentFits([element], 644)).toBe(true);
    expect(sceneContentFits([element], 643)).toBe(false);
  });

  it('rejects internally clipped panels even when the surrounding scene fits', () => {
    const panel = document.createElement('div');
    Object.defineProperties(panel, {
      clientHeight: { value: 200 },
      clientWidth: { value: 300 },
      scrollHeight: { configurable: true, value: 201 },
      scrollWidth: { configurable: true, value: 301 },
    });
    expect(sceneContentFits([], 644, [panel])).toBe(true);
    Object.defineProperty(panel, 'scrollHeight', { value: 202 });
    expect(sceneContentFits([], 644, [panel])).toBe(false);
    Object.defineProperty(panel, 'scrollHeight', { value: 200 });
    Object.defineProperty(panel, 'scrollWidth', { value: 302 });
    expect(sceneContentFits([], 644, [panel])).toBe(false);
  });

  it('observes text size, viewport and fonts, then cleans up all listeners', async () => {
    const sync = vi.fn();
    const disconnect = vi.fn();
    const observe = vi.fn();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe = observe;
        disconnect = disconnect;
      },
    );
    let ready!: () => void;
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: {
        ready: new Promise<void>((resolve) => {
          ready = resolve;
        }),
      },
    });
    const cleanup = observeSceneFit(sync);
    expect(observe).toHaveBeenCalledWith(expect.any(HTMLSpanElement));
    window.dispatchEvent(new Event('resize'));
    expect(sync).toHaveBeenCalledTimes(1);
    ready();
    await Promise.resolve();
    expect(sync).toHaveBeenCalledTimes(2);
    cleanup();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
    window.dispatchEvent(new Event('resize'));
    expect(sync).toHaveBeenCalledTimes(2);
  });

  it('does not resume a departed page when fonts finish later', async () => {
    let ready!: () => void;
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: {
        ready: new Promise<void>((resolve) => {
          ready = resolve;
        }),
      },
    });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    );
    const sync = vi.fn();
    observeSceneFit(sync)();
    ready();
    await Promise.resolve();
    expect(sync).not.toHaveBeenCalled();
  });
});

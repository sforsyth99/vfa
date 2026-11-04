import { lazy } from 'react';
import type { ComponentType } from 'react';

const RELOAD_KEY = 'vfa-chunk-reload';

/**
 * React.lazy for a route's page, so each page's code downloads only when it's
 * visited.
 *
 * If the code can't be fetched (most often because a new version was deployed
 * while this tab was open, so the old file is gone), reload the page once to
 * pick up the new version. If it fails again right after a reload, the error
 * reaches the error boundary as usual.
 */
export function lazyPage<T extends ComponentType<object>>(load: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const mod = await load();
      try {
        sessionStorage.removeItem(RELOAD_KEY);
      } catch {
        // Storage unavailable: nothing to clear.
      }
      return mod;
    } catch (err) {
      let reloadedAlready = true;
      try {
        reloadedAlready = sessionStorage.getItem(RELOAD_KEY) === location.pathname;
        if (!reloadedAlready) sessionStorage.setItem(RELOAD_KEY, location.pathname);
      } catch {
        // Without storage we can't guard against a reload loop, so don't reload.
      }
      if (!reloadedAlready) {
        location.reload();
        // Keep the loading state up while the page reloads.
        return new Promise<never>(() => {});
      }
      throw err;
    }
  });
}

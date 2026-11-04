import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Component, Suspense } from 'react';
import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { lazyPage } from './lazyPage';

class Catch extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? <p>failed</p> : this.props.children;
  }
}

function renderLazy(load: () => Promise<{ default: () => ReactNode }>) {
  const Page = lazyPage(load);
  return render(
    <Catch>
      <Suspense fallback={<p>loading</p>}>
        <Page />
      </Suspense>
    </Catch>,
  );
}

describe('lazyPage', () => {
  const reload = vi.fn();

  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal('location', { ...window.location, pathname: '/events', reload });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    reload.mockClear();
  });

  it('renders the page once its code loads', async () => {
    renderLazy(() => Promise.resolve({ default: () => <p>events page</p> }));
    expect(await screen.findByText('events page')).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });

  it('reloads once when the code fails to load, keeping the loading state up', async () => {
    renderLazy(() => Promise.reject(new Error('Failed to fetch dynamically imported module')));
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    expect(screen.getByText('loading')).toBeInTheDocument();
    expect(sessionStorage.getItem('vfa-chunk-reload')).toBe('/events');
  });

  it('shows the error instead of reloading again right after a reload', async () => {
    sessionStorage.setItem('vfa-chunk-reload', '/events');
    renderLazy(() => Promise.reject(new Error('Failed to fetch dynamically imported module')));
    expect(await screen.findByText('failed')).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });

  it('clears the reload marker after a successful load', async () => {
    sessionStorage.setItem('vfa-chunk-reload', '/events');
    renderLazy(() => Promise.resolve({ default: () => <p>events page</p> }));
    await screen.findByText('events page');
    expect(sessionStorage.getItem('vfa-chunk-reload')).toBeNull();
  });
});

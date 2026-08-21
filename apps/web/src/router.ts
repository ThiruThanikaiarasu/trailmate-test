import { useEffect, useState } from 'react';

export type Route =
  | { name: 'trips' }
  | { name: 'trip'; id: number }
  | { name: 'shared'; token: string }
  | { name: 'notFound' };

export function parseRoute(pathname: string): Route {
  if (pathname === '/' || pathname === '') return { name: 'trips' };
  const trip = /^\/trips\/(\d+)\/?$/.exec(pathname);
  if (trip) return { name: 'trip', id: Number(trip[1]) };
  const shared = /^\/shared\/([\w-]+)\/?$/.exec(pathname);
  if (shared) return { name: 'shared', token: shared[1] };
  return { name: 'notFound' };
}

export function navigate(path: string): void {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.pathname));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return route;
}

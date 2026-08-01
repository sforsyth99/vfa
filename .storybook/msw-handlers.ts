import { http, HttpResponse } from 'msw';

const WP = 'https://api.victoriafestivalofauthors.ca/wp-json/wp/v2';
const VFA = 'https://api.victoriafestivalofauthors.ca/wp-json/vfa/v1';

export const mswHandlers = [
  http.get(`${WP}/menus`, () => HttpResponse.json([])),
  http.get(`${WP}/menu-items`, () => HttpResponse.json([])),
  http.get(`${WP}/pages`, () => HttpResponse.json([])),
  http.get(`${WP}/festival_events`, () => HttpResponse.json([])),
  http.get(`${WP}/interviews`, () => HttpResponse.json([])),
  http.get(`${VFA}/people/:id/books`, () => HttpResponse.json([])),
  http.get(`${VFA}/people/:id/events`, () => HttpResponse.json([])),
];

// Centralized API helpers for the Cars Dealership Review Application.
//
// - The Django backend (auth) is reached through DJANGO_BASE_URL.
// - The Node/Express + MongoDB microservice (dealers/reviews) is reached
//   through NODE_BASE_URL.
//
// Both default to same-origin-relative paths in production (when served
// behind a reverse proxy / ingress) but can be overridden with Vite env
// vars for local development.

export const DJANGO_BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL || 'http://localhost:8000';
export const NODE_BASE_URL = import.meta.env.VITE_NODE_BASE_URL || 'http://localhost:3000';

async function asJson(res) {
  if (!res.ok && res.status >= 500) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

// ---- Django auth endpoints ----

export function loginUser(userName, password) {
  return fetch(`${DJANGO_BASE_URL}/djangoapp/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  }).then(asJson);
}

export function registerUser({ userName, password, firstName, lastName, email }) {
  return fetch(`${DJANGO_BASE_URL}/djangoapp/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password, firstName, lastName, email }),
  }).then(asJson);
}

export function logoutUser() {
  return fetch(`${DJANGO_BASE_URL}/djangoapp/logout`, { method: 'GET' }).then(asJson);
}

export function fetchCarModels() {
  return fetch(`${DJANGO_BASE_URL}/djangoapp/get_cars`).then(asJson);
}

// ---- Node/Express dealer + review endpoints ----

export function fetchDealers(state) {
  const url = state
    ? `${NODE_BASE_URL}/fetchDealers/${state}`
    : `${NODE_BASE_URL}/fetchDealers`;
  return fetch(url).then(asJson);
}

export function fetchDealer(id) {
  return fetch(`${NODE_BASE_URL}/fetchDealer/${id}`).then(asJson);
}

export function fetchReviews(dealerId) {
  return fetch(`${NODE_BASE_URL}/fetchReviews/dealer/${dealerId}`).then(asJson);
}

export function postReview(review) {
  return fetch(`${NODE_BASE_URL}/insert_review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  }).then(asJson);
}

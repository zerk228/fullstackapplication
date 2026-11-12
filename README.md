# Cars Dealership Review Application

**Project Name:** Cars Dealership Review Application

**Repository Name:** fullstackapplication

## Description

Cars Dealership Review Application is a full-stack web application built
for the IBM Full Stack Application Development Capstone. It lets visitors
browse car dealership locations across the United States, filter dealers by
state, view a dealer's details and customer reviews (each automatically
tagged with a sentiment), register/log in, and submit their own review for
a dealership they've visited.

## Architecture Overview

The application is composed of three independently deployable services:

1. **React frontend** (`frontend/`) — a single-page application (built
   with Vite) that renders the Home, Dealers, Dealer Details, Post Review,
   Login, Register, About Us, and Contact Us pages, using React Router for
   client-side navigation. It calls the Django service for authentication
   and the Node service for dealer/review data.
2. **Django backend** (`backend/`) — serves the static About Us / Contact
   Us pages via server-rendered templates and exposes a small JSON API
   (`/djangoapp/register`, `/djangoapp/login`, `/djangoapp/logout`,
   `/djangoapp/check_session`) built on Django's built-in `User` model for
   authentication. Uses SQLite for the user database.
3. **Node.js/Express microservice** (`database/`) — a backend service
   backed by MongoDB (via Mongoose) that owns the `Dealer` and `Review`
   collections and exposes `/fetchDealers`, `/fetchDealers/:state`,
   `/fetchDealer/:id`, `/fetchReviews/dealer/:id`, and `POST
   /insert_review`. Every submitted review is passed through a
   lightweight offline sentiment analyzer before being stored.

```
Browser  →  React (nginx, :80)
               │
               ├──> Django backend (:8000)  — auth, static pages, SQLite
               └──> Node backend  (:3000)   — dealers/reviews, MongoDB (:27017)
```

## Tech Stack

- React (Vite) + React Router
- Django + Django REST Framework
- Node.js + Express
- MongoDB + Mongoose
- SQLite (Django's user database)
- Docker & Docker Compose
- Kubernetes
- GitHub Actions
- IBM Cloud Code Engine (deployment target)

## Running Locally

The simplest way to run the whole stack (MongoDB + Node backend + Django
backend + React frontend) is with Docker Compose:

```bash
docker-compose up --build
```

Once the containers are up:

- React frontend: http://localhost:8080
- Django backend: http://localhost:8000/djangoapp/
- Node microservice: http://localhost:3000
- MongoDB: localhost:27017

Seed the MongoDB database with sample dealers and reviews:

```bash
docker-compose exec node-backend node seed.js
```

### Running services individually (without Docker)

```bash
# Django backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Node microservice (requires a local or remote MongoDB instance)
cd database
npm install
npm run seed   # optional sample data
npm start

# React frontend
cd frontend
npm install
npm run dev
```

## Deployment

The project is containerized with one `Dockerfile` per service
(`backend/Dockerfile`, `database/Dockerfile`, `frontend/Dockerfile`, the
last being a multi-stage build that serves the production React bundle
with nginx). CI is handled by `.github/workflows/ci.yml`, which on every
push to `main` installs dependencies, runs the Django system checks,
the Node sentiment unit tests, lints and builds the React app, and builds
all three Docker images.

For production, the application is deployed to a **Kubernetes** cluster
using the manifests in `k8s/` — a `Deployment` + `Service` for each of
`django-backend`, `node-backend`, `react-frontend`, plus `mongo-db`. At a
high level, the deployment flow to **IBM Cloud Code Engine** is:

1. Build and push each Docker image to IBM Cloud Container Registry
   (`ibmcloud cr build ...` or `docker build` + `docker push`).
2. Create (or reuse) an IBM Cloud Code Engine project:
   `ibmcloud ce project create --name car-dealership`.
3. Deploy each image as a Code Engine application, pointing the frontend's
   configured API base URLs at the deployed Django and Node service URLs:
   `ibmcloud ce application create --name react-frontend --image <registry>/react-frontend:latest --port 80`
   (repeated for `django-backend` and `node-backend`).
4. Provision MongoDB (e.g., a managed IBM Cloud Databases for MongoDB
   instance, or a Code Engine-managed container) and set the `MONGO_URL`
   environment variable on the Node service accordingly.
5. Alternatively, apply the manifests under `k8s/` directly to any
   Kubernetes cluster with `kubectl apply -f k8s/`.

## Sentiment Analysis

Every review submitted through `POST /insert_review` is passed through a
small, fully offline, keyword-based sentiment analyzer
(`database/sentiment.js`) — no external API or API key is required. The
analyzer scans the review text for a curated list of positive words (e.g.
"great", "friendly", "recommend") and negative words (e.g. "rude",
"terrible", "overpriced"), tallies the matches, and classifies the review
as `positive`, `negative`, or `neutral`. The resulting sentiment is stored
alongside the review and displayed as a colored badge on the Dealer
Details page in the React frontend.

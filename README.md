# FirstGlance — Campus Navigation System
### Graphic Era University, Dehradun

![FirstGlance](client/src/assets/geu.jpg)

A full-stack MERN campus navigation system with real-time GPS tracking, Dijkstra shortest-path routing, and an interactive Leaflet.js map for Graphic Era University.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Algorithm](#algorithm)
- [Setup & Installation](#setup--installation)
- [API Reference](#api-reference)
- [Folder Structure](#folder-structure)

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Vite + Leaflet.js      |
| Backend    | Node.js + Express 4               |
| Database   | MongoDB + Mongoose                |
| Routing    | React Router v6                   |
| Styling    | Pure CSS (no Tailwind)            |
| Fonts      | Cormorant Garamond + DM Sans      |

---

## Features

### 🗺️ Interactive Map
- Full-screen Leaflet.js map centred on GEU campus (30.2679, 77.9957)
- Colour-coded markers: buildings (blue), hostels (purple), labs (pink), cafeterias (orange), sports (green), gates (gold)
- Click any building to select it as origin (green) or destination (red)
- Animated dashed polyline shows the shortest route
- Tap blank map area to reset selection

### 🔍 Search System
- Case-insensitive real-time search
- Searches building names, lab names, hostel names
- Synthetic room support (CR101–CR312 per building)
- Dropdown with type icons
- Highlighted yellow marker on result

### 📍 Live Location Tracking
- Browser Geolocation API with `watchPosition`
- Pulsing purple marker moves in real time as you walk
- No battery-draining high-frequency polling

### ⚡ Shortest Path
- Dijkstra's algorithm running fully client-side
- Min-heap priority queue for O((V+E) log V) performance
- Computes path in < 1ms across 70+ nodes
- Animated path drawn as dashed green polyline
- Path resets when clicking a third building (new journey)

### 📊 Metrics Card
Floating card at bottom-centre shows:
- Total distance in metres
- Walking time at 1.11 m/s (shown as seconds if < 60s, else minutes)
- Number of intermediate waypoints

### 🗂️ Sidebar
- Slide-in panel (320px) with smooth CSS transition
- Shows selected route summary and metrics
- Cafeteria menus for all 5 food outlets
- Campus info (founded, area, students, departments)
- Map legend with colour guide
- On desktop the map shifts right; on mobile it overlays

---

## Architecture

```
Browser
  ├── React App (Vite)
  │     ├── LandingPage  — hero, parallax, scroll-reveal features
  │     ├── MapPage      — state orchestrator for map system
  │     ├── MapView      — Leaflet integration, markers, polylines
  │     ├── Navbar       — search bar with live dropdown
  │     ├── Sidebar      — slide-in info panel
  │     └── MetricsBox   — floating path stats card
  │
  └── Utils
        ├── dijkstra.js  — MinHeap + Dijkstra algorithm
        ├── api.js       — fetch wrappers for REST API
        └── mapData.js   — static fallback data + node type helpers

Express API (port 5000)
  ├── GET /api/nodes            — all campus nodes
  ├── GET /api/nodes/search?q=  — fuzzy search
  ├── GET /api/nodes/type/:type — filter by type
  ├── GET /api/edges            — all edges
  └── GET /api/edges/graph      — adjacency list object

MongoDB
  ├── nodes collection  — { name, lat, lng, type, rooms[], description }
  └── edges collection  — { from, to, weight }
```

---

## Algorithm

### Dijkstra's Shortest Path

Implemented in `client/src/utils/dijkstra.js` using a custom **Min-Heap** priority queue.

**Time Complexity:** O((V + E) log V)  
**Space Complexity:** O(V)  
where V = nodes (70+), E = edges (80+)

**Steps:**
1. Initialise all distances to `Infinity`, source to `0`
2. Push source into min-heap with `dist = 0`
3. Pop minimum-distance node from heap
4. Skip if already visited
5. For each unvisited neighbour, compute `newDist = currentDist + edgeWeight`
6. If `newDist < known distance`, update and push to heap
7. Track predecessors in `prev` map for path reconstruction
8. Once destination is popped, reconstruct path by walking `prev` backwards

**Graph encoding:** Adjacency list stored as `{ nodeName: { neighbor: weight } }`.  
Edge weights represent approximate walking distance in metres.

### Walking Time Formula

```js
const WALKING_SPEED = 1.11; // metres per second (4 km/h average)
const seconds = Math.round(distance / WALKING_SPEED);
// Display: "45s" if < 60, else "3m 20s"
```

---

## Setup & Installation

### Prerequisites

- Node.js ≥ 18
- MongoDB ≥ 6 (local instance on `mongodb://localhost:27017`)
- npm ≥ 9
- Modern browser with Geolocation API support

### 1. Clone & Install

```bash
git clone <repo-url>
cd firstglance

# Install all dependencies (root + server + client)
npm run install:all
```

### 2. Configure Environment

```bash
# server/.env is pre-configured with:
PORT=5000
MONGO_URI=mongodb://localhost:27017/firstglance
```

Edit `server/.env` if your MongoDB runs on a different host/port.

### 3. Seed the Database

```bash
npm run seed
# Output:
# ✅ MongoDB connected
# 🗑️  Cleared existing data
# ✅ Seeded 70 nodes
# ✅ Seeded 82 edges
# 🎉 Database seeded successfully!
```

### 4. Run in Development

```bash
npm run dev
# Starts:
#   Backend  → http://localhost:5000
#   Frontend → http://localhost:3000
```

### 5. Build for Production

```bash
cd client && npm run build
# Outputs to client/dist/
```

---

## API Reference

### Nodes

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/nodes`              | All campus nodes             |
| GET    | `/api/nodes/search?q=lab` | Search nodes (case-insensitive) |
| GET    | `/api/nodes/type/building`| Filter by type               |
| GET    | `/api/nodes/:name`        | Get node by exact name       |

### Edges

| Method | Endpoint          | Description           |
|--------|-------------------|-----------------------|
| GET    | `/api/edges`      | All edges             |
| GET    | `/api/edges/graph`| Adjacency list object |
| GET    | `/api/edges/from/:from` | Edges from a node |

### Health

| Method | Endpoint       | Description    |
|--------|----------------|----------------|
| GET    | `/api/health`  | Server status  |

---

## Folder Structure

```
firstglance/
│
├── package.json              # Root — runs both server & client
│
├── server/
│   ├── server.js             # Express entry point
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── models/
│   │   ├── Node.js           # Mongoose Node schema
│   │   └── Edge.js           # Mongoose Edge schema
│   ├── routes/
│   │   ├── nodeRoutes.js
│   │   └── edgeRoutes.js
│   ├── controllers/
│   │   ├── nodeController.js
│   │   └── edgeController.js
│   └── seed/
│       └── seedData.js       # Converts JS dataset → MongoDB
│
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx          # React entry
│       ├── App.jsx           # Router
│       ├── assets/
│       │   └── geu.jpg       # Campus hero image
│       ├── styles/
│       │   └── global.css    # Design tokens, resets, Leaflet overrides
│       ├── pages/
│       │   ├── LandingPage.jsx + .css
│       │   └── MapPage.jsx + .css
│       ├── components/
│       │   ├── MapView.jsx + .css
│       │   ├── Navbar.jsx + .css
│       │   ├── Sidebar.jsx + .css
│       │   └── MetricsBox.jsx + .css
│       └── utils/
│           ├── dijkstra.js   # Algorithm + helpers
│           ├── api.js        # API fetch wrappers
│           └── mapData.js    # Static fallback + node helpers
│
├── README.md
└── requirements.txt
```

---

## Browser Requirements

- Chrome 80+ / Firefox 75+ / Safari 14+ / Edge 80+
- Geolocation API (HTTPS or localhost required for live tracking)
- JavaScript enabled
- WebGL not required

---

## Campus Data

- **70 nodes** — 28 named locations + 48 road waypoints
- **82 edges** — weighted by approximate walking distance (metres)
- **5 types of named locations:** buildings, gates, hostels, cafeterias, sports, labs, library

---

*Built with ❤️ for Graphic Era University students.*

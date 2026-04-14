/**
 * Dijkstra's Shortest Path Algorithm
 * Client-side utility for FirstGlance campus navigation
 *
 * Graph format: { nodeName: { neighbor: weight, ... }, ... }
 *
 * Returns: { path: string[], distance: number } | null
 */

class MinHeap {
  constructor() {
    this._data = [];
  }

  push(item) {
    this._data.push(item);
    this._bubbleUp(this._data.length - 1);
  }

  pop() {
    const top = this._data[0];
    const last = this._data.pop();
    if (this._data.length > 0) {
      this._data[0] = last;
      this._sinkDown(0);
    }
    return top;
  }

  get size() {
    return this._data.length;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this._data[parent].dist <= this._data[i].dist) break;
      [this._data[parent], this._data[i]] = [this._data[i], this._data[parent]];
      i = parent;
    }
  }

  _sinkDown(i) {
    const n = this._data.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this._data[l].dist < this._data[smallest].dist) smallest = l;
      if (r < n && this._data[r].dist < this._data[smallest].dist) smallest = r;
      if (smallest === i) break;
      [this._data[smallest], this._data[i]] = [this._data[i], this._data[smallest]];
      i = smallest;
    }
  }
}

/**
 * Run Dijkstra from `start` to `end` on the given graph.
 *
 * @param {Object} graph - adjacency list { node: { neighbor: weight } }
 * @param {string} start - source node name
 * @param {string} end   - destination node name
 * @returns {{ path: string[], distance: number } | null}
 */
export function dijkstra(graph, start, end) {
  if (!graph[start] || !graph[end]) return null;
  if (start === end) return { path: [start], distance: 0 };

  const dist = {};
  const prev = {};
  const visited = new Set();

  // Initialise all distances to Infinity
  for (const node of Object.keys(graph)) {
    dist[node] = Infinity;
  }
  dist[start] = 0;

  const heap = new MinHeap();
  heap.push({ node: start, dist: 0 });

  while (heap.size > 0) {
    const { node: current, dist: currentDist } = heap.pop();

    if (visited.has(current)) continue;
    visited.add(current);

    if (current === end) break;

    const neighbors = graph[current];
    if (!neighbors) continue;

    for (const [neighbor, weight] of Object.entries(neighbors)) {
      if (visited.has(neighbor)) continue;
      const newDist = currentDist + weight;
      if (newDist < (dist[neighbor] ?? Infinity)) {
        dist[neighbor] = newDist;
        prev[neighbor] = current;
        heap.push({ node: neighbor, dist: newDist });
      }
    }
  }

  if (dist[end] === Infinity) return null; // no path

  // Reconstruct path
  const path = [];
  let current = end;
  while (current !== undefined) {
    path.unshift(current);
    current = prev[current];
  }

  return { path, distance: dist[end] };
}

/**
 * Convert a node path to lat/lng coordinate array using nodes map.
 *
 * @param {string[]} path
 * @param {Object} nodesMap - { name: { lat, lng } }
 * @returns {[number, number][]}
 */
export function pathToLatLng(path, nodesMap) {
  return path
    .map((name) => {
      const n = nodesMap[name];
      return n ? [n.lat, n.lng] : null;
    })
    .filter(Boolean);
}

/**
 * Format walking time from distance.
 * Walking speed: 1.11 m/s
 *
 * @param {number} distance - in graph weight units (approx metres)
 * @returns {string}
 */
export function formatWalkingTime(distance) {
  const WALKING_SPEED = 1.11; // m/s
  const seconds = Math.round(distance / WALKING_SPEED);
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

/**
 * Build a flat adjacency-list graph from the API nodes+edges response.
 * Edges are treated as undirected (bidirectional).
 *
 * @param {Array} edges - [{ from, to, weight }]
 * @returns {Object} graph
 */
export function buildGraphFromEdges(edges) {
  const graph = {};
  for (const { from, to, weight } of edges) {
    if (!graph[from]) graph[from] = {};
    if (!graph[to]) graph[to] = {};
    graph[from][to] = weight;
    graph[to][from] = weight;
  }
  return graph;
}

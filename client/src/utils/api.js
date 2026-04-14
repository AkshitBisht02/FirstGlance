const BASE_URL = '/api';

export async function fetchNodes() {
  const res = await fetch(`${BASE_URL}/nodes`);
  if (!res.ok) throw new Error('Failed to fetch nodes');
  const data = await res.json();
  return data.data; // array of node objects
}

export async function fetchEdges() {
  const res = await fetch(`${BASE_URL}/edges`);
  if (!res.ok) throw new Error('Failed to fetch edges');
  const data = await res.json();
  return data.data; // array of edge objects
}

export async function searchNodes(query) {
  if (!query.trim()) return [];
  const res = await fetch(`${BASE_URL}/nodes/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.data;
}

export async function fetchGraphAdjacency() {
  const res = await fetch(`${BASE_URL}/edges/graph`);
  if (!res.ok) throw new Error('Failed to fetch graph');
  const data = await res.json();
  return data.data; // adjacency list object
}

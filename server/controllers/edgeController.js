const Edge = require('../models/Edge');

// GET all edges
exports.getAllEdges = async (req, res) => {
  try {
    const edges = await Edge.find({});
    res.json({ success: true, count: edges.length, data: edges });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET adjacency list (graph structure for client-side Dijkstra)
exports.getAdjacencyList = async (req, res) => {
  try {
    const edges = await Edge.find({});
    const graph = {};
    edges.forEach(({ from, to, weight }) => {
      if (!graph[from]) graph[from] = {};
      if (!graph[to]) graph[to] = {};
      graph[from][to] = weight;
      graph[to][from] = weight; // undirected
    });
    res.json({ success: true, data: graph });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET edges from a specific node
exports.getEdgesFrom = async (req, res) => {
  try {
    const { from } = req.params;
    const edges = await Edge.find({ from });
    res.json({ success: true, data: edges });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

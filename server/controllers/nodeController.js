const Node = require('../models/Node');

// GET all nodes
exports.getAllNodes = async (req, res) => {
  try {
    const nodes = await Node.find({});
    res.json({ success: true, count: nodes.length, data: nodes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET node by name (case-insensitive)
exports.getNodeByName = async (req, res) => {
  try {
    const { name } = req.params;
    const node = await Node.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!node) return res.status(404).json({ success: false, error: 'Node not found' });
    res.json({ success: true, data: node });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET search nodes (partial, case-insensitive, includes rooms)
exports.searchNodes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const regex = new RegExp(q, 'i');

    // Search by name
    const byName = await Node.find({ name: regex });

    // Search by room (rooms array contains string matching query)
    const byRoom = await Node.find({ rooms: regex });

    // Merge and deduplicate
    const combined = [...byName];
    byRoom.forEach((r) => {
      if (!combined.find((n) => n._id.equals(r._id))) combined.push(r);
    });

    res.json({ success: true, data: combined });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET nodes by type
exports.getNodesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const nodes = await Node.find({ type });
    res.json({ success: true, count: nodes.length, data: nodes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const express = require('express');
const router = express.Router();
const { getAllEdges, getAdjacencyList, getEdgesFrom } = require('../controllers/edgeController');

router.get('/', getAllEdges);
router.get('/graph', getAdjacencyList);
router.get('/from/:from', getEdgesFrom);

module.exports = router;

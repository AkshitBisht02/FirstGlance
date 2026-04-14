const express = require('express');
const router = express.Router();
const { getAllNodes, getNodeByName, searchNodes, getNodesByType } = require('../controllers/nodeController');

router.get('/', getAllNodes);
router.get('/search', searchNodes);
router.get('/type/:type', getNodesByType);
router.get('/:name', getNodeByName);

module.exports = router;

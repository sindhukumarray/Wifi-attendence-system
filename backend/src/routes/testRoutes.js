const express = require('express');
const router = express.Router();
const { pingServer } = require('../controllers/testController');

router.get('/ping', pingServer);

module.exports = router;

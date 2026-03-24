const express = require('express');
const { generarAudio } = require('../controllers/vozController');

const router = express.Router();

router.post('/', generarAudio);

module.exports = router;

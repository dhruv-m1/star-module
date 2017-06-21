//STAR Module - Written by Dhruv Malik
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.use('/', require('./types/post/execute'));
router.use('/', require('./types/get/execute'));
router.use('/', require('./types/put/execute'));
router.use('/', require('./types/delete/execute'));

module.exports = router;
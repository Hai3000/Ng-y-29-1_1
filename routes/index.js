var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/products', require('./products'));
router.use('/categories', require('./categories'));
router.use('/roles', require('./roles'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
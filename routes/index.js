const {Router} = require('express');

const router = Router();

const productCtrl = require('../controller/ProductController');

router.get('/products', productCtrl.getProductView);

module.exports = router;
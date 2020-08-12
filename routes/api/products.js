const {Router} = require('express');

const router = Router();

const productCtrl = require('./../../controller/ProductController');

router.get('/products', productCtrl.get)
router.put('/products', productCtrl.create)
router.post('/products/:productId', productCtrl.update)

router.get('/products/top-seller' ,productCtrl.getTopSeller)
router.get('/products/top-sale' ,productCtrl.getTopSale)

module.exports = router;

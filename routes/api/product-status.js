const {Router} = require('express');

const router = Router();

const productStatusCtrl = require('../../controller/ProductStatusController');

router.get('/product-status', productStatusCtrl.get);
router.post('/product-status/:statusId', productStatusCtrl.update);
router.put('/product-status', productStatusCtrl.create);

module.exports = router;

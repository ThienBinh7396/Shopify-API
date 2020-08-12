const {Router} = require('express');

const router = Router();

const vendorCtrl = require('./../../controller/VendorController');

router.get('/vendors', vendorCtrl.get)
router.put('/vendors', vendorCtrl.create)
router.post('/vendors/:vendorId', vendorCtrl.update)

module.exports = router;

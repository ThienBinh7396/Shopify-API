const {Router} = require('express');

const router = Router();

const categoryCtrl = require('./../../controller/CategoryController');

router.get('/categories', categoryCtrl.get)
router.put('/categories', categoryCtrl.create)
router.post('/categories/:categoryId', categoryCtrl.update)
router.delete('/categories/:categoryId', categoryCtrl.delete)

module.exports = router;

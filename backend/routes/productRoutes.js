const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductdetail } = require('../controller/productController');
const isAuthenticatedUser = require('../middleware/auth');

const router = express.Router();



router.route('/products').get(isAuthenticatedUser, getAllProducts);
router.route('/products/new').post(createProduct);
router.route('/products/:id').put(updateProduct);
router.route('/products/:id').delete(deleteProduct).get(getProductdetail);

module.exports =router;
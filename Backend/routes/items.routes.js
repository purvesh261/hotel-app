const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, isAdmin } = require('../controller/authorization')
const controller = require('../controller/items.controller')

router.get('/', authenticateToken, controller.getItems);
router.get('/:id', authenticateToken, controller.getItemById);
router.post('/create', 
    authenticateToken,
    isAdmin,
    body('itemName')
        .isAlphanumeric('en-US', {ignore: ' '})
        .isLength({ min: 3 }),
    body('price')
        .isFloat({ min: 0}),
    controller.createItem)
router.put('/:id',
    authenticateToken,
    isAdmin,
    body('itemName')
        .isAlphanumeric('en-US', {ignore: ' '})
        .isLength({ min: 3 }),
    body('price')
        .isFloat({ min: 0}),
    controller.updateItem);
router.put('/image/:id',
    authenticateToken,
    isAdmin,
    controller.uploadImage);
router.delete('/:id',
    authenticateToken,
    isAdmin,
    controller.deleteItem);
module.exports = router;
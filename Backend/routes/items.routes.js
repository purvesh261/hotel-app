const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken, isAdmin } = require('../controller/authorization')
const controller = require('../controller/items.controller')

router.get('/', authenticateToken, controller.getItems);
router.post('/create', 
    authenticateToken,
    isAdmin,
    body('itemName')
        .isAlphanumeric('en-US', {ignore: ' '})
        .isLength({ min: 3 }),
    body('price')
        .isInt({ min: 0}),
    controller.createItem)
router.put('/:id',
    authenticateToken,
    isAdmin,
    body('itemName')
        .isAlphanumeric('en-US', {ignore: ' '})
        .isLength({ min: 3 }),
    body('price')
        .isInt({ min: 0}),
    controller.updateItem)
router.delete('/:id',
    authenticateToken,
    isAdmin,
    controller.deleteItem)
module.exports = router;
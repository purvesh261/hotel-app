const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const controller = require('../controller/users.controller')
const { authenticateToken } = require('../controller/authorization.js')

router.post('/auth/google', controller.googleLogin);
router.get('/', authenticateToken, controller.getUsers);
router.post('/authenticate', body('username').isAlphanumeric().isLength({ min: 3 }), controller.authenticate);
router.post('/create',
        body('username').matches('^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$'),
        body('email').isEmail(),
        body('password', 
            'Password must be combination of one uppercase, one lower case, one special character, one digit and min 6 char long')
            .matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'),
        controller.createUser);
router.put('/:id', authenticateToken, controller.updateUser);
router.delete('/:id', authenticateToken, controller.deleteUser);
module.exports = router;


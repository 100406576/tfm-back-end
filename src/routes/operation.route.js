const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const operationController = require('../controllers/operation.controller.js');

const router = express.Router();

router.get('/operations/property/:property_id', authMiddleware, operationController.readOperationsOfProperty);
router.get('/operations/:operation_id', authMiddleware, operationController.readOperation);
router.post('/operations', authMiddleware, operationController.createOperation);
router.put('/operations/:operation_id', authMiddleware, operationController.updateOperation);
router.delete('/operations/:operation_id', authMiddleware, operationController.deleteOperation);

module.exports = router;

const express = require('express');
const documentController = require('../controllers/document.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/documents', authMiddleware, documentController.uploadDocument);
//router.get('/documents/:document_id', authMiddleware, documentController.getDocument);
//router.delete('/documents/:document_id', authMiddleware, documentController.deleteDocument);

module.exports = router;

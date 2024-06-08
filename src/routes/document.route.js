const express = require('express');
const documentController = require('../controllers/document.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/documents', authMiddleware, documentController.uploadDocument);
router.get('/documents', authMiddleware, documentController.readDocumentsOfUser);
router.get('/documents/:document_id', authMiddleware, documentController.readDocument);
router.delete('/documents/:document_id', authMiddleware, documentController.deleteDocument);
router.delete('/documents', authMiddleware, documentController.deleteDocumentsOfUser);

module.exports = router;

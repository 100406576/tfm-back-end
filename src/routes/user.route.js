import { Router } from 'express';
import { readUsers, createUser } from '../controllers/user.controller.js'

const router = Router();

router.get('/users', readUsers);
router.post('/users', createUser)

export default router;
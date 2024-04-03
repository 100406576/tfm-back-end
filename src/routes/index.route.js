import { Router } from 'express';
import pingRoute from '../routes/ping.route.js'

const router = Router();

router.use('/', pingRoute);

export default router;
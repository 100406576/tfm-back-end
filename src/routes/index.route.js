import { Router } from 'express';
import pingRoute from '../routes/ping.route.js'
import userRoute from '../routes/user.route.js'

const router = Router();

router.use('/', pingRoute);
router.use('/', userRoute);

export default router;
import { Router } from "express";
const router = Router();

import authRoute from "./auth.route";
import adminRoute from "./admin/index.routes";

router.use('/auth', authRoute);
router.use('/admin', adminRoute);

export default router;
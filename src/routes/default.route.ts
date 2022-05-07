import { Router, Request, Response } from "express";
import { seedController } from "../controllers/seed.controller";
import { resetController } from "../controllers/reset.controller";

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
    res.send('ok');
});

/* GET home page. */
router.get('/', function(_req: Request, res: Response) {
    res.send({ status: 200 });
});

router.get('/seed', seedController);
router.get('/reset', resetController);

export default router;
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import sessionsRouter from "./sessions";
import pairingRouter from "./pairing";
import membershipRouter from "./membership";
import statsRouter from "./stats";
import logsRouter from "./logs";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sessionsRouter);
router.use(pairingRouter);
router.use(membershipRouter);
router.use(statsRouter);
router.use(logsRouter);
router.use(adminRouter);

export default router;

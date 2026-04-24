import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { annunciRouter } from "./annunci";
import { categorieRouter } from "./categorie";
import { statsRouter } from "./stats";
import { forumRouter } from "./forum";
import { profiloRouter } from "./profilo";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/annunci", annunciRouter);
router.use("/categorie", categorieRouter);
router.use("/stats", statsRouter);
router.use("/forum", forumRouter);
router.use("/profilo", profiloRouter);
router.use("/admin", adminRouter);

export default router;
